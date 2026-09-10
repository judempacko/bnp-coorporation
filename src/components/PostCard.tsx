import Link from 'next/link';
import { PostNode } from '@/lib/api';

interface PostCardProps {
  post: PostNode;
  locale: string;
}

export function PostCard({ post, locale }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {post.featuredImage?.node?.sourceUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* Categories */}
        {post.categories?.nodes && post.categories.nodes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.nodes.map((cat) => (
              <span
                key={cat.slug}
                className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          <Link href={`/${locale}/actualites/${post.slug}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <div
            className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 prose dark:prose-invert prose-sm"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        {/* Meta Footer */}
        <div className="mt-auto pt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
          <span className="font-medium">{post.author?.node?.name || 'BNPC Admin'}</span>
          <time dateTime={post.date}>{formattedDate}</time>
        </div>
      </div>
    </article>
  );
}
