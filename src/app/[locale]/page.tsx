import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  ClipboardText,
  Timer,
  MapPin,
  Phone,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr';
import { getAllPosts, getAllServices } from '@/lib/api';
import { getProjects } from '@/lib/projects';
import { getPartners } from '@/lib/partners';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { PostCard } from '@/components/PostCard';
import { HeroIntro } from '@/components/animations/HeroIntro';
import { Reveal } from '@/components/animations/Reveal';
import { canonicalFor, languageAlternates } from '@/lib/seo';
import { fallbackServicesNav } from './services/[slug]/page';

const FALLBACK_CARD_IMAGE =
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=800';

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
    ? "BNP Coorporation Sarl (BNPC) à Yaoundé : sécurité incendie (SSIAP, audits ERP), BTP, forage d'eau, solaire, drones, naval. Devis sous 24-48h, intervention Yaoundé-Douala-Kribi."
    : 'BNP Coorporation Sarl (BNPC) in Yaoundé: fire safety (SSIAP, ERP audits), construction, water drilling, solar, drones, naval repair. Quote within 24-48h across Cameroon.';
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

  const proofs = fr
    ? [
        { value: '2023', label: 'Fondée à Yaoundé' },
        { value: '7', label: "Pôles d'expertise" },
        { value: '3', label: 'Bases : Yaoundé, Douala, Kribi' },
        { value: '24-48h', label: 'Devis après visite technique' },
      ]
    : [
        { value: '2023', label: 'Founded in Yaoundé' },
        { value: '7', label: 'Areas of expertise' },
        { value: '3', label: 'Bases: Yaoundé, Douala, Kribi' },
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
          title: 'Visite technique systématique',
          desc: 'BTP, forages, solaire, audits incendie : diagnostic sur site avant tout chiffrage.',
        },
        {
          icon: Timer,
          title: 'Devis validé en 24-48h',
          desc: 'Analyse par nos experts, validation par la direction sous 24 à 48h ouvrées.',
        },
        {
          icon: MapPin,
          title: 'Couverture nationale',
          desc: 'Yaoundé, Douala, Kribi + tout le Cameroun, y compris urgences industrielles et navales.',
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
          title: 'Systematic site visit',
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
          desc: 'Yaoundé, Douala, Kribi + all of Cameroon, including industrial and naval emergencies.',
        },
      ];

  const steps = fr
    ? [
        {
          n: '01',
          title: 'Contact direct',
          desc: 'Téléphone, WhatsApp ou formulaire : un expert qualifie votre besoin.',
        },
        {
          n: '02',
          title: 'Visite technique',
          desc: 'Déplacement sur site pour diagnostic précis (BTP, forage, solaire, incendie).',
        },
        {
          n: '03',
          title: 'Devis 24-48h',
          desc: 'Proposition détaillée validée par la direction sous 24 à 48h ouvrées.',
        },
        {
          n: '04',
          title: 'Réalisation + suivi',
          desc: 'Exécution par nos équipes, contrôle qualité et maintenance.',
        },
      ]
    : [
        {
          n: '01',
          title: 'Direct contact',
          desc: 'Phone, WhatsApp or form: an expert qualifies your need.',
        },
        {
          n: '02',
          title: 'Site visit',
          desc: 'On-site trip for accurate diagnosis (construction, drilling, solar, fire).',
        },
        {
          n: '03',
          title: 'Quote in 24-48h',
          desc: 'Detailed proposal validated by management within 24-48 business hours.',
        },
        {
          n: '04',
          title: 'Delivery + follow-up',
          desc: 'Execution by our teams, quality control and maintenance.',
        },
      ];

  const zones = fr
    ? [
        {
          city: 'Yaoundé',
          desc: 'Siège — BP 4219. BTP, sécurité incendie, solaire, forages, drones.',
        },
        {
          city: 'Douala',
          desc: 'Capitale économique. Industries, audits ERP, installations techniques.',
        },
        {
          city: 'Kribi',
          desc: 'Zone portuaire. Réparation navale, exercices incendie, chantiers.',
        },
      ]
    : [
        {
          city: 'Yaoundé',
          desc: 'Head office — P.O. Box 4219. Construction, fire safety, solar, drilling, drones.',
        },
        {
          city: 'Douala',
          desc: 'Economic capital. Industries, ERP audits, technical installations.',
        },
        {
          city: 'Kribi',
          desc: 'Port area. Naval repair, fire drills, construction sites.',
        },
      ];

  const faqs = fr
    ? [
        {
          q: "Quel est le délai d'obtention d'un devis ?",
          a: 'Proposition détaillée sous 24 à 48h ouvrées après visite technique. Mobilisation immédiate pour les urgences industrielles ou navales.',
        },
        {
          q: 'Intervenez-vous en dehors de Yaoundé et Douala ?',
          a: 'Oui : Kribi, Garoua, Bamenda, Bafoussam, zones agricoles et sites industriels isolés sur tout le territoire.',
        },
        {
          q: 'La visite technique est-elle obligatoire ?',
          a: 'Oui pour BTP, forages, solaire et audits incendie : nos techniciens diagnostiquent sur site avant validation du devis.',
        },
      ]
    : [
        {
          q: 'What is the lead time for a quote?',
          a: 'Detailed proposal within 24-48 business hours after site visit. Immediate mobilization for industrial or naval emergencies.',
        },
        {
          q: 'Do you operate outside Yaoundé and Douala?',
          a: 'Yes: Kribi, Garoua, Bamenda, Bafoussam, agricultural areas and isolated industrial sites nationwide.',
        },
        {
          q: 'Is the site visit mandatory?',
          a: 'Yes for construction, drilling, solar and fire audits: our technicians diagnose on site before quote validation.',
        },
      ];

  return (
    <main className="w-full bg-white">
      {/* 1. Hero — H1 = marque exacte, non négociable pour le SEO de marque */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12 sm:py-16 text-center">
        <HeroIntro>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 text-xl font-medium text-blue-700 dark:text-blue-300">
            {t('subtitle')}
          </p>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('description')}
          </p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {t('disambiguation')}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full bg-[#0A66C2] px-6 py-3 text-base font-semibold text-white hover:bg-[#0854a0] transition-colors"
            >
              {fr ? 'Demander un devis 24-48h' : 'Request a quote in 24-48h'}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
            >
              {fr ? 'Nos services' : 'Our services'}
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <a
              href="tel:+237655010919"
              className="inline-flex items-center gap-1.5 hover:text-[#0A66C2] transition-colors"
            >
              <Phone size={16} weight="fill" aria-hidden />
              (+237) 6 55 01 09 19
            </a>
            <span aria-hidden className="text-slate-300">
              •
            </span>
            <span>{fr ? 'Lun-Ven : 8h-16h / Sam : 8h-12h' : 'Mon-Fri: 8am-4pm / Sat: 8am-12pm'}</span>
          </div>
        </HeroIntro>
      </section>

      {/* 2. Bandeau preuves */}
      <section className="w-full bg-[#f1f2f4] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-8 sm:py-10">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {proofs.map((p) => (
              <div key={p.label} className="space-y-1">
                <dt className="order-2 text-sm text-[#51565d]">{p.label}</dt>
                <dd className="order-1 text-2xl sm:text-3xl font-semibold text-[#0A66C2]">
                  {p.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Services */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#0A66C2]">
              {fr ? 'Nos expertises' : 'Our expertise'}
            </p>
            <h2 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[#2c2c2c]">
              {fr ? 'Sept pôles complémentaires' : 'Seven complementary areas'}
            </h2>
            <p className="mt-3 text-[16px] leading-[1.7] text-[#51565d]">
              {fr
                ? "De l'audit incendie à la réparation navale : une seule entreprise pour vos défis industriels, techniques et opérationnels."
                : 'From fire audits to naval repair: one company for your industrial, technical and operational challenges.'}
            </p>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {serviceCards.map((card) => (
            <Link
              key={card.slug}
              href={`/${locale}/services/${card.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-[#0A66C2] transition-colors"
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
              <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-2.5">
                <h3 className="text-[20px] sm:text-[22px] leading-[1.3] font-semibold text-[#2c2c2c] group-hover:text-[#0A66C2] transition-colors">
                  {card.title}
                </h3>
                {card.excerpt && (
                  <p className="text-[16px] leading-[1.7] text-[#51565d] line-clamp-3">
                    {card.excerpt}
                  </p>
                )}
                <span className="mt-auto pt-2 inline-flex items-center gap-2 text-[16px] font-semibold text-[#0A66C2]">
                  {fr ? 'Découvrir' : 'Discover'}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Pourquoi BNPC */}
      <section className="w-full bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#2c2c2c]">
              {fr ? 'Pourquoi choisir BNPC ?' : 'Why choose BNPC?'}
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {strengths.map((s) => (
              <div
                key={s.title}
                className="rounded-lg border border-slate-200 p-6 space-y-3"
              >
                <s.icon size={28} weight="duotone" className="text-[#0A66C2]" aria-hidden />
                <h3 className="text-[18px] font-semibold text-[#2c2c2c]">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-[#51565d]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Méthode */}
      <section className="w-full bg-[#f1f2f4]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#2c2c2c]">
              {fr ? 'Un parcours simple, sans surprise' : 'A simple process, no surprises'}
            </h2>
          </Reveal>
          <ol className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <li key={step.n} className="rounded-lg bg-white border border-slate-200 p-6 space-y-2">
                <span className="text-sm font-bold text-[#0A66C2] tracking-widest">
                  {step.n}
                </span>
                <h3 className="text-[18px] font-semibold text-[#2c2c2c]">{step.title}</h3>
                <p className="text-[15px] leading-relaxed text-[#51565d]">{step.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-base font-semibold text-white hover:bg-[#0854a0] transition-colors"
            >
              {fr ? 'Lancer mon diagnostic' : 'Start my assessment'}
              <ArrowRight size={18} weight="bold" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Projets à la une — structure : eyebrow centré + H2 centré + 3 cartes (image, tags, titre, extrait, lire la suite) */}
      {featuredProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#0A66C2]">
                {fr ? 'Dernières études de cas' : 'Latest case studies'}
              </p>
              <h2 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[#2c2c2c]">
                {fr ? 'Projets à la une' : 'Featured projects'}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#51565d]">
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
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
            >
              {fr ? 'Tous nos projets' : 'All our projects'}
            </Link>
          </div>
        </section>
      )}

      {/* 6b. Partenaires — structure : header centré + rangée de 6 logos en niveaux de gris */}
      <section className="w-full border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#0A66C2]">
                {fr ? 'Rejoignez-nous' : 'Join us'}
              </p>
              <h2 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[#2c2c2c]">
                {fr ? 'Nos partenaires' : 'Our partners'}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.7] text-[#51565d]">
                {fr
                  ? 'Ils nous confient leurs sites, leurs chantiers et leurs équipements sur l’ensemble du territoire.'
                  : 'They trust us with their sites, projects and equipment across the country.'}
              </p>
            </div>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {partners.map((partner) => (
              <li
                key={partner.id}
                className="flex h-24 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:border-[#0A66C2] transition-all"
              >
                {partner.website ? (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
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
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Zones d'intervention */}
      <section className="w-full border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <Reveal>
            <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#2c2c2c]">
              {fr ? "Où intervenons-nous ?" : 'Where do we operate?'}
            </h2>
            <p className="mt-3 text-[16px] text-[#51565d] max-w-3xl">
              {fr
                ? 'Trois bases opérationnelles et une couverture nationale, y compris sites industriels isolés et zones agricoles.'
                : 'Three operational bases and nationwide coverage, including isolated industrial sites and agricultural areas.'}
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {zones.map((z) => (
              <div key={z.city} className="rounded-lg border border-slate-200 p-6 space-y-2">
                <p className="inline-flex items-center gap-2 text-[18px] font-semibold text-[#2c2c2c]">
                  <MapPin size={20} weight="fill" className="text-[#0A66C2]" aria-hidden />
                  {z.city}
                </p>
                <p className="text-[15px] leading-relaxed text-[#51565d]">{z.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Entreprise : teaser + indicateur discret vers l'équipe (pas de section team dédiée) */}
      <section className="w-full bg-[#f1f2f4]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#2c2c2c]">
                {fr ? 'Une entreprise ancrée au Cameroun' : 'A company rooted in Cameroon'}
              </h2>
              <p className="text-[16px] leading-relaxed text-[#51565d]">
                {fr
                  ? 'Depuis 2023, une direction resserrée qui décide vite et des experts ancrés sur le terrain.'
                  : 'Since 2023, lean management that decides fast and experts rooted in the field.'}
              </p>
              <Link
                href={`/${locale}/qui-sommes-nous/notre-equipe`}
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#0A66C2] hover:underline"
              >
                {fr ? "Découvrez notre équipe →" : 'Meet our team →'}
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/qui-sommes-nous`}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
              >
                {fr ? 'Qui sommes-nous' : 'About us'}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-[#0A66C2] px-6 py-3 text-base font-semibold text-white hover:bg-[#0854a0] transition-colors"
              >
                {fr ? 'Nous contacter' : 'Contact us'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Actualités — structure : header centré + 3 cartes */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#0A66C2]">
              {fr ? 'Analyses & tendances' : 'Insights & trends'}
            </p>
            <h2 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[#2c2c2c]">
              {fr ? 'Articles récents' : 'Recent articles'}
            </h2>
            <p className="mt-3 text-[16px] leading-[1.7] text-[#51565d]">
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
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
          >
            {fr ? 'Toutes les actualités' : 'All news'}
          </Link>
        </div>
      </section>

      {/* 10. FAQ courte */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-14 sm:pb-20">
        <Reveal>
          <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#2c2c2c]">
            {fr ? "Questions fréquentes" : 'Frequently asked questions'}
          </h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-lg border border-slate-200 p-6 space-y-2">
              <h3 className="text-[16px] font-semibold text-[#2c2c2c]">{f.q}</h3>
              <p className="text-[15px] leading-relaxed text-[#51565d]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. CTA final */}
      <section className="bg-[#0A66C2] text-white py-12 px-6 sm:py-14 sm:px-12 lg:px-16">
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
            className="inline-block w-full text-center bg-white text-[#0A66C2] hover:bg-neutral-100 font-semibold text-[16px] px-8 py-3.5 rounded-full transition-colors shrink-0 sm:w-auto"
          >
            {fr ? 'Demander un devis' : 'Request a quote'}
          </Link>
        </div>
      </section>
    </main>
  );
}
