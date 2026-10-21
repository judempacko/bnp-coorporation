import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getAllServices, type ServiceNode } from '@/lib/api';
import { fallbackServicesNav } from './[slug]/page';
import { PageHero } from '@/components/PageHero';
import { canonicalFor, languageAlternates } from '@/lib/seo';

const FALLBACK_CARD_IMAGE =
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800';

interface ServiceCard {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  imageAlt: string;
}

function toCard(service: ServiceNode): ServiceCard {
  return {
    slug: service.slug,
    title: service.title,
    excerpt: service.subtitle || service.lead,
    image: service.heroImage || null,
    imageAlt: service.heroImageAlt || service.title,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  const title = fr ? 'Nos Services' : 'Our Services';
  const description = fr
    ? "7 pôles d'expertise BNPC au Cameroun : sécurité incendie, BTP, forage d'eau, solaire, drones, naval, nettoyage industriel. Devis sous 24-48h."
    : '7 BNPC expertise areas in Cameroon: fire safety, construction, water drilling, solar, drones, naval, industrial cleaning. Quote within 24-48h.';
  return {
    title: `${title} — BNPC`,
    description,
    alternates: {
      canonical: canonicalFor(locale, '/services'),
      languages: languageAlternates('/services'),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
      description,
      type: 'website',
      url: canonicalFor(locale, '/services'),
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const wpServices = await getAllServices(locale);
  const cards: ServiceCard[] =
    wpServices.length > 0
      ? wpServices.map(toCard)
      : fallbackServicesNav.map((s) => ({
          slug: s.slug,
          title: fr ? s.fr : s.en,
          excerpt: fr
            ? 'Expertise et ingénierie spécialisée adaptée aux exigences du marché.'
            : 'Specialized expertise and engineering adapted to market requirements.',
          image: null,
          imageAlt: fr ? s.fr : s.en,
        }));

  return (
    <main className="w-full bg-white">
      <PageHero
        title={fr ? 'Nos Services' : 'Our Services'}
        subtitle={
          fr
            ? 'Sept pôles d\u2019expertise complémentaires pour répondre à vos défis industriels, techniques et opérationnels sur l\u2019ensemble du territoire camerounais.'
            : 'Seven complementary areas of expertise to meet your industrial, technical and operational challenges across Cameroon.'
        }
        image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1800"
      />

      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card) => (
            <Link
              key={card.slug}
              href={`/${locale}/services/${card.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-brand transition-colors"
            >
              <div className="relative w-full h-52 bg-neutral-200 overflow-hidden">
                <Image
                  src={card.image || FALLBACK_CARD_IMAGE}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-2.5 sm:space-y-3">
                <h2 className="text-[20px] sm:text-[24px] leading-[1.3] font-semibold text-ink group-hover:text-brand transition-colors">
                  {card.title}
                </h2>
                {card.excerpt && (
                  <p className="text-[16px] leading-[1.7] text-muted line-clamp-3">
                    {card.excerpt}
                  </p>
                )}
                <span className="mt-auto pt-2 inline-flex items-center gap-2 text-[16px] font-semibold text-brand">
                  {fr ? 'Découvrir' : 'Discover'}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
