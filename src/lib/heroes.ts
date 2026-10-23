import { cache } from 'react';
import { fetchREST, fetchWPJson } from './wp-rest';

/**
 * Chemins de repli si WordPress est indisponible.
 * Les clés correspondent aux pages et servent aussi de nom de média
 * WordPress (`hero-<clé>`) quand ACF n'est pas configuré.
 */
const HERO_FALLBACKS = {
  contact: '/images/hero-header/contact-page.jpg',
  actualites: '/images/hero-header/blog-page.jpg',
  services: '/images/hero-header/services-page.jpg',
  projets:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1800',
  galerie:
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600',
  'qui-sommes-nous':
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1800',
  'politique-de-confidentialite':
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1800&q=70',
  'conditions-generales-utilisation':
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=70',
} as const;

export type HeroKey = keyof typeof HERO_FALLBACKS;
export type Heroes = Record<HeroKey, string>;

type AcfImage =
  | string
  | number
  | { url?: string; source_url?: string }
  | null
  | undefined;

/**
 * Route ACF PRO de l'Options Page (ex. `acf/v3/options/site-heros`).
 * Si non définie, on utilise la médiathèque WordPress (`hero-<clé>`).
 */
const ACF_OPTIONS_PATH = process.env.WORDPRESS_ACF_OPTIONS_PATH;

function toImageUrl(value: AcfImage): string | null {
  if (typeof value === 'string' && value.trim()) return value;
  if (value && typeof value === 'object') {
    return value.url || value.source_url || null;
  }
  return null;
}

/**
 * Selon la version d'ACF / du plugin REST, la réponse peut être :
 * `{ hero_contact: … }`, `{ acf: { hero_contact: … } }`
 * ou `[{ name: 'hero_contact', value: … }]`.
 */
function readField(payload: unknown, field: string): AcfImage {
  if (Array.isArray(payload)) {
    const found = payload.find(
      (item) => item && typeof item === 'object' && item.name === field
    );
    return found?.value ?? null;
  }

  if (payload && typeof payload === 'object') {
    const root = payload as Record<string, unknown>;
    const source =
      root.acf && typeof root.acf === 'object'
        ? (root.acf as Record<string, unknown>)
        : root;
    return source[field] as AcfImage;
  }

  return null;
}

async function fromAcfOptions(): Promise<Partial<Heroes>> {
  const payload = await fetchWPJson<unknown>(ACF_OPTIONS_PATH as string);
  const remote: Partial<Heroes> = {};

  for (const key of Object.keys(HERO_FALLBACKS) as HeroKey[]) {
    const field = `hero_${key.replace(/-/g, '_')}`;
    const url = toImageUrl(readField(payload, field));
    if (url) remote[key] = url;
  }

  return remote;
}

/**
 * Sans ACF : chaque héros est un média WordPress dont le slug est
 * `hero-<clé>` (ex. fichier `hero-contact.jpg` → slug `hero-contact`).
 */
async function fromMediaLibrary(key: HeroKey): Promise<string | null> {
  const items = await fetchREST<Array<{ source_url?: string }>>(
    `media?slug=hero-${key}&per_page=1&_fields=source_url`
  );
  return items?.[0]?.source_url || null;
}

/**
 * Heros des pages statiques : ACF Options Page si configurée, sinon
 * médiathèque WordPress, avec repli local automatique.
 */
export const getHeroes = cache(async (): Promise<Heroes> => {
  const fallbacks = HERO_FALLBACKS as Record<HeroKey, string>;

  try {
    if (ACF_OPTIONS_PATH) {
      return { ...fallbacks, ...(await fromAcfOptions()) };
    }

    const remote: Partial<Heroes> = {};
    const pairs = await Promise.all(
      (Object.keys(fallbacks) as HeroKey[]).map(async (key) => {
        try {
          return [key, await fromMediaLibrary(key)] as const;
        } catch {
          return [key, null] as const;
        }
      })
    );
    for (const [key, url] of pairs) {
      if (url) remote[key] = url;
    }

    return { ...fallbacks, ...remote };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[WP] heros indisponibles, repli local : ${message}`);
    return { ...fallbacks };
  }
});
