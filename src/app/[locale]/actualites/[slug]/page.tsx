import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/api';

export default async function ArticleDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${locale}/actualites`}
        className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-8"
      >
        ← {locale === 'fr' ? 'Retour aux actualités' : 'Back to news'}
      </Link>

      <header className="mb-8">
        {post.categories?.nodes && post.categories.nodes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.nodes.map((cat) => (
              <span
                key={cat.slug}
                className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>Par <strong className="text-slate-700 dark:text-slate-300">{post.author?.node?.name || 'BNPC Admin'}</strong></span>
          <span>•</span>
          <time dateTime={post.date}>{formattedDate}</time>
        </div>
      </header>

      {post.featuredImage?.node?.sourceUrl && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {post.content && (
        <div
          className="prose dark:prose-invert prose-lg max-w-none text-slate-800 dark:text-slate-200"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </article>
  );
}
