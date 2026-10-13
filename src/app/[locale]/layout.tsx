import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { getAllServices } from '@/lib/api';
import { SITE_URL, organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import "../globals.css";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BNP Coorporation Sarl — Sécurité incendie, BTP & Ingénierie au Cameroun',
    template: '%s — BNP Coorporation Sarl',
  },
  description:
    'BNP Coorporation Sarl (BNPC), entreprise camerounaise à Yaoundé : sécurité incendie, BTP, forage d\u2019eau, énergies renouvelables, drones et réparation navale. Basés à Yaoundé et Douala, intervention dans tout le Cameroun. Devis sous 24-48h.',
  keywords: [
    'BNP Coorporation Sarl',
    'BNP Coorporation',
    'BNPC',
    'bnp coorporation',
    'bnp coorporation sarl',
    'BNP Coorporation Cameroun',
    'BNP Coorporation Yaoundé',
    'sécurité incendie Cameroun',
    'SSIAP Yaoundé',
    'BTP Cameroun',
    'forage eau Cameroun',
    'énergie solaire Cameroun',
    'drone Cameroun',
    'réparation navale Kribi',
  ],
  alternates: {
    languages: {
      fr: `${SITE_URL}/fr`,
      en: `${SITE_URL}/en`,
      'x-default': `${SITE_URL}/fr`,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'BNP Coorporation Sarl',
    locale: 'fr_FR',
    alternateLocale: ['en_US'],
    images: [{ url: '/favicon/android-chrome-512x512.png', width: 512, height: 512, alt: 'BNP Coorporation Sarl — BNPC' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  let headerServices: Array<{ slug: string; label: string }> = [];
  try {
    headerServices = (await getAllServices(locale)).map((s) => ({
      slug: s.slug,
      label: s.title,
    }));
  } catch {
    headerServices = [];
  }

  // Note : suppressHydrationWarning sur <html> car Chrome (Autofill/Cast) injecte
  // l'attribut `__gcrremoteframetoken` après réception du HTML mais avant
  // l'hydratation React → faux mismatch. Attribut 100% externe, jamais rendu
  // par notre code. Ne masque que les attributs de cet élément.
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} services={headerServices} />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer locale={locale} />
          <BackToTop locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
