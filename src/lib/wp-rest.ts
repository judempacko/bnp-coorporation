const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.bnp-coorporation.com/wp-json/wp/v2";

/** Racine `/wp-json` (hors namespace `wp/v2`) pour les routes ACF, etc. */
const WP_JSON_URL = API_URL.replace(/\/wp-json\/.*$/, "/wp-json");

/**
 * Délai max d'un appel WP : évite de bloquer le rendu quand l'hôte
 * ne répond pas (WAF lent, challenge anti-bot, DNS…).
 */
const FETCH_TIMEOUT_MS = 10_000;

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  // Certains WAF / pare-feu (Cloudflare Bot Fight Mode, ModSecurity…)
  // bloquent les requêtes sans User-Agent navigateur : on s'identifie
  // en client HTTP classique. Insuffisant contre un challenge JS/cookie
  // (ex. LiteSpeed reCAPTCHA) — voir le message d'erreur 403 ci-dessous.
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent":
        "BNPC-Frontend/1.0 (+https://bnp-coorporation.com; Next.js fetch)",
      ...(options.headers || {}),
    },
    signal: options.signal ?? AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: 60, ...(options.next || {}) },
  });

  if (!res.ok) {
    const wafHint =
      res.status === 403
        ? " — accès refusé par l'hébergeur AVANT WordPress (page anti-bot Cloudflare/LiteSpeed au lieu de JSON : exclure `/wp-json/*` du challenge bot / Bot Fight Mode côté hébergeur, ou autoriser l'IP du frontend)"
        : "";
    throw new Error(
      `WP REST API Error (${res.status}): Failed to fetch ${url}${wafHint}`
    );
  }

  return res.json();
}

export async function fetchREST<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = API_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");
  return request<T>(`${baseUrl}/${cleanEndpoint}`, options);
}

/**
 * Appel à la racine `/wp-json` (ex. `acf/v3/options/options`).
 */
export async function fetchWPJson<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = WP_JSON_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");
  return request<T>(`${baseUrl}/${cleanEndpoint}`, options);
}
