import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{6,20}$/;
const MAX_BODY = 32 * 1024;
const SERVICES = ['incendie', 'btp', 'forage', 'solaire', 'drones', 'naval', 'autre'];

// Rate-limit best-effort en mémoire : 5 envois / heure / IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000;
  const list = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  if (list.length >= 5) return true;
  list.push(now);
  hits.set(ip, list);
  return false;
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
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 30) : '';
  const service = typeof body.service === 'string' ? body.service.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (phone && !PHONE_RE.test(phone)) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
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
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'too_many_requests' }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'contact@bnp-coorporation.com';
  if (!apiKey) {
    // Pas de transport configuré : on ne fait jamais semblant d'avoir envoyé.
    console.error('[contact] RESEND_API_KEY manquante, message non envoyé', { name, email });
    return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 });
  }

  const from = process.env.CONTACT_FROM_EMAIL || 'contact@bnp-coorporation.com';
  const text = [
    `Nom : ${name}`,
    `Email : ${email}`,
    phone ? `Téléphone : ${phone}` : null,
    service ? `Service : ${service}` : null,
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
        subject: service ? `[Contact BNPC] ${service} — ${name}` : `[Contact BNPC] Message de ${name}`,
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
