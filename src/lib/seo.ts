export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.bnp-coorporation.com';

export const SITE_NAME = 'BNP Coorporation Sarl';
export const SITE_SHORT = 'BNPC';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-bnpc.svg`;

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
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_SHORT,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo-bnpc.svg`,
    },
    email: 'contact@bnp-coorporation.com',
    telephone: '+237655010919',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'BP 4219',
      addressLocality: 'Yaoundé',
      addressCountry: 'CM',
    },
    areaServed: ['Yaoundé', 'Douala', 'Kribi', 'Cameroun'],
    foundingDate: '2023',
    sameAs: [] as string[],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${SITE_SHORT} — Services & Ingénierie au Cameroun`,
    inLanguage: ['fr', 'en'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}
