import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ScrubLead } from '@/components/services/ScrubLead';
import { Counter } from '@/components/animations/Counter';
import { EditorialRow } from '@/components/entreprise/EditorialRow';
import { TeamGrid } from '@/components/entreprise/TeamGrid';
import { getTeam } from '@/lib/team';
import { getGalleryEvents, formatEventDate } from '@/lib/gallery';

const STORY1_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
const STORY2_IMAGE =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CompanyPage' });
  return {
    title: `${t('title')} — BNPC`,
    description: t('intro'),
  };
}

export default async function QuiSommesNousPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const t = await getTranslations('CompanyPage');
  const c = await getTranslations('ContactPage');
  const teamT = await getTranslations('TeamPage');

  const values = [
    { title: c('value1Title'), desc: c('value1Desc') },
    { title: c('value2Title'), desc: c('value2Desc') },
    { title: c('value3Title'), desc: c('value3Desc') },
    { title: c('value4Title'), desc: c('value4Desc') },
    { title: c('value5Title'), desc: c('value5Desc') },
    { title: c('value6Title'), desc: c('value6Desc') },
  ];

  const members = await getTeam(locale);
  const events = (await getGalleryEvents(locale)).slice(0, 3);

  const labels = {
    backHome: fr ? 'Accueil' : 'Home',
    discover: fr ? 'Découvrir' : 'Discover',
    galleryAll: fr ? 'Voir toute la galerie' : 'View the full gallery',
  };

  return (
    <main className="w-full bg-white text-[#2c2c2c]">
      {/* Header compact : bandeau bleu profond uni, sans cinématique.
          Le hero photo plein écran n'a pas de sens ici (page éditoriale),
          et le bleu vif est réservé aux CTA — d'où une teinte profonde. */}
      <section className="bg-[#0B2F5C] text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 py-10 sm:py-14">
          <Link
            href={`/${locale}`}
            className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[14px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <span aria-hidden className="transition-transform duration-300 ease-out group-hover:-translate-x-1">←</span>
            {labels.backHome}
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
            {t('title')}
          </h1>
          <p className="mt-2 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-blue-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 2. Récit : lead scrub + lignes éditoriales */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-14 sm:py-20">
        <div className="max-w-[960px] mx-auto space-y-14 sm:space-y-16">
          <ScrubLead text={t('intro')} />

          <div className="space-y-12 sm:space-y-16">
            <EditorialRow
              index={0}
              title={t('story1Title')}
              paragraphs={[c('aboutCol1')]}
              image={STORY1_IMAGE}
              imageAlt={t('story1Title')}
              imageFirst
            />
            <EditorialRow
              index={1}
              title={t('story2Title')}
              paragraphs={[c('aboutCol2')]}
              image={STORY2_IMAGE}
              imageAlt={t('story2Title')}
              imageFirst={false}
            />
          </div>
        </div>
      </div>

      {/* 3. Chiffres clés */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-20">
        <div className="rounded-3xl bg-[#0A66C2] text-white p-8 sm:p-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <Counter target={10} suffix="+" className="text-5xl sm:text-6xl font-bold text-white" />
              <div className="text-base font-semibold text-blue-100">{t('stats.years')}</div>
            </div>
            <div className="space-y-2">
              <Counter target={120} suffix="+" className="text-5xl sm:text-6xl font-bold text-white" />
              <div className="text-base font-semibold text-blue-100">{t('stats.projects')}</div>
            </div>
            <div className="space-y-2">
              <Counter target={45} suffix="+" className="text-5xl sm:text-6xl font-bold text-white" />
              <div className="text-base font-semibold text-blue-100">{t('stats.experts')}</div>
            </div>
            <div className="space-y-2">
              <Counter target={98} suffix="%" className="text-5xl sm:text-6xl font-bold text-white" />
              <div className="text-base font-semibold text-blue-100">{t('stats.satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Équipe */}
      <section id="equipe" className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-20 scroll-mt-24">
        <TeamGrid
          members={members}
          locale={locale}
          labels={{
            title: teamT('listTitle'),
            subtitle: teamT('listSubtitle'),
          }}
        />
      </section>

      {/* 5. Mission & Vision en cartes */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-20">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-center text-[24px] sm:text-[28px] font-semibold text-[#2c2c2c]">
            {c('missionVisionTitle')}
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-neutral-100 p-8">
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-semibold tracking-[0.2em] text-[#0A66C2]">01</span>
                <span className="h-px w-12 bg-[#0A66C2]" />
              </div>
              <h3 className="mt-2 text-[20px] font-semibold text-[#2c2c2c]">{c('missionTitle')}</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#2c2c2c]">{c('missionDesc')}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-neutral-100 p-8">
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-semibold tracking-[0.2em] text-[#0A66C2]">02</span>
                <span className="h-px w-12 bg-[#0A66C2]" />
              </div>
              <h3 className="mt-2 text-[20px] font-semibold text-[#2c2c2c]">{c('visionTitle')}</h3>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#2c2c2c]">{c('visionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Valeurs en cartes numérotées */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-20">
        <h2 className="text-center text-[24px] sm:text-[28px] font-semibold text-[#2c2c2c]">
          {c('valuesTitle')}
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#0A66C2] transition-colors"
            >
              <span className="text-[15px] font-semibold tracking-[0.2em] text-[#0A66C2]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-[18px] font-semibold text-[#2c2c2c]">{v.title}</h3>
              <p className="mt-1.5 text-[15px] leading-[1.7] text-[#666]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Galerie : bandeau façon "autres expertises" */}
      {events.length > 0 && (
        <section className="bg-neutral-100 border-t border-slate-200 py-12 sm:py-14">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
            <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
              <h2 className="text-[24px] font-semibold leading-snug text-[#2c2c2c] sm:text-[28px]">
                {t('galleryTeaserTitle')}
              </h2>
              <Link
                href={`/${locale}/galerie`}
                className="hidden sm:inline-flex items-center gap-1.5 text-[16px] font-semibold text-[#0A66C2] shrink-0 hover:underline"
              >
                {labels.galleryAll}
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {events.map((e) => (
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
                      {labels.discover}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link
                href={`/${locale}/galerie`}
                className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-[#0A66C2]"
              >
                {labels.galleryAll}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. Bannière CTA bleue */}
      <section className="bg-[#0A66C2] text-white py-12 px-6 sm:py-14 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center items-stretch justify-between gap-6 md:gap-8">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-[26px] font-semibold text-white leading-tight sm:text-[32px]">
              {teamT('ctaTitle')}
            </h2>
            <p className="text-[16px] text-white leading-relaxed">
              {teamT('ctaDesc')}
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-block w-full text-center bg-white text-[#0A66C2] hover:bg-neutral-100 font-semibold text-[16px] px-8 py-3.5 rounded-full transition-colors shadow-none shrink-0 sm:w-auto"
            style={{ boxShadow: 'none' }}
          >
            {teamT('ctaButton')}
          </Link>
        </div>
      </section>
    </main>
  );
}
