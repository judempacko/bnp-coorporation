import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Nom : lettres (tous alphabets), espaces, apostrophes, points, tirets. Pas de chiffres ni symboles.
const NAME_RE = /^[\p{L}\p{M} '.-]+$/u;
const MAX_BODY = 32 * 1024;
const SERVICES = [
  'securite-incendie',
  'construction-btp',
  'forage-et-eau',
  'energies-renouvelables',
  'drones-imagerie-aerienne',
  'reparation-navale',
  'nettoyage-industriel',
  'autre',
];
// Libellés sérieux affichés dans l'email (alignés sur les noms du site).
const SERVICE_LABELS: Record<string, string> = {
  'securite-incendie': 'Sécurité incendie',
  'construction-btp': 'Construction (BTP)',
  'forage-et-eau': 'Forage et eau',
  'energies-renouvelables': 'Énergies renouvelables',
  'drones-imagerie-aerienne': 'Drones (imagerie aérienne)',
  'reparation-navale': 'Réparation navale',
  'nettoyage-industriel': 'Nettoyage industriel',
  autre: 'Autre demande',
};

// --- Rate-limit Redis (partagé entre toutes les instances serverless) ---
// Actif uniquement si les vars Upstash sont posées, sinon repli mémoire.
const redisEnabled =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redisRatelimit = redisEnabled
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
      prefix: 'bnpc-contact',
    })
  : null;

// --- Repli mémoire (dev local / avant config Upstash) ---
// Borné + purge pour éviter toute croissance infinie.
const MAX_ENTRIES = 2000;
const memoryHits = new Map<string, number[]>();
function memoryRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000;
  if (memoryHits.size > MAX_ENTRIES) {
    for (const [key, list] of memoryHits) {
      if (list.every((t) => t <= windowStart)) memoryHits.delete(key);
      if (memoryHits.size <= MAX_ENTRIES / 2) break;
    }
  }
  const list = (memoryHits.get(ip) ?? []).filter((t) => t > windowStart);
  if (list.length >= 5) return true;
  list.push(now);
  memoryHits.set(ip, list);
  return false;
}

async function isRateLimited(ip: string): Promise<boolean> {
  if (redisRatelimit) {
    try {
      const { success } = await redisRatelimit.limit(ip);
      return !success;
    } catch (e) {
      console.error('[contact] Redis ratelimit failed, fallback mémoire', String(e));
      return memoryRateLimited(ip);
    }
  }
  return memoryRateLimited(ip);
}

// --- Vérification Cloudflare Turnstile ---
// Active uniquement si TURNSTILE_SECRET_KEY est posée.
async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // non configuré = on laisse passer
  if (typeof token !== 'string' || token.length === 0) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return data?.success === true;
  } catch (e) {
    console.error('[contact] Turnstile verify failed', String(e));
    return false;
  }
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  message?: unknown;
  consent?: unknown;
  /** Honeypot anti-spam : doit rester vide. */
  company?: unknown;
  /** Token Turnstile fourni par le widget. */
  turnstileToken?: unknown;
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
    }
    body = JSON.parse(raw) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot rempli = bot : faux succès silencieux.
  if (typeof body.company === 'string' && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 25) : '';
  const service = typeof body.service === 'string' ? body.service.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || name.length > 100 || !NAME_RE.test(name)) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  // Téléphone international : chiffres/espaces/().-+ uniquement (lettres rejetées),
  // puis 7 à 15 chiffres au total (norme E.164, tous pays).
  if (phone) {
    if (!/^\+?[0-9\s().-]+$/.test(phone)) {
      return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
    }
  }
  if (service && !SERVICES.includes(service)) {
    return NextResponse.json({ ok: false, error: 'invalid_service' }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json({ ok: false, error: 'invalid_message' }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: 'consent_required' }, { status: 400 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (await isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'too_many_requests' }, { status: 429 });
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: 'turnstile_failed' }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'contact@bnp-coorporation.com';
  if (!apiKey) {
    // Pas de transport configuré : on ne fait jamais semblant d'avoir envoyé.
    console.error('[contact] RESEND_API_KEY manquante, message non envoyé');
    return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 });
  }

  const from = process.env.CONTACT_FROM_EMAIL || 'contact@bnp-coorporation.com';
  // Nom assaini : sans retours ligne (sujet d'email).
  const safeName = name.replace(/[\r\n]+/g, ' ');
  const serviceLabel = service ? (SERVICE_LABELS[service] ?? service) : '';
  const text = [
    `Nom : ${safeName}`,
    `Email : ${email}`,
    phone ? `Téléphone : ${phone}` : null,
    serviceLabel ? `Service : ${serviceLabel}` : null,
    '',
    message,
  ]
    .filter((l) => l !== null)
    .join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `BNPC Contact <${from}>`,
        to: [to],
        reply_to: email,
        subject: serviceLabel
          ? `[Contact BNPC] ${serviceLabel} — ${safeName}`
          : `[Contact BNPC] Message de ${safeName}`,
        text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[contact] Resend error', res.status, detail);
      return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
    }
  } catch (error) {
    console.error('[contact] fetch failed', String(error));
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
