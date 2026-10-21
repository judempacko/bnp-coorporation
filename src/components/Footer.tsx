'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  CaretRight,
} from '@phosphor-icons/react';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const fr = locale !== 'en';
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const yearRange = currentYear > startYear ? `${startYear} - ${currentYear}` : `${startYear}`;
  const servicesList = [
    { slug: 'securite-incendie', label: 'Sécurité incendie' },
    { slug: 'construction-btp', label: 'Construction (BTP)' },
    { slug: 'forage-et-eau', label: 'Forage et eau' },
    { slug: 'energies-renouvelables', label: 'Énergies renouvelables' },
    { slug: 'drones-imagerie-aerienne', label: 'Drones (imagerie aérienne)' },
    { slug: 'reparation-navale', label: 'Réparation navale' },
    { slug: 'nettoyage-industriel', label: 'Nettoyage industriel' },
  ];

  return (
    <footer className="mt-auto bg-neutral-100 text-neutral-700">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand + E-E-A-T description */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block">
              <Image
                src="/logo-bnpc.svg"
                alt="BNP Coorporation Sarl (BNPC) — bnp coorporation sarl"
                width={115}
                height={43}
                className="h-[43px] w-[115px] object-contain"
              />
            </Link>
            <p className="text-[16px] font-normal text-neutral-700 leading-relaxed">
              {fr
                ? "BNP Coorporation Sarl (BNPC) : ingénierie multiservices basée à Yaoundé depuis 2023. Sécurité incendie, BTP, forage d'eau, solaire, drones et naval. Basés à Yaoundé et Douala, intervention dans tout le Cameroun."
                : 'BNP Coorporation Sarl (BNPC): multiservice engineering company based in Yaoundé since 2023. Fire safety, construction, water drilling, solar, drones and naval. Based in Yaoundé and Douala, operating across Cameroon.'}
            </p>
            {/* Désambiguïsation d'entité : volontairement non affichée —
                lue en arrière-plan via organizationJsonLd() (disambiguatingDescription) */}
          </div>

          {/* Col 2: NOS SERVICES (17px) */}
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-neutral-600 mb-4">
              NOS SERVICES
            </h2>
            <ul className="space-y-2.5 text-[16px] font-normal">
              {servicesList.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/${locale}/services/${service.slug}`}
                    className="hover:text-brand transition-colors inline-flex items-center gap-2 text-neutral-700 group"
                  >
                    <CaretRight size={14} weight="bold" className="text-brand group-hover:translate-x-0.5 transition-transform" />
                    <span>{service.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: LIENS RAPIDES (17px) */}
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-neutral-600 mb-4">
              LIENS RAPIDES
            </h2>
            <ul className="space-y-2.5 text-[16px] font-normal">
              <li>
                <Link href={`/${locale}/qui-sommes-nous`} className="hover:text-brand transition-colors inline-flex items-center gap-2 text-neutral-700 group">
                  <CaretRight size={14} weight="bold" className="text-brand group-hover:translate-x-0.5 transition-transform" />
                  <span>Qui sommes-nous</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/qui-sommes-nous`} className="hover:text-brand transition-colors inline-flex items-center gap-2 text-neutral-700 group">
                  <CaretRight size={14} weight="bold" className="text-brand group-hover:translate-x-0.5 transition-transform" />
                  <span>Notre Équipe</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/galerie`} className="hover:text-brand transition-colors inline-flex items-center gap-2 text-neutral-700 group">
                  <CaretRight size={14} weight="bold" className="text-brand group-hover:translate-x-0.5 transition-transform" />
                  <span>Galerie média</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/projets`} className="hover:text-brand transition-colors inline-flex items-center gap-2 text-neutral-700 group">
                  <CaretRight size={14} weight="bold" className="text-brand group-hover:translate-x-0.5 transition-transform" />
                  <span>Nos réalisations</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/actualites`} className="hover:text-brand transition-colors inline-flex items-center gap-2 text-neutral-700 group">
                  <CaretRight size={14} weight="bold" className="text-brand group-hover:translate-x-0.5 transition-transform" />
                  <span>Actualités</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-brand transition-colors inline-flex items-center gap-2 text-neutral-700 group">
                  <CaretRight size={14} weight="bold" className="text-brand group-hover:translate-x-0.5 transition-transform" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: CONTACT RAPIDE (17px) */}
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-neutral-600 mb-4">
              CONTACT RAPIDE
            </h2>
            <div className="space-y-3.5 text-[16px] font-normal text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin size={20} weight="fill" className="text-brand shrink-0 mt-0.5" />
                <span>BP 4219, Yaoundé, Cameroun</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} weight="fill" className="text-brand shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:+237655010919" className="hover:text-brand transition-colors">(+237) 6 55 01 09 19</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <EnvelopeSimple size={20} weight="fill" className="text-brand shrink-0 mt-0.5" />
                <a href="mailto:contact@bnp-coorporation.com" className="hover:text-brand transition-colors break-all">
                  contact@bnp-coorporation.com
                </a>
              </div>
            </div>
            <p className="mt-4 text-[15px] font-normal text-neutral-600 leading-relaxed">
              {fr
                ? 'Devis sous 24-48h ouvrées après visite technique.'
                : 'Quote within 24-48 business hours after site visit.'}
            </p>
          </div>
        </div>
      </div>

      {/* Legal band + Copyright */}
      <div className="bg-neutral-200 border-t border-neutral-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-[16px] font-normal text-neutral-700">
          <span className="font-semibold uppercase text-neutral-800">BNP Coorporation Sarl</span>
          <span aria-hidden className="text-neutral-400">•</span>
          <span>{fr ? 'SARL au capital de 1 000 000 FCFA' : 'SARL with capital of 1,000,000 FCFA'}</span>
          <span aria-hidden className="text-neutral-400">•</span>
          <span>RCCM : RC/YAO/2023/C/323</span>
          <span aria-hidden className="text-neutral-400">•</span>
          <span>NIU : M042318209289U</span>
          <span aria-hidden className="text-neutral-400">•</span>
          <span>{fr ? 'Créée le 10 février 2023 à Yaoundé' : 'Incorporated on February 10, 2023 in Yaoundé'}</span>
        </div>
        <div className="border-t border-neutral-300">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-4 flex flex-col items-center gap-2 text-[15px] font-normal text-neutral-600 sm:flex-row sm:justify-between sm:gap-6">
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
      </div>
    </footer>
  );
}
