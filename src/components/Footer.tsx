'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, EnvelopeSimple, LinkedinLogo, FacebookLogo } from '@phosphor-icons/react';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const fr = locale !== 'en';
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const yearRange = currentYear > startYear ? `${startYear} - ${currentYear}` : `${startYear}`;

  const servicesList = fr
    ? [
        { slug: 'securite-incendie', label: 'Sécurité incendie' },
        { slug: 'construction-btp', label: 'Construction (BTP)' },
        { slug: 'forage-et-eau', label: 'Forage et eau' },
        { slug: 'energies-renouvelables', label: 'Énergies renouvelables' },
        { slug: 'drones-imagerie-aerienne', label: 'Drones (imagerie aérienne)' },
      ]
    : [
        { slug: 'securite-incendie', label: 'Fire Safety' },
        { slug: 'construction-btp', label: 'Construction' },
        { slug: 'forage-et-eau', label: 'Drilling & Water' },
        { slug: 'energies-renouvelables', label: 'Renewable Energy' },
        { slug: 'drones-imagerie-aerienne', label: 'Drones (Aerial Imaging)' },
      ];

  const quickLinks = [
    { href: `/${locale}/qui-sommes-nous`, label: fr ? 'Qui sommes-nous' : 'About us' },
    { href: `/${locale}/projets`, label: fr ? 'Nos réalisations' : 'Our projects' },
    { href: `/${locale}/galerie`, label: fr ? 'Galerie média' : 'Media gallery' },
    { href: `/${locale}/actualites`, label: fr ? 'Actualités' : 'News' },
    { href: `/${locale}/contact`, label: fr ? 'Contact' : 'Contact' },
  ];

  return (
    <footer className="mt-auto bg-neutral-100 text-neutral-700">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block">
              <Image
                src="/logo-bnpc.svg"
                alt="BNP Coorporation Sarl (BNPC)"
                width={115}
                height={43}
                className="h-[43px] w-[115px] object-contain"
              />
            </Link>
            <p className="max-w-xs text-[15px] leading-relaxed text-neutral-600">
              {fr
                ? 'Ingénierie multiservices à Yaoundé : sécurité incendie, BTP, forage, solaire et drones.'
                : 'Multiservice engineering in Yaoundé: fire safety, construction, drilling, solar and drones.'}
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.linkedin.com/company/bnp-coorporation-sarl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn — BNP Coorporation Sarl"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white shrink-0 text-neutral-600 transition-colors hover:border-brand hover:text-brand"
              >
                <LinkedinLogo size={22} weight="fill" aria-hidden />
              </a>
              <a
                href="https://www.facebook.com/bnpcoorporation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook — BNP Coorporation Sarl"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white shrink-0 text-neutral-600 transition-colors hover:border-brand hover:text-brand"
              >
                <FacebookLogo size={22} weight="fill" aria-hidden />
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h2 className="mb-4 text-[15px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {fr ? 'Nos services' : 'Our services'}
            </h2>
            <ul className="space-y-2 text-[15px]">
              {servicesList.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/${locale}/services/${service.slug}`}
                    className="text-neutral-700 transition-colors hover:text-brand"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Liens rapides */}
          <div>
            <h2 className="mb-4 text-[15px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {fr ? 'Liens rapides' : 'Quick links'}
            </h2>
            <ul className="space-y-2 text-[15px]">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-700 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h2 className="mb-4 text-[15px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              {fr ? 'Contact rapide' : 'Quick contact'}
            </h2>
            <div className="space-y-3 text-[15px] text-neutral-700">
              <div className="flex items-start gap-2.5">
                <MapPin size={18} weight="fill" className="mt-0.5 shrink-0 text-brand" />
                <span>BP 4219, Yaoundé, Cameroun</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={18} weight="fill" className="mt-0.5 shrink-0 text-brand" />
                <a href="tel:+237655010919" className="transition-colors hover:text-brand">
                  (+237) 6 55 01 09 19
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <EnvelopeSimple size={18} weight="fill" className="mt-0.5 shrink-0 text-brand" />
                <a
                  href="mailto:contact@bnp-coorporation.com"
                  className="break-all transition-colors hover:text-brand"
                >
                  contact@bnp-coorporation.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre légale unique */}
      <div className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-4 flex flex-col items-center gap-2 text-[15px] text-neutral-600 sm:flex-row sm:justify-between sm:gap-6">
          <p className="text-center sm:text-left">
            © {yearRange} BNP Coorporation Sarl, {fr ? 'Tous droits réservés' : 'All rights reserved'}
          </p>
          <nav
            aria-label={fr ? 'Liens juridiques' : 'Legal links'}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-neutral-700 sm:justify-end"
          >
            <Link
              href={`/${locale}/conditions-generales-utilisation`}
              className="transition-colors hover:text-brand"
            >
              {fr ? "Conditions d'utilisation" : 'Terms of Service'}
            </Link>
            <Link
              href={`/${locale}/politique-de-confidentialite`}
              className="transition-colors hover:text-brand"
            >
              {fr ? 'Politique de confidentialité' : 'Privacy Policy'}
            </Link>
            <CookieSettingsButton className="transition-colors hover:text-brand">
              {fr ? 'Gérer les cookies' : 'Manage cookies'}
            </CookieSettingsButton>
          </nav>
        </div>
      </div>
    </footer>
  );
}
