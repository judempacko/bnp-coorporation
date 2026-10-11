import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllServices, getServiceBySlug, type ServiceNode } from '@/lib/api';
import { ServiceHero } from '@/components/services/ServiceHero';
import { ScrubLead } from '@/components/services/ScrubLead';
import { FeatureRow } from '@/components/services/FeatureRow';
import { SITE_URL, canonicalFor, languageAlternates } from '@/lib/seo';

interface DisplayFeature {
  title: string;
  items: string[];
  image?: string | null;
  imageAlt?: string;
}

interface DisplayService {
  title: string;
  subtitle: string;
  lead: string;
  heroImage?: string | null;
  heroImageAlt?: string;
  features: DisplayFeature[];
  /** Texte unique des cibles */
  targets: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600';
const FALLBACK_FEATURE_IMAGES = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
];

/**
 * Contenu de secours affiché quand WordPress est injoignable.
 * Le contenu de référence vit dans WordPress (CPT `service`).
 */
const fallbackServicesDataMap: Record<string, DisplayService> = {
  'securite-incendie': {
    title: 'Sécurité incendie',
    subtitle: 'La protection des biens et de votre environnement',
    lead: "La protection des personnes et des biens contre les risques d'incendie est une obligation légale et morale. BNP Coorporation Sarl offre une expertise globale allant de l'audit de sécurité des Établissements Recevant du Public (ERP) aux certifications professionnelles reconnues.",
    features: [
      {
        title: 'Audits et ingénierie',
        items: [
          'Évaluation des risques incendie.',
          "Conception de plans d'évacuation.",
          'Mise aux normes.',
        ],
      },
      {
        title: 'Équipements de protection',
        items: [
          'Vente,',
          "Installation et maintenance d'extincteurs, RIA, et systèmes de désenfumage.",
        ],
      },
      {
        title: 'Formations certifiantes',
        items: [
          'Formations professionnelles spécialisées (SSIAP 1, SSIAP 2, SSIAP 3).',
          "Simulations d'évacuation grandeur nature.",
        ],
      },
      {
        title: 'SST & Secourisme du travail',
        items: [
          'Formation des secouristes du travail (SST).',
          'Exercices et équipements de première intervention (EPI).',
        ],
      },
    ],
    targets:
      'BNP Coorporation Sarl est le partenaire de référence des Établissements Recevant du Public (ERP), banques, centres commerciaux, usines, immeubles de bureaux et institutions scolaires soumis aux contrôles réglementaires de sécurité incendie au Cameroun. Nous accompagnons les directeurs de sites, responsables HSE et gestionnaires d\u2019immeubles pour mettre leurs infrastructures en conformité totale avec la loi, protéger leurs collaborateurs par des formations agréées (SSIAP, SST) et doter leurs installations de systèmes de détection et d\u2019extinction automatique de pointe à forte fiabilité.',
    ctaTitle: 'Vos locaux et vos équipes sont-ils aux normes de sécurité incendie ?',
    ctaText:
      "Protégez vos collaborateurs et évitez les sanctions réglementaires. Audits ERP, installation d'équipements et formations certifiantes SSIAP à Yaoundé et Douala.",
    ctaButton: 'Contactez-nous',
  },
  'construction-btp': {
    title: 'Construction (BTP)',
    subtitle: 'Bâtiment et travaux publics de haute précision',
    lead: "BNP Coorporation Sarl réalise vos projets de construction et d'infrastructure avec rigueur, respect des délais et des normes de sécurité internationales.",
    features: [
      {
        title: 'Génie civil & Bâtiments',
        items: ["Construction d'immeubles et bureaux.", 'Ouvrages d\u2019art et structures béton.'],
      },
      {
        title: 'Rénovation & Aménagement',
        items: ['Réhabilitation lourde.', 'Second œuvre et finitions.'],
      },
    ],
    targets:
      'Entreprises privées, collectivités locales et promoteurs immobiliers. Nous assurons la maîtrise d\u2019œuvre complète de la conception à la livraison.',
    ctaTitle: 'Un projet de construction ou de rénovation à concrétiser ?',
    ctaText: 'Consultez nos ingénieurs BTP pour une étude technique détaillée de votre projet.',
    ctaButton: 'Contactez-nous',
  },
};

export const fallbackServicesNav = [
  { slug: 'securite-incendie', fr: 'Sécurité incendie', en: 'Fire Safety' },
  { slug: 'construction-btp', fr: 'Construction (BTP)', en: 'Construction' },
  { slug: 'forage-et-eau', fr: 'Forage et eau', en: 'Drilling & Water' },
  { slug: 'energies-renouvelables', fr: 'Énergies renouvelables', en: 'Renewable Energy' },
  { slug: 'drones-imagerie-aerienne', fr: 'Drones (imagerie aérienne)', en: 'Drones (Aerial Imaging)' },
  { slug: 'reparation-navale', fr: 'Réparation navale', en: 'Naval Repair' },
  { slug: 'nettoyage-industriel', fr: 'Nettoyage industriel', en: 'Industrial Cleaning' },
];

function genericCta(locale: string): { ctaTitle: string; ctaText: string; ctaButton: string } {
  if (locale === 'en') {
    return {
      ctaTitle: 'Need specialized technical support?',
      ctaText:
        'Our expert teams are available to analyze your needs and offer tailor-made solutions.',
      ctaButton: 'Contact us',
    };
  }
  return {
    ctaTitle: "Besoin d'un accompagnement technique spécialisé ?",
    ctaText:
      "Nos équipes d'experts sont à votre disposition pour analyser vos besoins et vous proposer des solutions sur-mesure.",
    ctaButton: 'Contactez-nous',
  };
}

function toDisplay(service: ServiceNode, locale: string): DisplayService {
  const generic = genericCta(locale);
  return {
    title: service.title,
    subtitle: service.subtitle,
    lead: service.lead,
    heroImage: service.heroImage,
    heroImageAlt: service.heroImageAlt,
    features: service.features,
    targets: service.targets,
    ctaTitle: service.ctaTitle || generic.ctaTitle,
    ctaText: service.ctaText || generic.ctaText,
    ctaButton: service.ctaButton || generic.ctaButton,
  };
}

export async function generateStaticParams() {
  let slugs: string[] = [];
  try {
    const services = await getAllServices('fr');
    slugs = services.map((s) => s.slug);
  } catch {
    slugs = [];
  }
  const all = Array.from(new Set([...slugs, ...Object.keys(fallbackServicesDataMap)]));
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const fr = locale !== 'en';
  const wpService = await getServiceBySlug(slug, locale).catch(() => null);
  const fallback = fallbackServicesDataMap[slug];
  const title = wpService?.title || fallback?.title || slug;
  const rawDesc =
    wpService?.lead || wpService?.subtitle || fallback?.lead || '';
  const description =
    rawDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 155) ||
    (fr
      ? `${title} au Cameroun par BNP Coorporation Sarl : audit, réalisation et maintenance à Yaoundé, Douala, Kribi. Devis sous 24-48h.`
      : `${title} in Cameroon by BNP Coorporation Sarl: audit, delivery and maintenance in Yaoundé, Douala, Kribi. Quote within 24-48h.`);
  const image = wpService?.heroImage || FALLBACK_HERO;
  const path = `/services/${slug}`;
  return {
    title: `${title} au Cameroun — BNPC`,
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
      description,
      type: 'article',
      url: canonicalFor(locale, path),
      images: [{ url: image, alt: wpService?.heroImageAlt || title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const fr = locale !== 'en';

  const [wpService, wpServices] = await Promise.all([
    getServiceBySlug(slug, locale),
    getAllServices(locale),
  ]);

  const fallback = fallbackServicesDataMap[slug];
  if (!wpService && !fallback) {
    notFound();
  }
  const data: DisplayService = wpService
    ? toDisplay(wpService, locale)
    : fallback!;

  const others =
    wpServices.length > 0
      ? wpServices
          .filter((s) => s.slug !== slug)
          .slice(0, 3)
          .map((s, i) => ({
            slug: s.slug,
            title: s.title,
            image:
              s.heroImage ||
              FALLBACK_FEATURE_IMAGES[i % FALLBACK_FEATURE_IMAGES.length],
            imageAlt: s.heroImageAlt || s.title,
          }))
      : fallbackServicesNav
          .filter((s) => s.slug !== slug)
          .slice(0, 3)
          .map((s, i) => ({
            slug: s.slug,
            title: fr ? s.fr : s.en,
            image: FALLBACK_FEATURE_IMAGES[i % FALLBACK_FEATURE_IMAGES.length],
            imageAlt: fr ? s.fr : s.en,
          }));

  const labels = {
    allServices: fr ? 'Tous nos services' : 'All our services',
    targetsTitle: fr ? 'Nos cibles' : 'Who we serve',
    othersTitle: fr ? 'Découvrez nos autres expertises' : 'Explore our other areas of expertise',
    discover: fr ? 'Découvrir' : 'Discover',
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.title,
    description: data.lead || data.subtitle,
    provider: {
      '@type': 'Organization',
      name: 'BNP Coorporation Sarl',
      url: SITE_URL,
    },
    areaServed: ['Yaoundé', 'Douala', 'Kribi', 'Cameroun'],
    url: canonicalFor(locale, `/services/${slug}`),
    ...(data.heroImage ? { image: data.heroImage } : {}),
  };

  return (
    <div className="w-full bg-white text-[#2c2c2c]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* 1. Hero cinématique */}
      <ServiceHero
        title={data.title}
        subtitle={data.subtitle}
        image={data.heroImage || FALLBACK_HERO}
        backLabel={labels.allServices}
        backHref={`/${locale}/services`}
      />

      {/* 2. Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-14 sm:py-20">
        <div className="max-w-[960px] mx-auto space-y-14 sm:space-y-16">

          {/* Lead en reveal scrub mot-à-mot */}
          {data.lead && <ScrubLead text={data.lead} />}

          {/* Activities : lignes éditoriales alternées avec clip-reveal */}
          {data.features.length > 0 && (
            <div className="space-y-12 sm:space-y-16">
              {data.features.map((feature, idx) => (
                <FeatureRow
                  key={idx}
                  index={idx}
                  title={feature.title}
                  items={feature.items}
                  image={
                    feature.image ||
                    FALLBACK_FEATURE_IMAGES[idx % FALLBACK_FEATURE_IMAGES.length]
                  }
                  imageAlt={feature.imageAlt || feature.title}
                  imageFirst={idx % 2 === 0}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 3. Other Services */}
      {others.length > 0 && (
        <section className="bg-neutral-100 border-t border-slate-200 py-12 sm:py-14">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
            <h2 className="text-[24px] font-semibold leading-snug text-[#2c2c2c] mb-6 sm:text-[28px] sm:mb-8">
              {labels.othersTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {others.map((card) => (
                <Link
                  key={card.slug}
                  href={`/${locale}/services/${card.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-[#0A66C2] transition-colors"
                >
                  <div className="relative w-full h-44 bg-neutral-200 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <span className="text-[18px] font-semibold text-[#2c2c2c] group-hover:text-[#0A66C2] transition-colors sm:text-[20px]">
                      {card.title}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-[#0A66C2] shrink-0">
                      {labels.discover}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Cibles : bandeau pleine largeur gris doux, collé au CTA */}
      {data.targets && (
        <section className="w-full bg-[#f1f2f4]">
          <div className="max-w-[960px] mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16">
            <h2 className="text-[22px] font-semibold text-[#2c2c2c] sm:text-[24px]">
              {labels.targetsTitle}
            </h2>
            <p className="mt-3 text-[16px] text-[#2c2c2c] leading-relaxed">
              {data.targets}
            </p>
          </div>
        </section>
      )}

      {/* 5. Bottom CTA Banner */}
      <section className="bg-[#0A66C2] text-white py-12 px-6 sm:py-14 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center items-stretch justify-between gap-6 md:gap-8">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-[26px] font-semibold text-white leading-tight sm:text-[32px]">
              {data.ctaTitle}
            </h2>
            <p className="text-[16px] text-white leading-relaxed">
              {data.ctaText}
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-block w-full text-center bg-white text-[#0A66C2] hover:bg-neutral-100 font-semibold text-[16px] px-8 py-3.5 rounded-full transition-colors shadow-none shrink-0 sm:w-auto"
            style={{ boxShadow: 'none' }}
          >
            {data.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
