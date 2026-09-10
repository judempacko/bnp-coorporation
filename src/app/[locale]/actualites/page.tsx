import { setRequestLocale } from 'next-intl/server';
import { getAllPosts } from '@/lib/api';
import { PostCard } from '@/components/PostCard';

export default async function ActualitesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getAllPosts();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {locale === 'fr' ? 'Dernières Actualités' : 'Latest News'}
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          {locale === 'fr' 
            ? 'Découvrez nos articles, événements et mises à jour du groupe BNPC.'
            : 'Explore our articles, events, and updates from the BNPC group.'}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">
            {locale === 'fr' ? 'Aucun article trouvé pour le moment.' : 'No posts found at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      )}
    </main>
  );
}
