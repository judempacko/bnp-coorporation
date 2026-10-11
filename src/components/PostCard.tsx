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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {post.featuredImage?.node?.sourceUrl && (
        <div className="relative h-56 w-full overflow-hidden bg-neutral-200">
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Categories */}
        {post.categories?.nodes && post.categories.nodes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.nodes.map((cat) => (
              <span
                key={cat.slug}
                className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-200"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-semibold tracking-tight leading-snug text-balance text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link href={`/${locale}/actualites/${post.slug}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <div
            className="mt-4 text-[0.95rem] leading-relaxed text-slate-600 line-clamp-3 [&_p]:m-0 [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        {/* Meta Footer */}
        <div className="mt-auto pt-6 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100">
          <span className="font-medium text-slate-700">{post.author?.node?.name || 'BNPC Admin'}</span>
          <time dateTime={post.date}>{formattedDate}</time>
        </div>
      </div>
    </article>
  );
}
