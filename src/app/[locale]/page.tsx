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
        },
        {
          n: '02',
          title: 'Visite technique',
        },
        {
          n: '03',
          title: 'Devis 24-48h',
        },
        {
          n: '04',
          title: 'Réalisation + suivi',
        },
      ]
    : [
        {
          n: '01',
          title: 'Direct contact',
        },
        {
          n: '02',
          title: 'Site visit',
        },
        {
          n: '03',
          title: 'Quote in 24-48h',
        },
        {
          n: '04',
          title: 'Delivery + follow-up',
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
      <section className="w-full bg-[#f1f2f4] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-8 sm:py-10">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {proofs.map((p) => (
                <dt className="order-2 text-sm text-[#51565d]">{p.label}</dt>
                <dd className="order-1 text-2xl sm:text-3xl font-semibold text-[#0A66C2]">
                  {p.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

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
            </p>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Link
              key={card.slug}
              href={`/${locale}/services/${card.slug}`}
            >
                  {card.title}
                </h3>
                </span>
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
            {steps.map((step) => (
            ))}
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
                  >
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

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-12 sm:py-16">
              <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#2c2c2c]">
                {fr ? 'Une entreprise ancrée au Cameroun' : 'A company rooted in Cameroon'}
              </h2>
                {fr
                  ? 'Depuis 2023, une direction resserrée qui décide vite et des experts ancrés sur le terrain.'
                  : 'Since 2023, lean management that decides fast and experts rooted in the field.'}
              </p>
              <Link
                href={`/${locale}/qui-sommes-nous`}
              >
              </Link>
              <Link
              >
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
            className="inline-block w-full text-center bg-white text-[#0A66C2] font-semibold text-[16px] px-8 py-3.5 rounded-full shrink-0 sm:w-auto btn-sweep-white"
          >
            {fr ? 'Demander un devis' : 'Request a quote'}
          </Link>
        </div>
      </section>
    </main>
  );
}
