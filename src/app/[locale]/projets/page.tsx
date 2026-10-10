import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { canonicalFor, languageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  const title = fr ? 'Projets & Réalisations' : 'Projects & Achievements';
  const description = fr
    ? "Réalisations BNPC au Cameroun : BTP, sécurité incendie, forages, solaire, drones, naval. Études de cas et chantiers Yaoundé-Douala-Kribi."
    : 'BNPC projects in Cameroon: construction, fire safety, drilling, solar, drones, naval. Case studies across Cameroon.';
  return {
    title: `${title} — BNPC`,
    description,
    alternates: {
      canonical: canonicalFor(locale, '/projets'),
      languages: languageAlternates('/projets'),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
      description,
      type: 'website',
      url: canonicalFor(locale, '/projets'),
    },
  };
}

export default async function ProjetsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">
        {locale === 'fr' ? 'Nos Projets & Réalisations' : 'Our Projects & Achievements'}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        {locale === 'fr' 
          ? 'Découvrez nos projets d\'ingénierie majeurs et cas d\'usage.'
          : 'Discover our major engineering projects and case studies.'}
      </p>
    </main>
  );
}
