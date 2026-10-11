/* eslint-disable @typescript-eslint/no-explicit-any -- Réponses WP REST dynamiques */
import { fetchREST } from './wp-rest';
import { cleanWpText } from './html';

export type GalleryCategory = 'rencontres' | 'conferences' | 'terrain' | 'ateliers';

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface GalleryEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  /** ISO date pour <time> + JSON-LD */
  lieu: string;
  category: GalleryCategory;
  description: string;
  cover: string;
  coverAlt: string;
  images: GalleryImage[];
}

export const GALLERY_CATEGORIES: Array<{
  slug: GalleryCategory | 'tout';
  labelFr: string;
  labelEn: string;
}> = [
  { slug: 'tout', labelFr: 'Tout', labelEn: 'All' },
  { slug: 'rencontres', labelFr: 'Rencontres', labelEn: 'Meetings' },
  { slug: 'conferences', labelFr: 'Conférences', labelEn: 'Conferences' },
  { slug: 'terrain', labelFr: 'Terrain & Chantiers', labelEn: 'Field & Sites' },
  { slug: 'ateliers', labelFr: 'Ateliers & Vie d’équipe', labelEn: 'Workshops & Team life' },
];

export function categoryLabel(slug: string, locale: string): string {
  const found = GALLERY_CATEGORIES.find((c) => c.slug === slug);
  if (!found) return slug;
  return locale === 'en' ? found.labelEn : found.labelFr;
}

// ---------------------------------------------------------------------------
// Données de démonstration (en attendant le CPT `galerie` côté WordPress).
// Chaque évènement = slug unique + titre + date + lieu + description + images
// avec alt → base indexable pour le SEO (listing + page détail + JSON-LD).
// ---------------------------------------------------------------------------

const MOCK_GALLERY: GalleryEvent[] = [
  {
    id: 'g1',
    slug: 'rencontre-partenaires-b2b-yaounde',
    title: 'Rencontre partenaires B2B à Yaoundé',
    date: '2026-06-18',
    lieu: 'Yaoundé, Cameroun',
    category: 'rencontres',
    description:
      'Échanges avec des grands groupes et PME locales autour de la maintenance industrielle, du BTP et de la sécurité incendie. Présentation de nos offres multiservices et signature de deux conventions de partenariat.',
    cover:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop',
    coverAlt: 'Rencontre partenaires B2B BNPC à Yaoundé, salle de conférence',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80&auto=format&fit=crop',
        alt: 'Plénière rencontre partenaires B2B BNPC Yaoundé',
      },
      {
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80&auto=format&fit=crop',
        alt: 'Échanges entre participants rencontre B2B BNPC',
      },
      {
        url: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=1200&q=80&auto=format&fit=crop',
        alt: 'Poignée de main partenariat BNPC Yaoundé',
      },
    ],
  },
  {
    id: 'g2',
    slug: 'conference-energies-renouvelables-douala',
    title: 'Conférence énergies renouvelables à Douala',
    date: '2026-05-27',
    lieu: 'Douala, Cameroun',
    category: 'conferences',
    description:
      'BNPC a présenté ses retours d’expérience sur les centrales solaires industrielles : dimensionnement, stockage et maintenance. Démonstration de suivi d’installation par imagerie drone.',
    cover:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80&auto=format&fit=crop',
    coverAlt: 'Conférence énergies renouvelables BNPC à Douala, scène et public',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80&auto=format&fit=crop',
        alt: 'Scène conférence énergies renouvelables Douala',
      },
      {
        url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80&auto=format&fit=crop',
        alt: 'Présentation panneaux solaires conférence BNPC',
      },
      {
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80&auto=format&fit=crop',
        alt: 'Parc solaire présenté en conférence BNPC Douala',
      },
    ],
  },
  {
    id: 'g3',
    slug: 'chantier-btp-kribi',
    title: 'Suivi de chantier BTP à Kribi',
    date: '2026-04-15',
    lieu: 'Kribi, Cameroun',
    category: 'terrain',
    description:
      'Visite technique et contrôle qualité sur un chantier de construction : gros œuvre, coffrage et réception d’étape avec le client. Relevés drone pour le suivi d’avancement.',
    cover:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80&auto=format&fit=crop',
    coverAlt: 'Chantier BTP BNPC à Kribi, grue et structure en cours',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80&auto=format&fit=crop',
        alt: 'Grue sur chantier BTP Kribi suivi par BNPC',
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop',
        alt: 'Équipe BTP BNPC sur échafaudage chantier Kribi',
      },
      {
        url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80&auto=format&fit=crop',
        alt: 'Ouvrage béton chantier BNPC Kribi',
      },
    ],
  },
  {
    id: 'g4',
    slug: 'forage-eau-potable-bafoussam',
    title: 'Forage d’eau potable à Bafoussam',
    date: '2026-03-09',
    lieu: 'Bafoussam, Cameroun',
    category: 'terrain',
    description:
      'Étude géophysique, forage et installation de pompe solaire pour un site agro-industriel. Tests de potabilité et formation des exploitants à la maintenance.',
    cover:
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=80&auto=format&fit=crop',
    coverAlt: 'Forage eau potable BNPC à Bafoussam, technicien et équipement',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=80&auto=format&fit=crop',
        alt: 'Équipement de forage BNPC Bafoussam',
      },
      {
        url: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=1200&q=80&auto=format&fit=crop',
        alt: 'Eau potable issue du forage BNPC',
      },
    ],
  },
  {
    id: 'g5',
    slug: 'atelier-drones-imagerie-yaounde',
    title: 'Atelier drones & imagerie aérienne',
    date: '2026-02-20',
    lieu: 'Yaoundé, Cameroun',
    category: 'ateliers',
    description:
      'Session interne de montée en compétence : pilotage, cartographie 3D et inspection d’ouvrages par drone. Les opérateurs ont validé leur habilitation sur site d’entraînement.',
    cover:
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80&auto=format&fit=crop',
    coverAlt: 'Drone en vol lors de l’atelier imagerie BNPC à Yaoundé',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80&auto=format&fit=crop',
        alt: 'Drone BNPC en vol atelier Yaoundé',
      },
      {
        url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&q=80&auto=format&fit=crop',
        alt: 'Pilotage drone atelier BNPC',
      },
    ],
  },
  {
    id: 'g6',
    slug: 'exercice-securite-incendie-port-kribi',
    title: 'Exercice sécurité incendie au port de Kribi',
    date: '2026-01-28',
    lieu: 'Kribi, Cameroun',
    category: 'conferences',
    description:
      'Démonstration et formation aux systèmes de détection et d’extinction incendie pour les équipes portuaires : audit, plan d’évacuation et mise en situation réelle.',
    cover:
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200&q=80&auto=format&fit=crop',
    coverAlt: 'Exercice sécurité incendie BNPC au port de Kribi',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1200&q=80&auto=format&fit=crop',
        alt: 'Formation extincteurs exercice incendie Kribi',
      },
      {
        url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=1200&q=80&auto=format&fit=crop',
        alt: 'Équipement sécurité incendie BNPC',
      },
    ],
  },
];

/** Tente le CPT `galerie` côté WP, sinon repli sur les données mockées. */
export async function getGalleryEvents(locale: string): Promise<GalleryEvent[]> {
  try {
    const raw = await fetchREST<any[]>('galerie?per_page=100&_embed');
    if (Array.isArray(raw) && raw.length > 0) {
      const mapped: GalleryEvent[] = await Promise.all(
        raw.map(async (item: any, i: number) => {
        const acf = item?.acf && typeof item.acf === 'object' ? item.acf : {};
        const media = item._embedded?.['wp:featuredmedia']?.[0];
        const sizes = media?.media_details?.sizes || {};
        const cover =
          sizes.large?.source_url ||
          sizes.full?.source_url ||
          media?.source_url ||
          MOCK_GALLERY[i % MOCK_GALLERY.length].cover;
        const pickEn = (fr: any, en: any) => {
          const e = typeof en === 'string' ? en.trim() : '';
          if (locale === 'en' && e) return en;
          return typeof fr === 'string' ? fr : '';
        };
        const galleryImgs: GalleryImage[] = [];
        if (Array.isArray(acf.galerie_images)) {
          for (const img of acf.galerie_images) {
            if (typeof img === 'number') {
              // Champ galerie en mode "ID" : résolution via /media
              try {
                const media = await fetchREST<any>(`media/${img}`);
                const sizes = media?.media_details?.sizes || {};
                const url =
                  sizes.large?.source_url ||
                  sizes.full?.source_url ||
                  media?.source_url;
                if (url) {
                  galleryImgs.push({
                    url,
                    alt: media?.alt_text || media?.title?.rendered || '',
                  });
                }
              } catch {
                // Image illisible : ignorée
              }
            } else if (img && typeof img === 'object') {
              // Mode "Tableau image" (recommandé) ou objet partiel
              const url =
                img?.url ||
                img?.source_url ||
                img?.sizes?.large ||
                img?.sizes?.medium_large ||
                '';
              const alt = pickEn(img?.alt, img?.alt_en) || '';
              if (url) galleryImgs.push({ url, alt });
            } else if (typeof img === 'string' && img) {
              galleryImgs.push({ url: img, alt: '' });
            }
          }
        }
        return {
          id: String(item.id),
          slug: item.slug,
          title:
            typeof item.title?.rendered === 'string'
              ? cleanWpText(item.title.rendered)
              : cleanWpText(pickEn(acf.titre, acf.titre_en)),
          date: item.date
            ? String(item.date).slice(0, 10)
            : pickEn(acf.date_evenement, acf.date_evenement),
          lieu: pickEn(acf.lieu, acf.lieu_en) || 'Cameroun',
          category: (['rencontres', 'conferences', 'terrain', 'ateliers'] as const).includes(
            acf.categorie
          )
            ? acf.categorie
            : 'rencontres',
          description: pickEn(acf.description, acf.description_en) || '',
          cover,
          coverAlt: media?.alt_text || pickEn(acf.titre, acf.titre_en),
          images:
            galleryImgs.length > 0
              ? galleryImgs
              : [{ url: cover, alt: media?.alt_text || '' }],
        };
        })
      );
      return mapped.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
  } catch {
    // Repli silencieux sur le mock
  }
  void locale;
  return [...MOCK_GALLERY].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getGalleryEventBySlug(
  slug: string,
  locale: string
): Promise<GalleryEvent | null> {
  const all = await getGalleryEvents(locale);
  return all.find((e) => e.slug === slug) ?? null;
}

export function formatEventDate(dateISO: string, locale: string): string {
  const d = new Date(dateISO + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
