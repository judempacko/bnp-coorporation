/* eslint-disable @typescript-eslint/no-explicit-any -- Réponses WP REST dynamiques */
import { cache } from 'react';
import { fetchREST } from './wp-rest';
import { cleanWpText, cleanWpParagraphs, extractYear } from './html';

/**
 * Champs ACF attendus sur le CPT `projet` (rest_base `projet`) —
 * 100 % compatibles ACF GRATUIT (pas de Galerie ni Répéteur, réservés Pro).
 * Les variantes `galerie_images` / `videos` (Pro) restent lues en repli.
 *
 *  titre_en (text), resume / resume_en (textarea),
 *  description / description_en (wysiwyg ou textarea),
 *  client (text), annee (number), lieu / lieu_en (text : nom du site),
 *  ville / ville_en (text), categorie (text, repli si pas de service lié),
 *  service_concerne (post object → service, single, retour ID),
 *  linkedin (url), image_1 … image_6 (image, retour tableau),
 *  image_alt_1_en … image_alt_6_en (text, facultatif),
 *  video_1 … video_3 (url), video_titre_1 … video_titre_3 (text, facultatif)
 *  + video_titre_1_en … (facultatif).
 * Couverture = image mise en avant. Titre FR = titre du post.
 */

/** Nombre de champs image numérotés lus (`image_1` … `image_N`). */
const MAX_PROJECT_IMAGES = 6;
/** Nombre de champs vidéo numérotés lus (`video_1` … `video_N`). */
const MAX_PROJECT_VIDEOS = 3;

export interface ProjectMedia {
  url: string;
  alt: string;
}

export type ProjectVideoKind = 'youtube' | 'vimeo' | 'mp4' | 'link';

export interface ProjectVideo {
  url: string;
  title: string;
  kind: ProjectVideoKind;
  /** URL d'intégration (iframe) ou null (lien / <video> natif). */
  embedUrl: string | null;
}

export interface Project {
  id: string;
  slug: string;
  /** Chemin fiche SANS locale (ex. `/projets/chantier-btp-kribi`). */
  href: string;
  title: string;
  excerpt: string;
  /** Paragraphes de description (ACF `description`). */
  description: string[];
  image: string;
  imageAlt: string;
  /** Étiquettes affichées au-dessus du titre (1-2). */
  tags: string[];
  client: string;
  /** Année AAAA (ACF `annee`). */
  year: string | null;
  /** Nom du site (ACF `lieu`). */
  lieu: string;
  /** Ville (ACF `ville`). */
  ville: string;
  serviceSlug: string | null;
  serviceLabel: string | null;
  /** Lien vers la publication LinkedIn du projet. */
  linkedinUrl: string | null;
  /** Toutes les images (couverture en premier). */
  images: ProjectMedia[];
  videos: ProjectVideo[];
}

// ---------------------------------------------------------------------------
// Repli : 3 cas types renvoyant vers les fiches galerie existantes.
// Contenu de référence à terme : CPT `projet` côté WordPress.
// ---------------------------------------------------------------------------

const FALLBACK_PROJECTS: Array<{
  slug: string;
  gallerySlug: string;
  tagsFr: string[];
  tagsEn: string[];
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  villeFr: string;
  villeEn: string;
  year: string;
  image: string;
  imageAltFr: string;
  imageAltEn: string;
}> = [
  {
    slug: 'suivi-chantier-btp-kribi',
    gallerySlug: 'chantier-btp-kribi',
    tagsFr: ['BTP', 'Suivi de chantier'],
    tagsEn: ['Construction', 'Site monitoring'],
    titleFr: 'Suivi de chantier BTP à Kribi',
    titleEn: 'Construction site monitoring in Kribi',
    excerptFr:
      'Contrôle qualité sur gros œuvre et coffrage, réception d’étape avec le client et relevés drone pour le suivi d’avancement.',
    excerptEn:
      'Quality control on structural works and formwork, stage acceptance with the client and drone surveys for progress tracking.',
    villeFr: 'Kribi',
    villeEn: 'Kribi',
    year: '2026',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80&auto=format&fit=crop',
    imageAltFr: 'Chantier BTP suivi par BNPC à Kribi',
    imageAltEn: 'Construction site monitored by BNPC in Kribi',
  },
  {
    slug: 'audit-securite-incendie-port-kribi',
    gallerySlug: 'exercice-securite-incendie-port-kribi',
    tagsFr: ['Sécurité incendie', 'Audit ERP'],
    tagsEn: ['Fire safety', 'ERP audit'],
    titleFr: 'Sécurité incendie au port de Kribi',
    titleEn: 'Fire safety at the port of Kribi',
    excerptFr:
      'Audit, plan d’évacuation et mise en situation réelle pour les équipes portuaires : détection et extinction à haute fiabilité.',
    excerptEn:
      'Audit, evacuation plan and live drill for port teams: high-reliability detection and suppression.',
    villeFr: 'Kribi',
    villeEn: 'Kribi',
    year: '2026',
    image:
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200&q=80&auto=format&fit=crop',
    imageAltFr: 'Exercice sécurité incendie BNPC au port de Kribi',
    imageAltEn: 'BNPC fire safety drill at the port of Kribi',
  },
  {
    slug: 'forage-eau-potable-bafoussam',
    gallerySlug: 'forage-eau-potable-bafoussam',
    tagsFr: ['Forage', 'Eau & Solaire'],
    tagsEn: ['Drilling', 'Water & Solar'],
    titleFr: 'Forage d’eau potable à Bafoussam',
    titleEn: 'Drinking water drilling in Bafoussam',
    excerptFr:
      'Étude géophysique, forage et pompage solaire pour un site agro-industriel, tests de potabilité et formation des exploitants.',
    excerptEn:
      'Geophysical survey, drilling and solar pumping for an agro-industrial site, potability tests and operator training.',
    villeFr: 'Bafoussam',
    villeEn: 'Bafoussam',
    year: '2026',
    image:
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=80&auto=format&fit=crop',
    imageAltFr: 'Forage d’eau potable BNPC à Bafoussam',
    imageAltEn: 'BNPC drinking water drilling in Bafoussam',
  },
];

/** Prend la version EN si demandée et non vide, sinon la version FR. */
function pickLocale(fr: any, en: any, locale: string): string {
  const enText = typeof en === 'string' ? en.trim() : '';
  if (locale === 'en' && enText) return en;
  return typeof fr === 'string' ? fr : '';
}

/** URL d'un champ image ACF (tableau), ID média (résolu via /media) ou URL simple. */
async function resolveImageField(field: any): Promise<{ url: string | null; alt: string }> {
  if (!field) return { url: null, alt: '' };
  if (typeof field === 'string') return { url: field || null, alt: '' };
  if (typeof field === 'number') {
    try {
      const media = await fetchREST<any>(`media/${field}`);
      const sizes = media?.media_details?.sizes || {};
      return {
        url:
          sizes.large?.source_url ||
          sizes.full?.source_url ||
          media?.source_url ||
          null,
        alt: media?.alt_text || media?.title?.rendered || '',
      };
    } catch {
      return { url: null, alt: '' };
    }
  }
  if (typeof field === 'object') {
    const sizes = field.sizes || {};
    const pickSize = (s: any): string | null =>
      typeof s === 'string' ? s : (s?.source_url ?? null);
    return {
      url:
        pickSize(sizes.large) ||
        pickSize(sizes.medium_large) ||
        field.url ||
        field.source_url ||
        null,
      alt: field.alt || field.title || '',
    };
  }
  return { url: null, alt: '' };
}

/** Galerie ACF (`galerie_images`, Pro) : IDs, tableaux image ou URLs simples. */
async function resolveGallery(field: any): Promise<ProjectMedia[]> {
  if (!Array.isArray(field)) return [];
  const out: ProjectMedia[] = [];
  for (const entry of field) {
    if (typeof entry === 'string') {
      if (entry) out.push({ url: entry, alt: '' });
      continue;
    }
    if (typeof entry === 'number') {
      const img = await resolveImageField(entry);
      if (img.url) out.push({ url: img.url, alt: img.alt });
      continue;
    }
    if (entry && typeof entry === 'object') {
      // Repeater galerie : { image: … } ou tableau image direct
      const img = await resolveImageField(entry.image ?? entry);
      if (img.url) out.push({ url: img.url, alt: img.alt });
    }
  }
  return out;
}

/** Champs numérotés `image_1` … `image_N` (ACF gratuit, type Image). */
async function resolveNumberedImages(
  acf: Record<string, any>,
  locale: string
): Promise<ProjectMedia[]> {
  const out: ProjectMedia[] = [];
  for (let i = 1; i <= MAX_PROJECT_IMAGES; i++) {
    const img = await resolveImageField(acf[`image_${i}`]);
    if (!img.url) continue;
    // Alt EN facultatif (`image_alt_1_en`…) : sinon alt de la médiathèque.
    const altEn =
      typeof acf[`image_alt_${i}_en`] === 'string' ? acf[`image_alt_${i}_en`].trim() : '';
    out.push({ url: img.url, alt: locale === 'en' && altEn ? altEn : img.alt });
  }
  return out;
}
function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  return m ? m[1] : null;
}

function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

/** Normalise une URL vidéo (YouTube / Vimeo / MP4 / lien simple). */
export function toProjectVideo(url: unknown, title: string): ProjectVideo | null {
  if (typeof url !== 'string' || !url.trim()) return null;
  const clean = url.trim();
  const yt = youtubeId(clean);
  if (yt)
    return { url: clean, title, kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${yt}` };
  const vm = vimeoId(clean);
  if (vm)
    return { url: clean, title, kind: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vm}` };
  if (/\.mp4(\?|#|$)/i.test(clean) || /mp4/i.test(clean.split('?')[0].slice(-8)))
    return { url: clean, title, kind: 'mp4', embedUrl: null };
  return { url: clean, title, kind: 'link', embedUrl: null };
}

/**
 * Vidéos : champs numérotés `video_1` … `video_N` (ACF gratuit, type URL)
 * + titres `video_titre_1` … (+ `_en`, facultatifs). Le répéteur Pro
 * `videos` et `video_url` restent lus en repli.
 */
function resolveVideos(acf: Record<string, any>, locale: string): ProjectVideo[] {
  const out: ProjectVideo[] = [];
  const push = (url: unknown, title: string) => {
    const v = toProjectVideo(url, title);
    if (v && !out.some((e) => e.url === v.url)) out.push(v);
  };
  if (Array.isArray(acf.videos)) {
    for (const entry of acf.videos) {
      if (typeof entry === 'string') {
        push(entry, '');
      } else if (entry && typeof entry === 'object') {
        push(
          entry.url ?? entry.lien ?? entry.video,
          cleanWpText(pickLocale(entry.titre, entry.titre_en, locale))
        );
      }
    }
  }
  push(acf.video_url ?? acf.video, '');
  for (let i = 1; i <= MAX_PROJECT_VIDEOS; i++) {
    push(
      acf[`video_${i}`],
      cleanWpText(pickLocale(acf[`video_titre_${i}`], acf[`video_titre_${i}_en`], locale))
    );
  }
  return out;
}

/**
 * Service concerné (ACF `service_concerne`, post object single) :
 * ID numérique, slug, ou objet {slug, title}. Titre résolu en direct
 * (requête légère, sans les images du formatter complet).
 */
async function resolveServiceLink(
  field: any,
  locale: string
): Promise<{ slug: string; label: string } | null> {
  let slug: string | null = null;
  let label = '';
  if (typeof field === 'number' || (typeof field === 'string' && /^\d+$/.test(field.trim()))) {
    try {
      const svc = await fetchREST<any>(`service/${field}`);
      slug = typeof svc?.slug === 'string' ? svc.slug : null;
      label = cleanWpText(svc?.title?.rendered);
    } catch {
      return null;
    }
  } else if (typeof field === 'string' && field.trim()) {
    slug = field.trim();
  } else if (field && typeof field === 'object') {
    const obj = Array.isArray(field) ? field[0] : field;
    slug = obj?.slug ?? obj?.post_name ?? null;
    label = cleanWpText(obj?.title?.rendered ?? obj?.post_title ?? obj?.name);
  }
  if (!slug) return null;
  if (!label) {
    try {
      const list = await fetchREST<any[]>(`service?slug=${encodeURIComponent(slug)}`);
      if (Array.isArray(list) && list.length > 0)
        label = cleanWpText(list[0]?.title?.rendered);
    } catch {
      // Étiquette = slug humanisé en dernier recours
    }
  }
  void locale;
  return { slug, label: label || slug.replace(/-/g, ' ') };
}

/** Couverture : image mise en avant (déclinaison `large` si dispo). */
function resolveCover(item: any): { url: string | null; alt: string } {
  const media = item._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return { url: null, alt: '' };
  const sizes = media.media_details?.sizes || {};
  return {
    url: sizes.large?.source_url || sizes.full?.source_url || media.source_url || null,
    alt: cleanWpText(media.alt_text) || cleanWpText(media.title?.rendered),
  };
}

export async function formatWpProject(item: any, locale: string): Promise<Project> {
  const acf = item?.acf && typeof item.acf === 'object' ? item.acf : {};
  const cover = resolveCover(item);
  const gallery = [
    ...(await resolveGallery(acf.galerie_images)),
    ...(await resolveNumberedImages(acf, locale)),
  ];
  const service = await resolveServiceLink(acf.service_concerne, locale);

  // Titre EN prioritaire si renseigné (le titre du post est en FR).
  const titleEn = cleanWpText(acf.titre_en);
  const title =
    (locale === 'en' && titleEn ? titleEn : '') ||
    cleanWpText(item.title?.rendered) ||
    cleanWpText(acf.titre) ||
    `Projet ${item.id}`;
  const excerpt =
    cleanWpText(pickLocale(acf.resume, acf.resume_en, locale)) ||
    cleanWpText(pickLocale(acf.lead, acf.lead_en, locale));
  const description = cleanWpParagraphs(
    pickLocale(acf.description, acf.description_en, locale)
  );
  const client = cleanWpText(pickLocale(acf.client, acf.client_en, locale));
  const year = extractYear(acf.annee ?? acf.year);
  const lieu = cleanWpText(pickLocale(acf.lieu, acf.lieu_en, locale));
  const ville = cleanWpText(pickLocale(acf.ville, acf.ville_en, locale));
  const linkedin =
    typeof acf.linkedin === 'string' && acf.linkedin.trim()
      ? acf.linkedin.trim()
      : null;

  const images: ProjectMedia[] = [];
  if (cover.url) images.push({ url: cover.url, alt: cover.alt || title });
  for (const img of gallery) {
    if (!images.some((e) => e.url === img.url))
      images.push({ url: img.url, alt: img.alt || title });
  }

  const tags: string[] = [];
  if (service?.label) tags.push(service.label);
  else if (typeof acf.categorie === 'string' && acf.categorie.trim())
    tags.push(acf.categorie.trim());
  if (ville) tags.push(ville);

  return {
    id: String(item.id),
    slug: item.slug,
    href: `/projets/${item.slug}`,
    title,
    excerpt,
    description,
    image: images[0]?.url || FALLBACK_PROJECTS[0].image,
    imageAlt: images[0]?.alt || title,
    tags: tags.slice(0, 2),
    client,
    year,
    lieu,
    ville,
    serviceSlug: service?.slug ?? null,
    serviceLabel: service?.label ?? null,
    linkedinUrl: linkedin,
    images,
    videos: resolveVideos(acf, locale),
  };
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const ya = a.year ? parseInt(a.year, 10) : 0;
    const yb = b.year ? parseInt(b.year, 10) : 0;
    return yb - ya;
  });
}

function fallbackProjects(locale: string): Project[] {
  const en = locale === 'en';
  // NOTE: en repli on pointe vers les fiches galerie (riches),
  // car aucun projet WP n'existe encore.
  return FALLBACK_PROJECTS.map((p) => {
    const title = en ? p.titleEn : p.titleFr;
    return {
      id: p.slug,
      slug: p.slug,
      href: `/galerie/${p.gallerySlug}`,
      title,
      excerpt: en ? p.excerptEn : p.excerptFr,
      description: [],
      image: p.image,
      imageAlt: en ? p.imageAltEn : p.imageAltFr,
      tags: en ? p.tagsEn : p.tagsFr,
      client: '',
      year: p.year,
      lieu: '',
      ville: en ? p.villeEn : p.villeFr,
      serviceSlug: null,
      serviceLabel: null,
      linkedinUrl: null,
      images: [{ url: p.image, alt: en ? p.imageAltEn : p.imageAltFr }],
      videos: [],
    };
  });
}

/** Tous les projets (WP ou repli), triés par année décroissante. */
export const getProjects = cache(async (locale: string): Promise<Project[]> => {
  try {
    const raw = await fetchREST<any[]>('projet?per_page=100&_embed');
    if (Array.isArray(raw) && raw.length > 0) {
      const mapped = await Promise.all(raw.map((item) => formatWpProject(item, locale)));
      return sortProjects(mapped);
    }
  } catch {
    // Repli silencieux sur les cas types
  }
  return fallbackProjects(locale);
});

export const getProjectBySlug = cache(async (
  slug: string,
  locale: string
): Promise<Project | null> => {
  try {
    const raw = await fetchREST<any[]>(`projet?slug=${encodeURIComponent(slug)}&_embed`);
    if (Array.isArray(raw) && raw.length > 0) {
      return formatWpProject(raw[0], locale);
    }
  } catch {
    return null;
  }
  return null;
});
