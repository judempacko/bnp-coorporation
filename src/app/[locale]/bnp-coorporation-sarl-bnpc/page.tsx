import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import {
  SITE_URL,
  canonicalFor,
  languageAlternates,
} from '@/lib/seo';

const PATH = '/bnp-coorporation-sarl-bnpc';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  // Title bourré de variantes exactes : c'est la page qui doit sortir sur
  // "bnp coorporation", "bnp coorporation sarl", "bnpc", "bnpc cameroun".
  const title = fr
    ? 'BNP Coorporation Sarl (BNPC) — bnp coorporation, bnpc Cameroun, Yaoundé'
    : 'BNP Coorporation Sarl (BNPC) — bnp coorporation, bnpc Cameroon, Yaoundé';
  const description = fr
    ? "BNP Coorporation Sarl (BNPC) : entreprise camerounaise à Yaoundé — bnp coorporation, bnp coorporation sarl, bnpc. Sécurité incendie, BTP, forage, solaire, drones, naval. Sans lien avec BNP Paribas."
    : 'BNP Coorporation Sarl (BNPC): Cameroonian company in Yaoundé — bnp coorporation, bnp coorporation sarl, bnpc. Fire safety, construction, drilling, solar, drones, naval. Not affiliated with BNP Paribas.';
  return {
    title: { absolute: `${title} — BNP Coorporation Sarl` },
    description,
    alternates: {
      canonical: canonicalFor(locale, PATH),
      languages: languageAlternates(PATH),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
      description,
      type: 'website',
      url: canonicalFor(locale, PATH),
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const faqs = fr
    ? [
        {
          q: 'Qu’est-ce que BNP Coorporation Sarl (BNPC) ?',
          a: "BNP Coorporation Sarl, abrégée BNPC (orthographe officielle « bnp coorporation » avec deux o), est une entreprise camerounaise basée à Yaoundé (BP 4219) depuis le 10 février 2023. Sécurité incendie, BTP, forage d’eau, énergies renouvelables, drones et réparation navale à Yaoundé, Douala et dans tout le Cameroun.",
        },
        {
          q: 'Que signifie BNPC ?',
          a: 'BNPC est l’acronyme de BNP Coorporation. On le retrouve comme « bnpc », « BNPC Cameroun » ou « BNPC Yaoundé ». Le site officiel est bnp-coorporation.com.',
        },
        {
          q: 'BNP Coorporation vs BNP Paribas : quelle différence ?',
          a: "Aucun lien. BNP Coorporation Sarl (BNPC) est une SARL camerounaise indépendante (RCCM RC/YAO/2023/C/323, NIU M042318209289U). BNP Paribas et BNP Paribas Corporate sont des banques françaises. Si Google vous propose « bnp corporate », forcez l’orthographe exacte « bnp coorporation sarl ».",
        },
        {
          q: 'Pourquoi Google corrige « bnp coorporation » en « bnp corporate » ?',
          a: "Parce que « coorporation » avec deux o est rare : Google l’interprète comme une faute de « corporation / corporate » et pousse BNP Paribas Corporate, très recherché. Tapez l’adresse exacte bnp-coorporation.com ou la requête entre guillemets « bnp coorporation sarl » pour obtenir nos résultats.",
        },
        {
          q: 'Où trouver BNP Coorporation SARL ?',
          a: 'BP 4219, Yaoundé, Cameroun. Téléphone/WhatsApp (+237) 6 55 01 09 19 et (+237) 6 58 05 14 78, email contact@bnp-coorporation.com. Intervention à Yaoundé, Douala et dans tout le Cameroun. Devis sous 24-48h ouvrées après visite technique.',
        },
        {
          q: 'Quels services propose BNPC ?',
          a: "Sécurité incendie (SSIAP, audits ERP), construction BTP, forage et eau, énergies renouvelables/solaire, drones et imagerie aérienne, réparation navale à Kribi, nettoyage industriel.",
        },
      ]
    : [
        {
          q: 'What is BNP Coorporation Sarl (BNPC)?',
          a: 'BNP Coorporation Sarl, shortened to BNPC (official spelling "bnp coorporation" with two o’s), is a Cameroonian company based in Yaoundé (P.O. Box 4219) since February 10, 2023. Fire safety, construction, water drilling, solar, drones and naval repair across Yaoundé, Douala and Cameroon.',
        },
        {
          q: 'What does BNPC stand for?',
          a: 'BNPC stands for BNP Coorporation. Also searched as "bnpc", "BNPC Cameroon" or "BNPC Yaoundé". Official website: bnp-coorporation.com.',
        },
        {
          q: 'BNP Coorporation vs BNP Paribas: what is the difference?',
          a: 'No affiliation. BNP Coorporation Sarl (BNPC) is an independent Cameroonian SARL. BNP Paribas and BNP Paribas Corporate are French banks. If Google suggests "bnp corporate", force the exact spelling "bnp coorporation sarl".',
        },
        {
          q: 'Why does Google correct "bnp coorporation" to "bnp corporate"?',
          a: 'Because "coorporation" with two o’s is rare: Google reads it as a typo for "corporation / corporate" and pushes BNP Paribas Corporate. Type the exact address bnp-coorporation.com or the quoted query "bnp coorporation sarl" to get our results.',
        },
        {
          q: 'Where is BNP Coorporation SARL located?',
          a: 'P.O. Box 4219, Yaoundé, Cameroon. Phone/WhatsApp (+237) 6 55 01 09 19 and (+237) 6 58 05 14 78, email contact@bnp-coorporation.com. Active in Yaoundé, Douala and across Cameroon. Quote within 24-48 business hours.',
        },
        {
          q: 'What services does BNPC offer?',
          a: 'Fire safety (SSIAP, ERP audits), construction, water drilling, solar/renewables, drones and aerial imaging, naval repair in Kribi, industrial cleaning.',
        },
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

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/${locale}${PATH}#webpage`,
    url: canonicalFor(locale, PATH),
    name: 'BNP Coorporation Sarl (BNPC) — bnp coorporation, bnpc Cameroun',
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
  };

  return (
    <main className="w-full bg-white text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      {/* Hero marque */}
      <PageHero
        title={fr ? 'BNP Coorporation Sarl (BNPC)' : 'BNP Coorporation Sarl (BNPC)'}
        subtitle={
          fr
            ? 'Entreprise camerounaise à Yaoundé — Sécurité incendie, BTP, forage, solaire, drones, naval'
            : 'Cameroonian company in Yaoundé — Fire safety, construction, drilling, solar, drones, naval'
        }
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1800"
      >
        <p className="mt-4 max-w-3xl text-[15px] sm:text-[16px] leading-relaxed text-white/75">
          {fr
            ? "Vous cherchiez « bnp coorporation », « bnp coorporation sarl », « bnpc » ou « BNPC » ? Vous êtes au bon endroit : site officiel de BNP Coorporation Sarl (BNPC), entreprise camerounaise indépendante basée à Yaoundé. Elle n'a aucun lien avec BNP Paribas ni BNP Paribas Corporate."
            : 'Looking for "bnp coorporation", "bnp coorporation sarl", "bnpc" or "BNPC"? You are in the right place: official website of BNP Coorporation Sarl (BNPC), an independent Cameroonian company based in Yaoundé. Not affiliated with BNP Paribas or BNP Paribas Corporate.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-hover transition-colors"
          >
            {fr ? 'Devis sous 24-48h' : 'Quote within 24-48h'}
          </Link>
          <Link
            href={`/${locale}/qui-sommes-nous`}
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white hover:border-white hover:bg-white/10 transition-colors"
          >
            {fr ? 'Qui sommes-nous' : 'About us'}
          </Link>
        </div>
      </PageHero>

      {/* Preuves NAP — signaux d'entité */}
      <section className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20 py-10 sm:py-12">
        <dl className="mx-auto grid max-w-4xl grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-neutral-100 p-6 text-left sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {fr ? 'Raison sociale' : 'Legal name'}
            </dt>
            <dd className="mt-1 font-semibold">BNP Coorporation Sarl (BNPC)</dd>
            <dd className="text-sm text-slate-600">RCCM : RC/YAO/2023/C/323 • NIU : M042318209289U</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {fr ? 'Adresse' : 'Address'}
            </dt>
            <dd className="mt-1 font-semibold">BP 4219, Yaoundé, Cameroun</dd>
            <dd className="text-sm text-slate-600">Yaoundé • Douala • Cameroun</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">Contact</dt>
            <dd className="mt-1 font-semibold">
              <a href="tel:+237655010919" className="hover:text-brand">(+237) 6 55 01 09 19</a>
            </dd>
            <dd className="text-sm text-slate-600">
              <a href="mailto:contact@bnp-coorporation.com" className="hover:text-brand">contact@bnp-coorporation.com</a>
            </dd>
          </div>
        </dl>
      </section>

      {/* FAQ — <details> natif = crawlable sans JS */}
      <section className="mx-auto max-w-4xl px-6 sm:px-12 pb-16 sm:pb-24">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold">
          {fr
            ? 'BNP Coorporation (BNPC) : questions fréquentes'
            : 'BNP Coorporation (BNPC): frequently asked questions'}
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              open={i === 0}
              className="group border border-slate-200 bg-white open:border-brand transition-colors rounded-lg"
            >
              <summary className="flex cursor-pointer items-center gap-4 p-5 text-left text-lg font-semibold hover:text-brand">
                {faq.q}
              </summary>
              <p className="px-5 pb-5 text-base leading-[1.7] text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-slate-500">
          {fr
            ? 'Astuce recherche : tapez « bnp coorporation sarl » entre guillemets, ou allez directement sur bnp-coorporation.com pour éviter la correction automatique vers « bnp corporate » / BNP Paribas.'
            : 'Search tip: type "bnp coorporation sarl" in quotes, or go directly to bnp-coorporation.com to avoid autocorrection to "bnp corporate" / BNP Paribas.'}
        </p>
      </section>
    </main>
  );
}
