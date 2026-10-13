'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { SITE_URL } from '@/lib/seo';

// Libellés du 1er niveau (pages principales). Les slugs profonds sont humanisés.
const SECTION_LABELS: Record<string, { fr: string; en: string }> = {
  services: { fr: 'Services', en: 'Services' },
  projets: { fr: 'Projets', en: 'Projects' },
  actualites: { fr: 'Actualités', en: 'News' },
  'qui-sommes-nous': { fr: 'Qui sommes-nous', en: 'About us' },
  galerie: { fr: 'Galerie', en: 'Gallery' },
  contact: { fr: 'Contact', en: 'Contact' },
  'bnp-coorporation-sarl-bnpc': { fr: 'BNP Coorporation Sarl', en: 'BNP Coorporation Sarl' },
};

function humanize(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const en = locale === 'en';

  // /fr/services/securite-incendie -> ['services', 'securite-incendie']
  const segments = (pathname || '/').split('/').filter(Boolean).slice(1);
  if (segments.length === 0) return null; // accueil : pas de fil d'Ariane

  const homeLabel = en ? 'Home' : 'Accueil';

  // Chemins relatifs pour <Link>, URLs absolues pour le JSON-LD.
  const crumbs = [{ name: homeLabel, path: `/${locale}` }];
  let trail = `/${locale}`;
  for (const seg of segments) {
    trail += `/${seg}`;
    const section = SECTION_LABELS[seg];
    crumbs.push({
      name: section != null ? (en ? section.en : section.fr) : humanize(seg),
      path: trail,
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };

  return (
    <div className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="max-w-[1100px] mx-auto px-6 pt-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] leading-[1.5] text-muted">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {isLast ? (
                  <span aria-current="page" className="text-ink font-medium">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.path} className="hover:text-brand transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
