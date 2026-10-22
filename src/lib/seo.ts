import { COMPANY } from '@/lib/company';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.bnp-coorporation.com';

export const SITE_NAME = COMPANY.legalName;
export const SITE_SHORT = 'BNPC';
export const BRAND_TAGLINE_FR =
  'BNP Coorporation Sarl (BNPC) — Entreprise camerounaise indépendante';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-bnpc.svg`;
// TODO(P1 SEO): ajouter /public/logo-bnpc.png 112x112 (Google n'accepte pas le SVG
// pour le rich result Logo) puis basculer DEFAULT_OG_IMAGE + logo JSON-LD vers le PNG.

/**
 * Profils officiels (sameAs JSON-LD). Ordre : LinkedIn > Facebook > autres.
 * Laisser un tableau vide casse la désambiguïsation d'entité face à
 * BNP Paribas / BNP Paribas Corporate.
 */
export const SOCIAL_PROFILES: string[] = [
  COMPANY.social.linkedin,
  COMPANY.social.facebook,
];

/** Toutes les variantes exactes que Google doit associer à la même entité. */
export const BRAND_VARIANTS = [
  'BNP Coorporation Sarl',
  'BNP Coorporation',
  'BNPC',
  'bnp coorporation',
  'bnp coorporation sarl',
  'BNP Coorporation Sarl Yaoundé',
  'BNP Coorporation Cameroun',
] as const;

export const BRAND_DISAMBIGUATION_FR =
  "BNP Coorporation Sarl (BNPC) est une entreprise camerounaise indépendante basée à Yaoundé. Elle n'a aucun lien avec BNP Paribas ni BNP Paribas Corporate.";
export const BRAND_DISAMBIGUATION_EN =
  'BNP Coorporation Sarl (BNPC) is an independent Cameroonian company based in Yaoundé. It is not affiliated with BNP Paribas or BNP Paribas Corporate.';

export const LOCALES = ['fr', 'en'] as const;
export type SiteLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: SiteLocale = 'fr';

export function canonicalFor(locale: string, path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}/${locale}${clean === '/' ? '' : clean}`;
}

export function languageAlternates(path = ''): Record<string, string> {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const suffix = clean === '/' ? '' : clean;
  return {
    fr: `${SITE_URL}/fr${suffix}`,
    en: `${SITE_URL}/en${suffix}`,
    'x-default': `${SITE_URL}/fr${suffix}`,
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    // GeneralContractor = sous-type d'Organization + LocalBusiness :
    // donne le NAP local (Yaoundé) tout en gardant l'entité marque.
    '@type': 'GeneralContractor',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: [...BRAND_VARIANTS],
    disambiguatingDescription: BRAND_DISAMBIGUATION_FR,
    slogan: 'Ingénierie multiservices au Cameroun depuis 2023',
    url: SITE_URL,
    logo: `${SITE_URL}/logo-bnpc.svg`,
    image: `${SITE_URL}/logo-bnpc.svg`,
    email: COMPANY.email,
    telephone: COMPANY.phoneHref,
    foundingDate: COMPANY.foundedAt,
    foundingLocation: {
      '@type': 'Place',
      name: 'Yaoundé, Cameroun',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.poBox,
      addressLocality: COMPANY.city,
      addressCountry: COMPANY.countryCode,
    },
    areaServed: [
      { '@type': 'City', name: 'Yaoundé' },
      { '@type': 'City', name: 'Douala' },
      { '@type': 'City', name: 'Kribi' },
      { '@type': 'Country', name: 'Cameroun' },
    ],
    knowsAbout: [
      'Sécurité incendie',
      'BTP construction Cameroun',
      'Forage eau Cameroun',
      'Énergie solaire Cameroun',
      'Drones imagerie aérienne',
      'Réparation navale Kribi',
      'Nettoyage industriel',
    ],
    sameAs: SOCIAL_PROFILES,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'BNP Coorporation Sarl (BNPC) — Services & Ingénierie au Cameroun',
    alternateName: [...BRAND_VARIANTS],
    inLanguage: ['fr', 'en'],
    publisher: { '@id': `${SITE_URL}/#organization` },
    // SearchAction = éligible au sitelinks searchbox, prend de la place en SERP
    // et ancre la requête de marque sur notre domaine.
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/fr/actualites?q={search_term_string}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'query-input': 'required name=search_term_string' as any,
    },
  };
}
