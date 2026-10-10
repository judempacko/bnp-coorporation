/* eslint-disable @typescript-eslint/no-explicit-any -- Réponses WP REST dynamiques */
import { fetchREST } from './wp-rest';

/**
 * Niveau conservé pour compatibilité WP (champ ACF `niveau`) et tri par défaut,
 * mais l'affichage est une grille unique ordonnée par `order` (plus de
 * séparation direction / collaborateurs).
 */
export type TeamLevel = 'direction' | 'staff';

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  pole: string;
  level: TeamLevel;
  photo: string;
  photoAlt: string;
  /**
   * Description INVISIBLE (jamais affichée à l'écran) : texte alternatif
   * exposé en JSON-LD `Person` + alts nominatifs. Aide le référencement
   * nominatif de l'employé (recherche "prénom nom BNPC") et reste exploitable
   * par les moteurs comme par les agents IA qui lisent les données structurées.
   */
  seoDescription: string;
  /** Lien LinkedIn de l'employé (un par membre, champ ACF `linkedin` côté WP). */
  linkedin?: string | null;
  /** Ordre d'affichage dans la grille unique (1 = premier). */
  order: number;
}

export const TEAM_POLES = [
  { slug: 'direction', labelFr: 'Direction', labelEn: 'Management' },
  { slug: 'btp', labelFr: 'BTP & Construction', labelEn: 'Construction' },
  { slug: 'energie', labelFr: 'Énergie & Eau', labelEn: 'Energy & Water' },
  { slug: 'technique', labelFr: 'Technique & Drones', labelEn: 'Technical & Drones' },
  { slug: 'support', labelFr: 'Support & Admin', labelEn: 'Support & Admin' },
] as const;

export function poleLabel(slug: string, locale: string): string {
  const found = TEAM_POLES.find((p) => p.slug === slug);
  if (!found) return slug;
  return locale === 'en' ? found.labelEn : found.labelFr;
}

// ---------------------------------------------------------------------------
// Données de démonstration (en attendant le CPT `membre` côté WordPress).
// Photos Unsplash déjà autorisées dans next.config.ts.
// Alts nominatifs (nom + poste) pour le SEO image et la recherche nominative.
// URLs LinkedIn de démonstration : remplacées par le champ ACF `linkedin`.
// ---------------------------------------------------------------------------

const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    slug: 'direction-generale',
    name: 'Bertrand N. P.',
    role: 'Directeur Général',
    pole: 'direction',
    level: 'direction',
    photo:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Bertrand N. P., Directeur Général de BNP Coorporation à Yaoundé',
    seoDescription:
      "Bertrand N. P. est le Directeur Général et fondateur de BNP Coorporation Sarl, entreprise d'ingénierie multiservices basée à Yaoundé au Cameroun. Il définit la vision stratégique, pilote les partenariats B2B avec grands groupes et PME, et supervise les activités BTP, sécurité incendie, forage d'eau, énergies renouvelables, drones et réparation navale à Yaoundé, Douala et Kribi.",
    linkedin: 'https://www.linkedin.com/in/bertrand-n-p',
    order: 1,
  },
  {
    id: '2',
    slug: 'directrice-operations',
    name: 'Aïcha M.',
    role: 'Directrice des Opérations',
    pole: 'direction',
    level: 'direction',
    photo:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Aïcha M., Directrice des Opérations de BNP Coorporation',
    seoDescription:
      "Aïcha M. est Directrice des Opérations chez BNP Coorporation Sarl à Yaoundé. Elle coordonne les chantiers BTP, les forages d'eau et les installations solaires au Cameroun, et garantit le respect des délais, de la qualité et des normes de sécurité sur chaque site d'intervention.",
    linkedin: 'https://www.linkedin.com/in/aicha-m',
    order: 2,
  },
  {
    id: '3',
    slug: 'directeur-technique',
    name: 'Jean-Claude E.',
    role: 'Directeur Technique',
    pole: 'direction',
    level: 'direction',
    photo:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Jean-Claude E., Directeur Technique de BNP Coorporation',
    seoDescription:
      "Jean-Claude E. est Directeur Technique chez BNP Coorporation Sarl. Ingénieur senior en BTP et sécurité incendie, il valide chaque étude technique, chaque devis et chaque diagnostic terrain avant chiffrage, et encadre les audits de sécurité incendie au Cameroun.",
    linkedin: 'https://www.linkedin.com/in/jean-claude-e',
    order: 3,
  },
  {
    id: '4',
    slug: 'ingenieur-btp',
    name: 'Stéphane T.',
    role: 'Ingénieur BTP',
    pole: 'btp',
    level: 'staff',
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Stéphane T., Ingénieur BTP chez BNP Coorporation',
    seoDescription:
      "Stéphane T. est Ingénieur BTP chez BNP Coorporation Sarl. Il assure la maîtrise d'œuvre, le suivi de chantier et la réception de travaux de construction à Yaoundé, Douala et Kribi, pour des clients B2B et particuliers.",
    linkedin: 'https://www.linkedin.com/in/stephane-t',
    order: 4,
  },
  {
    id: '5',
    slug: 'experte-solaire',
    name: 'Nadia K.',
    role: 'Experte Énergies Renouvelables',
    pole: 'energie',
    level: 'staff',
    photo:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Nadia K., Experte Énergies Renouvelables chez BNP Coorporation',
    seoDescription:
      "Nadia K. est Experte en Énergies Renouvelables chez BNP Coorporation Sarl. Elle réalise le dimensionnement et l'installation de centrales solaires domestiques et industrielles, avec stockage et maintenance, sur l'ensemble du territoire camerounais.",
    linkedin: 'https://www.linkedin.com/in/nadia-k',
    order: 5,
  },
  {
    id: '6',
    slug: 'technicien-forage',
    name: 'Ibrahim S.',
    role: 'Technicien Forage & Eau',
    pole: 'energie',
    level: 'staff',
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Ibrahim S., Technicien Forage et Eau chez BNP Coorporation',
    seoDescription:
      "Ibrahim S. est Technicien Forage et Eau chez BNP Coorporation Sarl. Il réalise les études géophysiques, les forages d'eau et les installations de potabilisation et de pompage solaire pour sites industriels, agricoles et particuliers au Cameroun.",
    linkedin: 'https://www.linkedin.com/in/ibrahim-s',
    order: 6,
  },
  {
    id: '7',
    slug: 'pilote-drone',
    name: 'Franck D.',
    role: 'Pilote Drone & Imagerie',
    pole: 'technique',
    level: 'staff',
    photo:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Franck D., Pilote Drone et Imagerie Aérienne chez BNP Coorporation',
    seoDescription:
      "Franck D. est Pilote Drone et spécialiste en imagerie aérienne chez BNP Coorporation Sarl. Il réalise la cartographie 3D, l'inspection d'ouvrages et le suivi de chantier par drone pour les clients BTP, industriels et portuaires au Cameroun.",
    linkedin: 'https://www.linkedin.com/in/franck-d',
    order: 7,
  },
  {
    id: '8',
    slug: 'responsable-hse',
    name: 'Clarisse B.',
    role: 'Responsable HSE Incendie',
    pole: 'technique',
    level: 'staff',
    photo:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Clarisse B., Responsable HSE et Sécurité Incendie chez BNP Coorporation',
    seoDescription:
      "Clarisse B. est Responsable HSE et Sécurité Incendie chez BNP Coorporation Sarl. Elle conduit les audits de sécurité incendie, élabore les plans d'évacuation et anime les formations et exercices pour les sites industriels et portuaires au Cameroun.",
    linkedin: 'https://www.linkedin.com/in/clarisse-b',
    order: 8,
  },
  {
    id: '9',
    slug: 'assistante-admin',
    name: 'Vanessa L.',
    role: 'Assistante Administrative',
    pole: 'support',
    level: 'staff',
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&auto=format&fit=crop',
    photoAlt: 'Vanessa L., Assistante Administrative chez BNP Coorporation',
    seoDescription:
      "Vanessa L. est Assistante Administrative chez BNP Coorporation Sarl à Yaoundé. Elle gère l'établissement des devis sous 24 à 48 heures, la planification des visites techniques et le suivi de la relation client.",
    linkedin: 'https://www.linkedin.com/in/vanessa-l',
    order: 9,
  },
];

/** Tente le CPT `membre` côté WP, sinon repli sur les données mockées. */
export async function getTeam(locale: string): Promise<TeamMember[]> {
  try {
    const raw = await fetchREST<any[]>('membre?per_page=100&_embed');
    if (Array.isArray(raw) && raw.length > 0) {
      const mapped: TeamMember[] = raw.map((item: any, i: number) => {
        const acf = item?.acf && typeof item.acf === 'object' ? item.acf : {};
        const media = item._embedded?.['wp:featuredmedia']?.[0];
        const sizes = media?.media_details?.sizes || {};
        const photo =
          sizes.large?.source_url ||
          sizes.full?.source_url ||
          media?.source_url ||
          MOCK_TEAM[i % MOCK_TEAM.length].photo;
        const pickEn = (fr: any, en: any) => {
          const e = typeof en === 'string' ? en.trim() : '';
          if (locale === 'en' && e) return en;
          return typeof fr === 'string' ? fr : '';
        };
        return {
          id: String(item.id),
          slug: item.slug,
          name:
            typeof item.title?.rendered === 'string'
              ? item.title.rendered.replace(/<[^>]*>/g, '').trim()
              : pickEn(acf.nom, acf.nom_en) || `Membre ${item.id}`,
          role: pickEn(acf.poste, acf.poste_en) || '',
          pole: typeof acf.pole === 'string' && acf.pole ? acf.pole : 'technique',
          level: acf.niveau === 'direction' ? 'direction' : 'staff',
          photo,
          photoAlt: media?.alt_text || '',
          // Texte alternatif invisible : ACF `description_seo` (+ `_en`),
          // repli sur l'ACF `bio` (+ `_en`) si présent.
          seoDescription:
            pickEn(acf.description_seo, acf.description_seo_en) ||
            pickEn(acf.bio, acf.bio_en) ||
            '',
          linkedin: typeof acf.linkedin === 'string' ? acf.linkedin : null,
          order: typeof acf.ordre === 'number' ? acf.ordre : i,
        };
      });
      return mapped.sort((a, b) => a.order - b.order);
    }
  } catch {
    // Repli silencieux sur le mock
  }
  void locale;
  return [...MOCK_TEAM].sort((a, b) => a.order - b.order);
}

export async function getTeamMemberBySlug(
  slug: string,
  locale: string
): Promise<TeamMember | null> {
  const all = await getTeam(locale);
  return all.find((m) => m.slug === slug) ?? null;
}
