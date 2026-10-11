import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LinkedinLogo, ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { getTeam, getTeamMemberBySlug } from '@/lib/team';

export async function generateStaticParams() {
  const [fr, en] = await Promise.all([getTeam('fr'), getTeam('en')]);
  const slugs = Array.from(new Set([...fr, ...en].map((m) => m.slug)));
  return slugs.flatMap((slug) => [{ locale: 'fr', slug }, { locale: 'en', slug }]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const member = await getTeamMemberBySlug(slug, locale);
  if (!member) return {};
  const title = `${member.name} – ${member.role}`;
  const description = (
    member.seoDescription || `${member.name}, ${member.role} — BNP Coorporation Sarl`
  ).slice(0, 155);
  return {
    title: `${title} — BNPC`,
    description,
    openGraph: {
      title,
      description: description.slice(0, 200),
      type: 'profile',
      images: [{ url: member.photo, alt: member.photoAlt || title }],
    },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('TeamPage');
  const member = await getTeamMemberBySlug(slug, locale);

  if (!member) notFound();

  const others = (await getTeam(locale))
    .filter((m) => m.slug !== member.slug)
    .slice(0, 3);

  // Fiche nominative invisible aux crawlers : nom + poste + description SEO.
  // La description reste non affichée à l'écran, conformément au parti pris.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    description:
      member.seoDescription || `${member.name}, ${member.role} — BNP Coorporation Sarl`,
    image: member.photo,
    worksFor: { '@type': 'Organization', name: 'BNP Coorporation Sarl' },
    ...(member.linkedin && member.linkedin !== '#'
      ? { sameAs: [member.linkedin] }
      : {}),
  };

  return (
    <main className="w-full bg-white text-[#2c2c2c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Retour équipe : bandeau fin, pas de hero cinématique ici */}
      <div className="mx-auto max-w-[1100px] px-6 pt-6">
        <Link
          href={`/${locale}/qui-sommes-nous`}
          className="group inline-flex items-center gap-2 text-[14px] font-semibold text-neutral-500 hover:text-[#0A66C2] transition-colors"
        >
          <ArrowLeft
            size={16}
            weight="bold"
            aria-hidden
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
          />
          {locale === 'fr' ? "Retour à l'équipe" : 'Back to the team'}
        </Link>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-12 sm:pt-10 sm:pb-16 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-8 md:gap-12 items-start">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-200">
          <Image
            src={member.photo}
            alt={member.photoAlt || `${member.name}, ${member.role} — BNP Coorporation`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover"
          />
        </div>

        {/* Colonne éditoriale : pas de boîte, axe optique aligné sur le haut photo */}
        <div className="md:pt-1">
          <h1 className="text-[28px] sm:text-[32px] leading-[1.15] font-semibold tracking-tight text-[#2c2c2c]">
            {member.name}
          </h1>
          <p className="mt-2 text-[17px] font-medium text-[#0A66C2]">{member.role}</p>
          {/* Année d'entrée réelle (ACF) — masquée si non renseignée */}
          {member.startYear && (
            <p className="mt-1.5 text-[15px] text-neutral-500">
              {locale === 'fr'
                ? `En poste depuis ${member.startYear}`
                : `With BNPC since ${member.startYear}`}
            </p>
          )}

          <hr className="mt-6 mb-4 border-neutral-200" />

          {/* Missions réelles (ACF bio) — masquées si non renseignées */}
          {member.bio && member.bio.length > 0 && (
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                {locale === 'fr' ? 'Missions' : 'Key responsibilities'}
              </h3>
              <div className="mt-2 space-y-3">
                {member.bio.map((paragraph, i) => (
                  <p key={i} className="text-[16px] leading-[1.75] text-[#2c2c2c]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3">
            {member.linkedin && member.linkedin !== '#' && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn de ${member.name}`}
                className="inline-flex items-center justify-center gap-2 font-semibold text-[16px] px-6 py-3 rounded-full border border-neutral-300 text-[#2c2c2c] hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
              >
                <LinkedinLogo size={18} weight="fill" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section className="bg-neutral-100 border-t border-neutral-200 py-12 sm:py-14">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
            <h2 className="text-[24px] font-semibold leading-snug text-[#2c2c2c] mb-6 sm:text-[28px] sm:mb-8">
              {t('listTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {others.map((m) => (
                <Link
                  key={m.id}
                  href={`/${locale}/qui-sommes-nous/${m.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative w-full aspect-square bg-neutral-200 overflow-hidden rounded-xl">
                    <Image
                      src={m.photo}
                      alt={m.photoAlt || m.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-1 flex-col pt-4">
                    <span className="text-[18px] font-semibold leading-snug text-[#2c2c2c] group-hover:text-[#0A66C2] transition-colors">
                      {m.name}
                    </span>
                    <span className="mt-1 text-[14px] font-semibold text-[#0A66C2]">{m.role}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bannière CTA bleue */}
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
