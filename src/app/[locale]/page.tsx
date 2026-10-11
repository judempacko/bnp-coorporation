import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { HeroIntro } from '@/components/animations/HeroIntro';
import { canonicalFor, languageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  // Marque en tête de title : verrouille "bnp coorporation / bnpc" contre
  // l'autocorrect "corporate" de Google. `absolute` contourne le template
  // layout pour éviter la duplication "… — BNP Coorporation Sarl".
  const title = fr
    ? 'BNP Coorporation Sarl (BNPC) — Sécurité incendie, BTP & Ingénierie au Cameroun'
    : 'BNP Coorporation Sarl (BNPC) — Fire Safety, Construction & Engineering in Cameroon';
  const description = fr
    ? "BNP Coorporation Sarl (BNPC) à Yaoundé : sécurité incendie (SSIAP, audits ERP), BTP, forage d'eau, solaire, drones, naval. Devis sous 24-48h, intervention Yaoundé-Douala-Kribi."
    : 'BNP Coorporation Sarl (BNPC) in Yaoundé: fire safety (SSIAP, ERP audits), construction, water drilling, solar, drones, naval repair. Quote within 24-48h across Cameroon.';
  const path = '';
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalFor(locale, path),
    },
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const t = await getTranslations('HomePage');
  const posts = await getAllPosts();

  return (
    <main className="flex flex-col flex-1 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-24 w-full space-y-16">
      {/* Hero Section — H1 = marque exacte, non négociable pour le SEO de marque */}
      <section className="text-center py-12 sm:py-16">
        <HeroIntro>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 text-xl font-medium text-blue-700 dark:text-blue-300">
            {t('subtitle')}
          </p>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('description')}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full bg-[#0A66C2] px-6 py-3 text-base font-semibold text-white hover:bg-[#0854a0] transition-colors"
            >
              {fr ? 'Demander un devis 24-48h' : 'Request a quote in 24-48h'}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
            >
              {fr ? 'Nos services' : 'Our services'}
            </Link>
          </div>
        </HeroIntro>
      </section>

      {/* Posts Section */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            {locale === 'fr' ? 'Nos Derniers Articles' : 'Latest Articles'}
          </h2>
          <Link
            href={`/${locale}/actualites`}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {locale === 'fr' ? 'Voir tout →' : 'View all →'}
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              {locale === 'fr' ? 'Aucun article disponible.' : 'No articles available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
