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
  const title = fr
    ? 'Sécurité incendie, BTP & Ingénierie au Cameroun'
    : 'Fire Safety, Construction & Engineering in Cameroon';
  const description = fr
    ? "BNP Coorporation Sarl à Yaoundé : sécurité incendie (SSIAP, audits ERP), BTP, forage d'eau, solaire, drones, naval. Devis sous 24-48h, intervention Yaoundé-Douala-Kribi."
    : 'BNP Coorporation Sarl in Yaoundé: fire safety (SSIAP, ERP audits), construction, water drilling, solar, drones, naval repair. Quote within 24-48h across Cameroon.';
  const path = '';
  return {
    title,
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
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

  const t = await getTranslations('HomePage');
  const posts = await getAllPosts();

  return (
    <main className="flex flex-col flex-1 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-24 w-full space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 sm:py-16">
        <HeroIntro>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('description')}
          </p>
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
