/* eslint-disable @typescript-eslint/no-explicit-any -- Les réponses de l'API REST WordPress sont dynamiques et non typées par schéma */
import { fetchREST } from './wp-rest';

export interface PostNode {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText?: string;
    };
  } | null;
  author?: {
    node?: {
      name: string;
    };
  } | null;
  categories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  } | null;
}

export function formatWpPost(item: any): PostNode {
  const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
  const authorObj = item._embedded?.author?.[0];
  const terms = item._embedded?.['wp:term']?.[0];

  return {
    id: String(item.id),
    title: item.title?.rendered || item.title || '',
    slug: item.slug,
    date: item.date,
    excerpt: item.excerpt?.rendered || item.excerpt || '',
    content: item.content?.rendered || item.content || '',
    featuredImage: featuredMedia?.source_url
      ? {
          node: {
            sourceUrl: featuredMedia.source_url,
            altText: featuredMedia.alt_text || '',
          },
        }
      : null,
    author: authorObj?.name
      ? {
          node: {
            name: authorObj.name,
          },
        }
      : null,
    categories:
      Array.isArray(terms) && terms.length > 0
        ? {
            nodes: terms.map((cat: any) => ({
              name: cat.name,
              slug: cat.slug,
            })),
          }
        : null,
  };
}

export async function getAllPosts(): Promise<PostNode[]> {
  try {
    const rawPosts = await fetchREST<any[]>('posts?per_page=50&_embed');
    if (!Array.isArray(rawPosts)) return [];
    return rawPosts.map(formatWpPost);
  } catch (error) {
    console.error('Error fetching posts via REST API:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostNode | null> {
  try {
    const rawPosts = await fetchREST<any[]>(
      `posts?slug=${encodeURIComponent(slug)}&_embed`
    );
    if (Array.isArray(rawPosts) && rawPosts.length > 0) {
      return formatWpPost(rawPosts[0]);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug} via REST API:`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Services (CPT `service` + champs ACF)
// ---------------------------------------------------------------------------

export interface ServiceFeature {
  title: string;
  items: string[];
  image?: string | null;
  imageAlt?: string;
  imageCaption?: string | null;
}

export interface ServiceNode {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  lead: string;
  heroImage?: string | null;
  heroImageAlt?: string;
  heroCaption?: string | null;
  features: ServiceFeature[];
  /** Texte unique des cibles (`cibles` ou concaténation left + right) */
  targets: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

/** Prend la version EN si demandée et non vide, sinon la version FR. */
function pickLocale(fr: any, en: any, locale: string): string {
  const enText = typeof en === 'string' ? en.trim() : '';
  if (locale === 'en' && enText) return en;
  return typeof fr === 'string' ? fr : '';
}

/** Extrait l'objet ACF d'une réponse REST (ou {} si absent). */
function getAcf(obj: any): Record<string, any> {
  const acf = obj?.acf;
  return acf && typeof acf === 'object' && !Array.isArray(acf) ? acf : {};
}

/** Texte brut sans balises (les légendes natives contiennent du `<p>`). */
function stripTags(html: any): string {
  if (typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Légende EN si demandée et non vide, sinon légende native en texte brut. */
function resolveCaption(media: any, locale: string): string | null {
  const acf = getAcf(media);
  const captionEn = typeof acf.legende_en === 'string' ? acf.legende_en.trim() : '';
  if (locale === 'en' && captionEn) return captionEn;
  const native = stripTags(media?.caption?.rendered);
  return native || null;
}

/**
 * Découpe le champ `activites` en blocs.
 * Format : `[Titre]` + puces (`•`, `-`, `*`) + ligne vide entre blocs.
 * Tolérant : puce sans marqueur rattachée au bloc courant, retours `\r\n`.
 */
export function parseActivites(raw: any): Array<{ title: string; items: string[] }> {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks: Array<{ title: string; items: string[] }> = [];
  let current: { title: string; items: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const titleMatch = trimmed.match(/^\[(.+)\]$/);
    if (titleMatch) {
      current = { title: titleMatch[1].trim(), items: [] };
      blocks.push(current);
      continue;
    }
    const item = trimmed.replace(/^[•\-*–—]\s*/, '').trim();
    if (!item) continue;
    if (!current) {
      current = { title: '', items: [] };
      blocks.push(current);
    }
    current.items.push(item);
  }

  return blocks.filter((b) => b.title || b.items.length > 0);
}

/**
 * Résout un champ image ACF (format tableau), une URL simple
 * ou un ID de média (résolu via `/media/{id}`).
 * Préfère la déclinaison `large` (plus légère que la full).
 */
function resolveWpImage(field: any): { url: string | null; alt: string } {
  if (!field) return { url: null, alt: '' };
  if (typeof field === 'string') return { url: field || null, alt: '' };
  if (typeof field === 'object') {
    const sizes = field.sizes || {};
    const large =
      (typeof sizes.large === 'string' ? sizes.large : sizes.large?.source_url) ||
      (typeof sizes.medium_large === 'string'
        ? sizes.medium_large
        : sizes.medium_large?.source_url) ||
      field.url ||
      field.source_url ||
      null;
    return { url: large, alt: field.alt || field.title || '' };
  }
  return { url: null, alt: '' };
}

/** Résolution asynchrone : un ID numérique est résolu via l'endpoint `/media`. */
async function resolveWpImageAsync(
  field: any,
  locale: string,
  altEn?: any
): Promise<{ url: string | null; alt: string; caption: string | null }> {
  if (typeof field === 'number') {
    try {
      const media = await fetchREST<any>(`media/${field}`);
      const sizes = media?.media_details?.sizes || {};
      const url =
        sizes.large?.source_url ||
        sizes.full?.source_url ||
        media?.source_url ||
        null;
      const acf = getAcf(media);
      const titleEn = pickLocale('', acf.titre_en, locale);
      const alt =
        pickLocale(media?.alt_text, altEn || acf.alt_en, locale) ||
        titleEn ||
        media?.title?.rendered ||
        '';
      return { url, alt, caption: resolveCaption(media, locale) };
    } catch {
      return { url: null, alt: '', caption: null };
    }
  }
  const flat = resolveWpImage(field);
  return { ...flat, caption: null };
}

/** Image mise en avant native via `_embed` (déclinaison `large` si dispo). */
function resolveFeaturedImage(
  item: any,
  locale: string,
  altEn?: any
): { url: string | null; alt: string; caption: string | null } {
  const media = item._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return { url: null, alt: '', caption: null };
  const sizes = media.media_details?.sizes || {};
  const url =
    sizes.large?.source_url || sizes.full?.source_url || media.source_url || null;
  const acf = getAcf(media);
  const titleEn = pickLocale('', acf.titre_en, locale);
  const alt =
    pickLocale(media.alt_text, altEn || acf.alt_en, locale) ||
    titleEn ||
    media.title?.rendered ||
    '';
  return { url, alt, caption: resolveCaption(media, locale) };
}

export async function formatWpService(item: any, locale: string): Promise<ServiceNode> {
  const acf = item?.acf && typeof item.acf === 'object' ? item.acf : {};
  const features = parseActivites(pickLocale(acf.activites, acf.activites_en, locale));

  const images = await Promise.all(
    features.map((_, i) =>
      resolveWpImageAsync(
        acf[`activite_image_${i + 1}`],
        locale,
        acf[`activite_image_alt_${i + 1}_en`]
      )
    )
  );
  for (let i = 0; i < features.length; i++) {
    (features[i] as ServiceFeature).image = images[i].url;
    (features[i] as ServiceFeature).imageAlt = images[i].alt;
    (features[i] as ServiceFeature).imageCaption = images[i].caption;
  }

  const cibles = pickLocale(acf.cibles, acf.cibles_en, locale).trim();
  const left = pickLocale(acf.targets_left, acf.targets_left_en, locale).trim();
  const right = pickLocale(acf.targets_right, acf.targets_right_en, locale).trim();
  const targets = cibles || [left, right].filter(Boolean).join(' ');

  const hero = resolveFeaturedImage(item, locale, acf.hero_alt_en);

  return {
    id: String(item.id),
    title: item.title?.rendered || item.title || '',
    slug: item.slug,
    subtitle: pickLocale(acf.subtitle, acf.subtitle_en, locale),
    lead: pickLocale(acf.lead, acf.lead_en, locale),
    heroImage: hero.url,
    heroImageAlt: hero.alt,
    heroCaption: hero.caption,
    features: features as ServiceFeature[],
    targets,
    ctaTitle: pickLocale(acf.cta_title, acf.cta_title_en, locale),
    ctaText: pickLocale(acf.cta_text, acf.cta_text_en, locale),
    ctaButton: pickLocale(acf.cta_button, acf.cta_button_en, locale),
  };
}

export async function getAllServices(locale: string): Promise<ServiceNode[]> {
  try {
    const raw = await fetchREST<any[]>('service?per_page=100&_embed');
    if (!Array.isArray(raw)) return [];
    return Promise.all(raw.map((item) => formatWpService(item, locale)));
  } catch (error) {
    console.error('Error fetching services via REST API:', error);
    return [];
  }
}

export async function getServiceBySlug(
  slug: string,
  locale: string
): Promise<ServiceNode | null> {
  try {
    const raw = await fetchREST<any[]>(
      `service?slug=${encodeURIComponent(slug)}&_embed`
    );
    if (Array.isArray(raw) && raw.length > 0) {
      return formatWpService(raw[0], locale);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching service with slug ${slug} via REST API:`, error);
    return null;
  }
}
