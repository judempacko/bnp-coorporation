import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ServiceHero } from '@/components/services/ServiceHero';
import { GalleryGrid } from '@/components/entreprise/GalleryGrid';
import { getGalleryEvents } from '@/lib/gallery';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GalleryPage' });
  return {
    title: `${t('title')} — BNPC`,
    description: t('intro'),
  };
}

export default async function GaleriePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('GalleryPage');
  const events = await getGalleryEvents(locale);
  const backLabel = locale === 'fr' ? 'Accueil' : 'Home';

  return (
    <main className="w-full bg-white text-ink">
      <ServiceHero
        title={t('title')}
        subtitle={t('intro')}
        image={HERO_IMAGE}
        backLabel={backLabel}
        backHref={`/${locale}`}
      />

      <section className="max-w-[1100px] mx-auto px-6 py-12">
        <GalleryGrid events={events} locale={locale} allLabel={locale === 'fr' ? 'Tout' : 'All'} />
      </section>

      <section className="bg-brand text-white py-12 px-6 sm:py-14 sm:px-12 lg:px-16">
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
            className="inline-block w-full text-center bg-white text-brand hover:bg-neutral-100 font-semibold text-[16px] px-8 py-3.5 rounded-full transition-colors shadow-none shrink-0 sm:w-auto"
            style={{ boxShadow: 'none' }}
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}
