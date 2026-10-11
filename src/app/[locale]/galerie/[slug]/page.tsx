import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ScrubLead } from '@/components/services/ScrubLead';
import { GalleryCarousel } from '@/components/entreprise/GalleryCarousel';
import {
  categoryLabel,
  formatEventDate,
  getGalleryEventBySlug,
  getGalleryEvents,
} from '@/lib/gallery';

export async function generateStaticParams() {
  // Pré-rendu FR des slugs mockés ; EN et futurs slugs WP en rendu dynamique.
  const events = await getGalleryEvents('fr');
  return events.flatMap((e) => [{ locale: 'fr', slug: e.slug }]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getGalleryEventBySlug(slug, locale);
  if (!event) return {};
  return {
    title: `${event.title} — BNPC`,
    description: event.description.slice(0, 155),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 200),
      type: 'article',
      images: [{ url: event.cover, alt: event.coverAlt || event.title }],
    },
  };
}

export default async function GalerieDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const t = await getTranslations('GalleryPage');
  const event = await getGalleryEventBySlug(slug, locale);

  if (!event) notFound();

  const others = (await getGalleryEvents(locale))
    .filter((e) => e.slug !== event.slug && e.category === event.category)
    .slice(0, 3);
  const fallbackOthers = (
    others.length > 0
      ? others
      : (await getGalleryEvents(locale)).filter((e) => e.slug !== event.slug).slice(0, 3)
  );

  // Données structurées Event + images → excellent SEO (rich results Google Images).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    location: { '@type': 'Place', name: event.lieu },
    description: event.description,
    image: event.images.map((img) => img.url),
    organizer: { '@type': 'Organization', name: 'BNP Coorporation Sarl' },
  };

  return (
    <main className="w-full bg-white text-[#2c2c2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. Hero cinématique sur la photo de couverture */}
      <ServiceHero
        title={event.title}
        subtitle={`${formatEventDate(event.date, locale)} · ${event.lieu}`}
        image={event.cover}
        backLabel={t('detailBack')}
        backHref={`/${locale}/galerie`}
      />

      {/* 2. Reportage : carousel + récit + encadré infos */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-14 sm:py-20">
        <div className="max-w-[960px] mx-auto space-y-10">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[13px] font-semibold text-[#0A66C2] border border-blue-200 w-fit">
            {categoryLabel(event.category, locale)}
          </span>
          <GalleryCarousel images={event.images} title={event.title} />
          <ScrubLead text={event.description} />
        </div>

        <div className="max-w-[960px] mx-auto mt-10 rounded-2xl border border-slate-200 bg-neutral-100 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[15px]">
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {t('eventDate')}
            </h2>
            <p className="mt-1.5 font-semibold text-[#2c2c2c]">
              <time dateTime={event.date}>{formatEventDate(event.date, locale)}</time>
            </p>
          </div>
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {t('eventPlace')}
            </h2>
            <p className="mt-1.5 font-semibold text-[#2c2c2c]">{event.lieu}</p>
          </div>
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {t('eventCategory')}
            </h2>
            <p className="mt-1.5 font-semibold text-[#2c2c2c]">
              {categoryLabel(event.category, locale)}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Autres événements façon "autres expertises" */}
      {fallbackOthers.length > 0 && (
        <section className="bg-neutral-100 border-t border-slate-200 py-12 sm:py-14">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
            <h2 className="text-[24px] font-semibold leading-snug text-[#2c2c2c] mb-6 sm:text-[28px] sm:mb-8">
              {t('moreEvents')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {fallbackOthers.map((e) => (
                <Link
                  key={e.id}
                  href={`/${locale}/galerie/${e.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-[#0A66C2] transition-colors"
                >
                  <div className="relative w-full h-44 bg-neutral-200 overflow-hidden">
                    <Image
                      src={e.cover}
                      alt={e.coverAlt || e.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[18px] font-semibold leading-snug text-[#2c2c2c] group-hover:text-[#0A66C2] transition-colors line-clamp-1">
                      {e.title}
                    </span>
                    <span className="mt-1 text-[14px] text-[#666]">
                      <time dateTime={e.date}>{formatEventDate(e.date, locale)}</time> · {e.lieu}
                    </span>
                    <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[16px] font-semibold text-[#0A66C2]">
                      {fr ? 'Découvrir' : 'Discover'}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Bannière CTA bleue */}
      <section className="bg-[#0A66C2] text-white py-12 px-6 sm:py-14 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center items-stretch justify-between gap-6 md:gap-8">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-[26px] font-semibold text-white leading-tight sm:text-[32px]">
              {t('ctaTitle')}
            </h2>
            <p className="text-[16px] text-white leading-relaxed">
              {t('ctaDesc')}
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-block w-full text-center bg-white text-[#0A66C2] hover:bg-neutral-100 font-semibold text-[16px] px-8 py-3.5 rounded-full transition-colors shadow-none shrink-0 sm:w-auto"
            style={{ boxShadow: 'none' }}
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}
