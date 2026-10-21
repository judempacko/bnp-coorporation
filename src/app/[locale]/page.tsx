import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  ClipboardText,
  Timer,
  MapPin,
  ArrowRight,
  PhoneCall,
  MagnifyingGlass,
  FileText,
  Wrench,
} from '@phosphor-icons/react/dist/ssr';
import { getAllPosts, getAllServices } from '@/lib/api';
import { getProjects } from '@/lib/projects';
import { getPartners } from '@/lib/partners';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { PostCard } from '@/components/PostCard';
import { HomeHero } from '@/components/home/HomeHero';
import { Reveal } from '@/components/animations/Reveal';
import { canonicalFor, languageAlternates } from '@/lib/seo';
import { fallbackServicesNav } from './services/[slug]/page';

const FALLBACK_CARD_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  // Marque en tête de title : verrouille "bnp coorporation / bnpc" contre
  // l'autocorrect "corporate" de Google. `absolute` contourne le template
  // layout pour éviter la duplication "… — BNP Coorporation Sarl".
  const title = fr
    ? 'BNP Coorporation Sarl (BNPC) — Sécurité incendie, BTP & Ingénierie au Cameroun'
    : 'BNP Coorporation Sarl (BNPC) — Fire Safety, Construction & Engineering in Cameroon';
  const description = fr
    ? "BNP Coorporation Sarl (BNPC) à Yaoundé : sécurité incendie (audits ERP), BTP, forage d'eau, solaire, drones, naval. Devis sous 24-48h, intervention Yaoundé, Douala et tout le Cameroun."
    : 'BNP Coorporation Sarl (BNPC) in Yaoundé: fire safety (ERP audits), construction, water drilling, solar, drones, naval repair. Quote within 24-48h across Cameroon.';
  const path = '';
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalFor(locale, path),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const t = await getTranslations('HomePage');
  const [wpServices, allPosts, projects, partners] = await Promise.all([
    getAllServices(locale).catch(() => []),
    getAllPosts().catch(() => []),
    getProjects(locale).catch(() => []),
    getPartners(locale).catch(() => []),
  ]);

  const serviceCards =
    wpServices.length > 0
      ? wpServices.map((s) => ({
          slug: s.slug,
          title: s.title,
          excerpt: s.subtitle || s.lead,
          image: s.heroImage || null,
          imageAlt: s.heroImageAlt || s.title,
        }))
      : fallbackServicesNav.map((s) => ({
          slug: s.slug,
          title: fr ? s.fr : s.en,
          excerpt: fr
            ? 'Expertise et ingénierie spécialisée adaptée aux exigences du marché.'
            : 'Specialized expertise and engineering adapted to market requirements.',
          image: null as string | null,
          imageAlt: fr ? s.fr : s.en,
        }));

  const posts = allPosts.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  // Hero : fond d'images défilant — visuels WordPress complétés
  // par des fallbacks pour garantir au moins 3 slides (sinon pas
  // de chevrons, carrousel inutile).
  const fallbackHeroSlides = [
    {
      src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920',
      alt: fr ? 'Chantier BTP au Cameroun' : 'Construction site in Cameroon',
    },
    {
      src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1920',
      alt: fr ? 'Équipe technique sur site industriel' : 'Technical team on industrial site',
    },
    {
      src: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1920',
      alt: fr ? 'Installation solaire' : 'Solar installation',
    },
  ];
  const wpHeroSlides = wpServices
    .filter((s) => s.heroImage)
    .slice(0, 5)
    .map((s) => ({
      src: s.heroImage as string,
      alt: s.heroImageAlt || s.title,
    }));
  const heroSlides = [...wpHeroSlides, ...fallbackHeroSlides]
    .filter((s, i, arr) => arr.findIndex((x) => x.src === s.src) === i)
    .slice(0, Math.max(3, wpHeroSlides.length));

  const proofs = fr
    ? [
        { value: '2023', label: 'Fondée à Yaoundé' },
        { value: '7', label: "Pôles d'expertise" },
        { value: '2', label: 'Bases : Yaoundé, Douala' },
        { value: '24-48h', label: 'Devis après visite technique' },
      ]
    : [
        { value: '2023', label: 'Founded in Yaoundé' },
        { value: '7', label: 'Areas of expertise' },
        { value: '2', label: 'Bases: Yaoundé, Douala' },
        { value: '24-48h', label: 'Quote after site visit' },
      ];

  const strengths = fr
    ? [
        {
          icon: ShieldCheck,
          title: 'Expertise pointe + terrain',
          desc: 'Industries, ports, BTP : nos ingénieurs connaissent les contraintes réelles des sites camerounais.',
        },
        {
          icon: ClipboardText,
          title: 'Visite technique sur site',
          desc: 'Selon la nature du projet : diagnostic sur site avant chiffrage.',
        },
        {
          icon: Timer,
          title: 'Devis validé en 24-48h',
          desc: 'Analyse par nos experts, validation par la direction sous 24 à 48h ouvrées.',
        },
        {
          icon: MapPin,
          title: 'Couverture nationale',
          desc: 'Mobilisables sur le terrain à Yaoundé, Douala et dans le reste du Cameroun pour fournir nos services.',
        },
      ]
    : [
        {
          icon: ShieldCheck,
          title: 'Top expertise + field mastery',
          desc: 'Industries, ports, construction: our engineers know the real constraints of Cameroonian sites.',
        },
        {
          icon: ClipboardText,
          title: 'On-site technical visit',
          desc: 'Construction, drilling, solar, fire audits: on-site diagnosis before any pricing.',
        },
        {
          icon: Timer,
          title: 'Quote validated in 24-48h',
          desc: 'Analysis by our experts, validated by management within 24-48 business hours.',
        },
        {
          icon: MapPin,
          title: 'Nationwide coverage',
          desc: 'Deployable on site in Yaoundé, Douala and across the rest of Cameroon to deliver our services.',
        },
      ];

  const steps = fr
    ? [
        {
          n: '01',
          icon: PhoneCall,
          title: 'Contact direct',
          desc: 'Téléphone, WhatsApp ou formulaire.',
        },
        {
          n: '02',
          icon: MagnifyingGlass,
          title: 'Visite technique',
          desc: 'Diagnostic précis sur site.',
        },
        {
          n: '03',
          icon: FileText,
          title: 'Devis 24-48h',
          desc: 'Sous 24 à 48h ouvrées.',
        },
        {
          n: '04',
          icon: Wrench,
          title: 'Réalisation + suivi',
          desc: 'Exécution et maintenance.',
        },
      ]
    : [
        {
          n: '01',
          icon: PhoneCall,
          title: 'Direct contact',
          desc: 'By phone, WhatsApp or form.',
        },
        {
          n: '02',
          icon: MagnifyingGlass,
          title: 'Site visit',
          desc: 'Accurate on-site diagnosis.',
        },
        {
          n: '03',
          icon: FileText,
          title: 'Quote in 24-48h',
          desc: 'Within 24-48 business hours.',
        },
        {
          n: '04',
          icon: Wrench,
          title: 'Delivery + follow-up',
          desc: 'Execution and maintenance.',
        },
      ];

  const faqs = fr
    ? [
        {
          q: "Quel est le délai d'obtention d'un devis ?",
          a: 'Proposition détaillée sous 24 à 48h ouvrées, après visite technique lorsque le projet le nécessite. Pour les urgences industrielles ou navales, mobilisation selon la disponibilité des équipes.',
        },
        {
          q: 'Intervenez-vous en dehors de Yaoundé et Douala ?',
          a: 'Oui, nous intervenons à Yaoundé, Douala et sur tout le territoire camerounais, y compris sur sites industriels isolés.',
        },
        {
          q: 'La visite technique est-elle obligatoire ?',
          a: "Pas systématiquement : elle dépend de la nature et de l'ampleur du projet. Pour le BTP, les forages, le solaire et les audits incendie, un diagnostic sur site est généralement nécessaire avant chiffrage.",
        },
      ]
    : [
        {
          q: 'What is the lead time for a quote?',
          a: 'Detailed proposal within 24-48 business hours, after a site visit when the project requires it. For industrial or naval emergencies, mobilization depends on team availability.',
        },
        {
          q: 'Do you operate outside Yaoundé and Douala?',
          a: 'Yes, we operate in Yaoundé, Douala and across Cameroon, including isolated industrial sites.',
        },
        {
          q: 'Is the site visit mandatory?',
          a: 'Not systematically: it depends on the nature and scale of the project. For construction, drilling, solar and fire audits, an on-site diagnosis is generally required before pricing.',
        },
      ];

  return (
    <main className="w-full bg-white">
      {/* 1. Hero épuré — H1 = marque exacte (SEO), une seule accroche,
          2 CTA. Pas de pavé descriptif ici : ça vit plus bas. */}
      <HomeHero
        slides={heroSlides}
        locale={locale}
        fr={fr}
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* 2. Bandeau preuves */}
      <section className="w-full bg-surface border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-8 sm:py-10">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 text-center">
            {proofs.map((p) => (
              <div
                key={p.label}
                className="flex flex-col space-y-1.5 px-4 sm:px-8 even:border-l even:border-slate-300 lg:border-l lg:border-slate-300 lg:first:border-l-0"
              >
                <dt className="order-2 text-base leading-relaxed text-muted">{p.label}</dt>
                <dd className="order-1 text-2xl sm:text-3xl font-semibold text-brand">
                  {p.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Services — rangée de cartes overlay : titre sur image,
          numéro 01–07, flèche circulaire, 8e case CTA (pas d'orpheline). */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-brand">
              {fr ? 'Nos expertises' : 'Our expertise'}
            </p>
            <h2 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-ink">
              {fr ? 'Sept pôles complémentaires' : 'Seven complementary areas'}
            </h2>
            <p className="mt-3 text-[16px] leading-[1.7] text-muted">
              {fr
                ? "De l'audit incendie à la réparation navale."
                : 'From fire audits to naval repair.'}
            </p>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {serviceCards.map((card, i) => (
            <Link
              key={card.slug}
              href={`/${locale}/services/${card.slug}`}
              className="group relative block aspect-square overflow-hidden rounded-xl border border-slate-200 bg-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
            >
              <Image
                src={card.image || FALLBACK_CARD_IMAGES[i % FALLBACK_CARD_IMAGES.length]}
                alt={card.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              />
              <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2.5">
                <h3 className="flex-1 text-[18px] leading-[1.25] font-semibold text-white">
                  {card.title}
                </h3>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand bg-brand text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-brand">
                  <ArrowRight size={16} weight="bold" aria-hidden />
                </span>
              </span>
            </Link>
          ))}
          {/* 8e case : CTA qui clôt la grille (plus de carte orpheline) */}
          <Link
            href={`/${locale}/services`}
            className="group relative flex aspect-square flex-col justify-between gap-6 overflow-hidden rounded-xl bg-brand p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl btn-sweep"
          >
            <div className="space-y-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-white/90">
                {fr ? "Vue d'ensemble" : 'Overview'}
              </p>
              <h3 className="text-[18px] leading-[1.3] font-semibold text-white">
                {fr ? 'Tous nos services' : 'All our services'}
              </h3>
              <p className="text-[14px] leading-relaxed text-white/85">
                {fr
                  ? 'Sept pôles complémentaires, une seule entreprise pour vos défis.'
                  : 'Seven complementary areas, one company for your challenges.'}
              </p>
            </div>
            <span className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-white">
                {fr ? 'Explorer' : 'Explore'}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={16} weight="bold" aria-hidden />
              </span>
            </span>
          </Link>
        </div>
      </section>

      {/* 4. Pourquoi BNPC */}
      <section className="w-full bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <h2 className="text-[28px] sm:text-[32px] font-semibold text-ink">
              {fr ? 'Pourquoi choisir BNPC ?' : 'Why choose BNPC?'}
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {strengths.map((s) => (
              <div
                key={s.title}
                className="rounded-lg border border-slate-200 p-6 space-y-3"
              >
                <s.icon size={28} weight="duotone" className="text-brand" aria-hidden />
                <h3 className="text-[18px] font-semibold text-ink">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Méthode — process centré inspiré maquette : pastille + badge numéro + pointillés */}
      <section className="w-full bg-surface">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <h2 className="text-[28px] sm:text-[32px] font-semibold text-ink">
              {fr ? 'Un parcours simple, sans surprise' : 'A simple process, no surprises'}
            </h2>
          </Reveal>
          <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className="relative flex flex-col items-center px-2 text-center"
              >
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[62%] top-8 hidden w-[76%] border-t border-dashed border-slate-300 lg:block"
                  />
                )}
                <div className="relative">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-md">
                    <step.icon size={26} weight="duotone" aria-hidden />
                  </span>
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-coal px-1 text-[11px] font-bold text-white ring-2 ring-surface">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-4 text-[17px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 max-w-[26ch] text-[15px] leading-relaxed text-muted">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Projets à la une — structure : eyebrow centré + H2 centré + 3 cartes (image, tags, titre, extrait, lire la suite) */}
      {featuredProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-brand">
                {fr ? 'Dernières études de cas' : 'Latest case studies'}
              </p>
              <h2 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-ink">
                {fr ? 'Projets à la une' : 'Featured projects'}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.7] text-muted">
                {fr
                  ? 'Un aperçu des solutions que nous déployons sur le terrain pour nos clients.'
                  : 'A glimpse of the solutions we deploy in the field for our clients.'}
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} locale={locale} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/projets`}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 hover:border-brand hover:text-brand transition-colors"
            >
              {fr ? 'Tous nos projets' : 'All our projects'}
            </Link>
          </div>
        </section>
      )}

      {/* 6b. Partenaires — structure : header centré + rangée de 6 logos en niveaux de gris */}
      {partners.length > 0 && (
      <section className="w-full border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-brand">
                {fr ? 'Rejoignez-nous' : 'Join us'}
              </p>
              <h2 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-ink">
                {fr ? 'Nos partenaires' : 'Our partners'}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.7] text-muted">
                {fr
                  ? 'Ils nous confient leurs sites, leurs chantiers et leurs équipements sur l’ensemble du territoire.'
                  : 'They trust us with their sites, projects and equipment across the country.'}
              </p>
            </div>
          </Reveal>
          {/* Marquee infini : piste doublée, une seule direction, pause au survol */}
          <div className="partners-marquee-viewport mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="animate-partners-marquee flex w-max">
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    aria-hidden={copy === 1}
                    className="flex gap-4 pr-4 sm:gap-6 sm:pr-6"
                  >
                    {partners.map((partner) => (
                      <div
                        key={`${copy}-${partner.id}`}
                        className="flex h-24 w-44 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 opacity-70 grayscale transition-all hover:border-brand hover:opacity-100 hover:grayscale-0 sm:w-52"
                      >
                        {partner.website ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={copy === 1 ? -1 : undefined}
                            className="flex h-full w-full items-center justify-center"
                            aria-label={partner.name}
                          >
                            {partner.logo ? (
                              <Image
                                src={partner.logo}
                                alt={partner.logoAlt || partner.name}
                                width={160}
                                height={64}
                                className="max-h-12 w-auto object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-center text-[15px] font-semibold tracking-wide text-neutral-500">
                                {partner.name}
                              </span>
                            )}
                          </a>
                        ) : partner.logo ? (
                          <Image
                            src={partner.logo}
                            alt={partner.logoAlt || partner.name}
                            width={160}
                            height={64}
                            className="max-h-12 w-auto object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-center text-[15px] font-semibold tracking-wide text-neutral-500">
                            {partner.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>
      )}

      {/* 7. Entreprise : bande 2/3 texte clair + 1/3 CTA équipe fond noir */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12 sm:py-16">
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-3">
            <div className="bg-surface p-8 sm:p-10 md:col-span-2">
              <h2 className="text-[24px] sm:text-[28px] font-semibold text-ink">
                {fr ? 'Une entreprise ancrée au Cameroun' : 'A company rooted in Cameroon'}
              </h2>
              <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted">
                {fr
                  ? 'Depuis 2023, une direction resserrée qui décide vite et des experts ancrés sur le terrain.'
                  : 'Since 2023, lean management that decides fast and experts rooted in the field.'}
              </p>
              <Link
                href={`/${locale}/qui-sommes-nous`}
                className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand hover:underline"
              >
                {fr ? 'Qui sommes-nous →' : 'About us →'}
              </Link>
            </div>
            <div className="flex flex-col items-start justify-center gap-4 bg-coal p-8 text-white sm:p-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60">
                {fr ? 'Notre équipe' : 'Our team'}
              </p>
              <p className="text-[16px] leading-relaxed text-slate-200">
                {fr
                  ? 'Direction resserrée, experts terrain à Yaoundé et Douala.'
                  : 'Lean management, field experts in Yaoundé and Douala.'}
              </p>
              <Link
                href={`/${locale}/qui-sommes-nous#equipe`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-coal transition-colors hover:bg-slate-200"
              >
                {fr ? "Découvrir l'équipe" : 'Meet the team'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Actualités — structure : header centré + 3 cartes */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-brand">
              {fr ? 'Analyses & tendances' : 'Insights & trends'}
            </p>
            <h2 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-ink">
              {fr ? 'Articles récents' : 'Recent articles'}
            </h2>
            <p className="mt-3 text-[16px] leading-[1.7] text-muted">
              {fr
                ? 'Suivez nos actualités, nos chantiers et nos retours d’expérience.'
                : 'Follow our news, sites and field feedback.'}
            </p>
          </div>
        </Reveal>

        {posts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">
              {fr ? 'Aucun article disponible.' : 'No articles available.'}
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/actualites`}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 hover:border-brand hover:text-brand transition-colors"
          >
            {fr ? 'Toutes les actualités' : 'All news'}
          </Link>
        </div>
      </section>

      {/* 9. FAQ courte */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-14 sm:pb-20">
        <Reveal>
          <h2 className="text-[24px] sm:text-[28px] font-semibold text-ink">
            {fr ? "Questions fréquentes" : 'Frequently asked questions'}
          </h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-lg border border-slate-200 p-6 space-y-2">
              <h3 className="text-[16px] font-semibold text-ink">{f.q}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CTA final */}
      <section className="bg-brand text-white py-12 px-6 sm:py-14 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center items-stretch justify-between gap-6 md:gap-8">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-[26px] font-semibold text-white leading-tight sm:text-[32px]">
              {fr
                ? 'Un projet urgent ou une étude spécifique ?'
                : 'An urgent project or a specific study?'}
            </h2>
            <p className="text-[16px] text-white leading-relaxed">
              {fr
                ? 'Ne laissez pas les contraintes techniques ralentir vos activités. Audits, BTP, forages, solaire, drones, naval : réponse sous 24-48h.'
                : 'Do not let technical constraints slow you down. Audits, construction, drilling, solar, drones, naval: reply within 24-48h.'}
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-block w-full text-center bg-white text-brand font-semibold text-[16px] px-8 py-3.5 rounded-full shrink-0 sm:w-auto btn-sweep-white"
          >
            {fr ? 'Demander un devis' : 'Request a quote'}
          </Link>
        </div>
      </section>
    </main>
  );
}
