/* eslint-disable @typescript-eslint/no-explicit-any -- Réponses WP REST dynamiques */
import { cache } from 'react';
import { fetchREST } from './wp-rest';
import { cleanWpText } from './html';

/**
 * Champs ACF attendus sur le CPT `partenaire` (rest_base `partenaire`) :
 *  nom / nom_en (text : enseigne), logo (image), site_web (url),
 *  ordre (number, optionnel). L'image mise en avant est acceptée en repli.
 */

export interface Partner {
  id: string;
  slug: string;
  /** Nom affiché (enseigne). */
  name: string;
  /** Logo (URL). Null = pastille texte. */
  logo: string | null;
  logoAlt: string;
  /** Lien externe éventuel (site du partenaire). */
  website?: string | null;
}

// ---------------------------------------------------------------------------
// Repli : secteurs clients types (pas de fausses enseignes inventées).
// À remplacer par le CPT `partenaire` côté WordPress (titre + logo + site).
// ---------------------------------------------------------------------------

const FALLBACK_PARTNERS_FR = [
  'Établissements ERP',
  'Banques & Assurances',
  'Industries',
  'Ports & Logistique',
  'BTP & Immobilier',
  'Agro & Collectivités',
];

const FALLBACK_PARTNERS_EN = [
  'Public-access buildings',
  'Banks & Insurance',
  'Industries',
  'Ports & Logistics',
  'Construction & Real Estate',
  'Agri & Communities',
];

/** Tente le CPT `partenaire` côté WP, sinon repli sur les secteurs types. */
export const getPartners = cache(async (locale: string): Promise<Partner[]> => {
  try {
    const raw = await fetchREST<any[]>('partenaire?per_page=50&_embed');
    if (Array.isArray(raw) && raw.length > 0) {
      const mapped = raw.map((item: any, i: number) => {
        const acf = item?.acf && typeof item.acf === 'object' ? item.acf : {};
        const media = item._embedded?.['wp:featuredmedia']?.[0];
        const sizes = media?.media_details?.sizes || {};
        // Champ ACF `logo` : tableau image (recommandé), ID média ou URL.
        let logo: string | null = null;
        let logoAlt = '';
        const logoField = acf.logo ?? acf.image ?? null;
        if (typeof logoField === 'string') {
          logo = logoField || null;
        } else if (typeof logoField === 'number') {
          logo = null; // ID résolu hors map (async) : repli média ci-dessous
        } else if (logoField && typeof logoField === 'object') {
          const lsizes = logoField.sizes || {};
          const pickSize = (s: any): string | null =>
            typeof s === 'string' ? s : (s?.source_url ?? null);
          logo =
            pickSize(lsizes.medium) ||
            pickSize(lsizes.thumbnail) ||
            logoField.url ||
            logoField.source_url ||
            null;
          logoAlt = logoField.alt || logoField.title || '';
        }
        if (!logo) {
          logo =
            (typeof acf.logo_url === 'string' && acf.logo_url) ||
            sizes.medium?.source_url ||
            sizes.full?.source_url ||
            media?.source_url ||
            null;
        }
        const pickEn = (fr: any, en: any) => {
          const e = typeof en === 'string' ? en.trim() : '';
          if (locale === 'en' && e) return en;
          return typeof fr === 'string' ? fr : '';
        };
        const name =
          cleanWpText(pickEn(acf.nom, acf.nom_en)) ||
          cleanWpText(item.title?.rendered) ||
          `Partenaire ${item.id}`;
        return {
          partner: {
            id: String(item.id),
            slug: item.slug,
            name,
            logo,
            logoAlt: cleanWpText(media?.alt_text) || logoAlt || name,
            website: typeof acf.site_web === 'string' ? acf.site_web : null,
          },
          order: typeof acf.ordre === 'number' ? acf.ordre : i,
        };
      });
      return mapped.sort((a, b) => a.order - b.order).map((m) => m.partner);
    }
  } catch {
    // Repli silencieux sur les secteurs types
  }
  const names = locale === 'en' ? FALLBACK_PARTNERS_EN : FALLBACK_PARTNERS_FR;
  return names.map((name, i) => ({
    id: `fallback-${i}`,
    slug: `secteur-${i}`,
    name,
    logo: null,
    logoAlt: name,
    website: null,
  }));
});
