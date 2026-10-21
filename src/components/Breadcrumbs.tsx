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
  'conditions-generales-utilisation': { fr: "Conditions d'utilisation", en: 'Terms of Service' },
  'politique-de-confidentialite': { fr: 'Politique de confidentialité', en: 'Privacy Policy' },
};

function humanize(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

interface BreadcrumbsProps {
  variant?: 'light' | 'dark';
  currentLabel?: string;
  className?: string;
}

export function Breadcrumbs({ variant = 'light', currentLabel, className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const en = locale === 'en';
  const onDark = variant === 'dark';

  // /fr/services/securite-incendie -> ['services', 'securite-incendie']
  const segments = (pathname || '/').split('/').filter(Boolean).slice(1);
  if (segments.length === 0) return null;

  const homeLabel = en ? 'Home' : 'Accueil';

  // Chemins relatifs pour <Link>, URLs absolues pour le JSON-LD.
  const crumbs = [{ name: homeLabel, path: `/${locale}` }];
  let trail = `/${locale}`;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    trail += `/${seg}`;
    const isLast = i === segments.length - 1;
    const section = SECTION_LABELS[seg];
    crumbs.push({
      name:
        isLast && currentLabel
          ? currentLabel
          : section != null
            ? en
              ? section.en
              : section.fr
            : humanize(seg),
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={className}>
        <ol
          className={`flex flex-wrap items-center gap-1.5 text-[13px] leading-[1.5] ${
            onDark ? 'text-white/70' : 'text-muted'
          }`}
        >
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className={onDark ? 'text-white/40' : undefined}>
                    /
                  </span>
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className={`font-medium ${onDark ? 'text-white' : 'text-ink'}`}
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.path}
                    className={`transition-colors ${
                      onDark ? 'hover:text-white' : 'hover:text-brand'
                    }`}
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
