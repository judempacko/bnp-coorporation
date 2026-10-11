import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/api';
import { canonicalFor, languageAlternates, SITE_URL } from '@/lib/seo';
import { cleanWpText } from '@/lib/html';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return {};
  const plainTitle = cleanWpText(post.title);
  const description =
    cleanWpText(post.excerpt || post.content || '').slice(0, 155) ||
    `${plainTitle} — BNP Coorporation Sarl, Cameroun.`;
  const path = `/actualites/${slug}`;
  const image = post.featuredImage?.node?.sourceUrl;
  return {
    title: `${plainTitle} — BNPC`,
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title: plainTitle,
      description,
      type: 'article',
      url: canonicalFor(locale, path),
      ...(image ? { images: [{ url: image, alt: post.featuredImage?.node?.altText || plainTitle }] } : {}),
    },
    twitter: { card: 'summary_large_image', title: plainTitle, description },
  };
}

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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cleanWpText(post.title),
    description: cleanWpText(post.excerpt || '').slice(0, 200) || undefined,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author?.node?.name || 'BNP Coorporation Sarl',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BNP Coorporation Sarl',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-bnpc.svg` },
    },
    mainEntityOfPage: canonicalFor(locale, `/actualites/${slug}`),
    ...(post.featuredImage?.node?.sourceUrl
      ? { image: [post.featuredImage.node.sourceUrl] }
      : {}),
  };

  return (
    <article className="content-narrow mx-auto px-6 sm:px-8 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link
        href={`/${locale}/actualites`}
        className="inline-flex items-center text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-8"
      >
        ← {locale === 'fr' ? 'Retour aux actualités' : 'Back to news'}
      </Link>

      <header className="mb-8 space-y-4">
        {post.categories?.nodes && post.categories.nodes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.nodes.map((cat) => (
              <span
                key={cat.slug}
                className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1 text-sm font-semibold text-blue-600 border border-blue-200"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-base text-slate-500 dark:text-slate-400">
          <span>Par <strong className="text-slate-700 dark:text-slate-300">{post.author?.node?.name || 'BNPC Admin'}</strong></span>
          <span>•</span>
          <time dateTime={post.date}>{formattedDate}</time>
        </div>
      </header>

      {post.featuredImage?.node?.sourceUrl && (
        <div className="mb-10 rounded-3xl overflow-hidden shadow-xl">
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || cleanWpText(post.title)}
            className="w-full h-auto max-h-[550px] object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {post.content && (
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </article>
  );
}
