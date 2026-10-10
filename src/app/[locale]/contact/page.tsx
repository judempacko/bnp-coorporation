import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroIntro } from '@/components/animations/HeroIntro';
import { ParallaxBg } from '@/components/animations/ParallaxBg';
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
      <section className="relative w-full h-[200px] sm:h-[240px] flex items-center justify-center overflow-hidden bg-[#232323]">
        <ParallaxBg
          image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=70"
          className="bg-cover bg-center grayscale"
          amplitude={8}
        />
        <div className="absolute inset-0 bg-black/60" />
        <HeroIntro className="relative z-10">
          <h1 className="text-white text-[28px] sm:text-[40px] leading-[1.2] font-semibold tracking-tight">
            {t('heroTitle')}
          </h1>
        </HeroIntro>
      </section>

      {/* Coordonnées */}
      <section className="max-w-[1100px] mx-auto px-6 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[#0A66C2]">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.4 11.4 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.57 1 1 0 01-.25 1.02l-2.2 2.2z" />
              </svg>
            </span>
            <h2 className="mt-3 text-[18px] leading-[1.35] font-semibold text-[#2c2c2c]">
              {t('phoneWhatsappTitle')}
            </h2>
            <p className="mt-2 text-[16px] text-[#666]">
              <a href="tel:+237655010919" className="hover:text-[#0A66C2]">{t('phone1')}</a>
            </p>
            <p className="mt-1 text-[16px] text-[#666]">
              <a href="tel:+237658051478" className="hover:text-[#0A66C2]">{t('phone2')}</a>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#0A66C2]">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </span>
            <h2 className="mt-3 text-[18px] leading-[1.35] font-semibold text-[#2c2c2c]">
              {t('emailTitle')}
            </h2>
            <p className="mt-2 text-[16px] text-[#666] break-all">
              <a href="mailto:contact@bnp-coorporation.com" className="hover:text-[#0A66C2]">{t('emailValue')}</a>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#0A66C2]">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a1 1 0 00-1.39 1.24l1.85 6.82a1 1 0 00.72.72l6.82 1.85a.5.5 0 010 .94l-6.82 1.85a1 1 0 00-.72.72l-1.85 6.82a1 1 0 001.39 1.24z" />
              </svg>
            </span>
            <h2 className="mt-3 text-[18px] leading-[1.35] font-semibold text-[#2c2c2c]">
              {t('addressTitle')}
            </h2>
            <p className="mt-2 text-[16px] text-[#666]">{t('addressValue')}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#0A66C2]">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-9 13H7v-2h3v2zm2-4H7v-2h5v2zm5 4h-3v-2h3v2zm0-4H7v-2h10v2z" />
              </svg>
            </span>
            <h2 className="mt-3 text-[18px] leading-[1.35] font-semibold text-[#2c2c2c]">
              {t('hoursTitle')}
            </h2>
            <p className="mt-2 text-[16px] text-[#666]">{t('hoursWeek')}</p>
            <p className="mt-1 text-[16px] text-[#666]">{t('hoursSat')}</p>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="w-full bg-[#f1f2f4] py-12 sm:py-14">
        <ContactForm />
      </section>

      {/* FAQ — <details> natif = crawlable sans JS, idéal SEO/GEO */}
      <section className="max-w-[1100px] mx-auto px-6 py-12 sm:py-16">
        <h2 className="text-center text-[24px] sm:text-[28px] leading-[1.25] font-semibold text-[#2c2c2c] max-w-[640px] mx-auto">
          {t('faqTitle')}
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              open={i === 0}
              className="group border border-slate-200 bg-white open:border-[#0A66C2] transition-colors"
            >
              <summary className="flex items-center gap-4 cursor-pointer p-5 text-left text-[18px] leading-[1.35] font-semibold text-[#2c2c2c] hover:text-[#0A66C2]">
                <span className="w-8 h-8 shrink-0 border border-[#0A66C2] text-[#0A66C2] flex items-center justify-center text-lg leading-none group-open:rotate-180 transition-transform">
                  ⌃
                </span>
                {faq.q}
              </summary>
              <p className="px-5 pb-5 pl-[68px] text-[16px] leading-[1.7] text-[#666]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
