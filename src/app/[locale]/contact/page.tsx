import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PhoneCall, EnvelopeSimple, MapPin, Clock } from '@phosphor-icons/react/dist/ssr';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { canonicalFor, languageAlternates, SITE_URL } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  const title = fr ? 'Contact' : 'Contact';
  const description = fr
    ? "Contact BNP Coorporation Sarl à Yaoundé : devis sous 24-48h, visites techniques BTP, forage, solaire, sécurité incendie. (+237) 6 55 01 09 19 — BP 4219 Yaoundé."
    : 'Contact BNP Coorporation Sarl in Yaoundé: quote within 24-48h, site visits for construction, drilling, solar, fire safety. (+237) 6 55 01 09 19.';
  return {
    title: `${title} — BNPC`,
    description,
    alternates: {
      canonical: canonicalFor(locale, '/contact'),
      languages: languageAlternates('/contact'),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
      description,
      type: 'website',
      url: canonicalFor(locale, '/contact'),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ContactPage');

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'BNP Coorporation Sarl',
    url: SITE_URL,
    email: 'contact@bnp-coorporation.com',
    telephone: '+237655010919',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'BP 4219',
      addressLocality: 'Yaoundé',
      addressCountry: 'CM',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '12:00',
      },
    ],
    areaServed: ['Yaoundé', 'Douala', 'Kribi', 'Cameroun'],
  };

  return (
    <main className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* Hero banner */}
      <PageHero
        title={t('heroTitle')}
        image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=70"
      />

      {/* Coordonnées */}
      <section className="max-w-[1100px] mx-auto px-6 pt-12 sm:pt-16 pb-12">
        <div className="flex flex-col divide-y divide-slate-200 text-center lg:flex-row lg:divide-x lg:divide-y-0">
          <div className="flex flex-1 flex-col items-center px-6 py-8 lg:py-0">
            <span className="text-brand">
              <PhoneCall size={28} weight="fill" aria-hidden />
            </span>
            <h2 className="mt-3 text-[18px] leading-[1.35] font-semibold text-ink">
              {t('phoneWhatsappTitle')}
            </h2>
            <p className="mt-2 text-[16px] text-muted">
              <a href="tel:+237655010919" className="hover:text-brand">{t('phone1')}</a>
            </p>
            <p className="mt-1 text-[16px] text-muted">
              <a href="tel:+237658051478" className="hover:text-brand">{t('phone2')}</a>
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center px-6 py-8 lg:py-0">
            <span className="text-brand">
              <EnvelopeSimple size={28} weight="fill" aria-hidden />
            </span>
            <h2 className="mt-3 text-[18px] leading-[1.35] font-semibold text-ink">
              {t('emailTitle')}
            </h2>
            <p className="mt-2 text-[16px] text-muted break-all">
              <a href="mailto:contact@bnp-coorporation.com" className="hover:text-brand">{t('emailValue')}</a>
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center px-6 py-8 lg:py-0">
            <span className="text-brand">
              <MapPin size={28} weight="fill" aria-hidden />
            </span>
            <h2 className="mt-3 text-[18px] leading-[1.35] font-semibold text-ink">
              {t('addressTitle')}
            </h2>
            <p className="mt-2 text-[16px] text-muted">{t('addressValue')}</p>
          </div>
          <div className="flex flex-1 flex-col items-center px-6 py-8 lg:py-0">
            <span className="text-brand">
              <Clock size={28} weight="fill" aria-hidden />
            </span>
            <h2 className="mt-3 text-[18px] leading-[1.35] font-semibold text-ink">
              {t('hoursTitle')}
            </h2>
            <p className="mt-2 text-[16px] text-muted">{t('hoursWeek')}</p>
            <p className="mt-1 text-[16px] text-muted">{t('hoursSat')}</p>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="w-full bg-surface py-12 sm:py-14">
        <ContactForm />
      </section>

      {/* FAQ — <details> natif = crawlable sans JS, idéal SEO/GEO */}
      <section className="max-w-[860px] mx-auto px-6 py-12 sm:py-16">
        <h2 className="text-[24px] sm:text-[28px] leading-[1.25] font-semibold text-ink">
          {t('faqTitle')}
        </h2>
        <div className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {faqs.map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-neutral-50 group-open:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink sm:px-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px] sm:text-[18px] leading-[1.4] font-semibold text-ink">
                  {faq.q}
                </h3>
                <span
                  aria-hidden
                  className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-muted transition-colors group-open:border-ink group-open:bg-ink group-open:text-white"
                >
                  <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                  <span className="absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="px-5 pb-6 pr-12 text-[16px] leading-[1.75] text-muted sm:px-6 sm:pr-16">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
