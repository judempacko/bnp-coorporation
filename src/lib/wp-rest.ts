const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.bnp-coorporation.com/wp-json/wp/v2";

export async function fetchREST<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = API_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${baseUrl}/${cleanEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    next: { revalidate: 60, ...(options.next || {}) },
  });

  if (!res.ok) {
    throw new Error(
      `WP REST API Error (${res.status}): Failed to fetch ${url}`
    );
  }

  return res.json();
}
