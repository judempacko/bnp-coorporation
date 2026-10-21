"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  CaretDown,
  CaretRight,
  List,
  X,
  Translate,
} from "@phosphor-icons/react";

interface HeaderProps {
  locale: string;
  services?: Array<{ slug: string; label: string }>;
}

export function Header({ locale, services }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const pathname = usePathname();

  const otherLocale = locale === "fr" ? "en" : "fr";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const fallbackServicesList = [
    { slug: 'securite-incendie', label: locale === 'fr' ? 'Sécurité incendie' : 'Fire Safety' },
    { slug: 'construction-btp', label: locale === 'fr' ? 'Construction (BTP)' : 'Construction' },
    { slug: 'forage-et-eau', label: locale === 'fr' ? 'Forage et eau' : 'Drilling & Water' },
    { slug: 'energies-renouvelables', label: locale === 'fr' ? 'Énergies renouvelables' : 'Renewable Energy' },
    { slug: 'drones-imagerie-aerienne', label: locale === 'fr' ? 'Drones (imagerie aérienne)' : 'Drones (Aerial Imaging)' },
    { slug: 'reparation-navale', label: locale === 'fr' ? 'Réparation navale' : 'Naval Repair' },
    { slug: 'nettoyage-industriel', label: locale === 'fr' ? 'Nettoyage industriel' : 'Industrial Cleaning' },
  ];

  const servicesList =
    services && services.length > 0 ? services : fallbackServicesList;

  const companyLinks = [
    {
      slug: 'presentation',
      href: `/${locale}/qui-sommes-nous`,
      label: locale === 'fr' ? 'Qui sommes-nous' : 'About us',
    },
    {
      slug: 'galerie',
      href: `/${locale}/galerie`,
      label: locale === 'fr' ? 'Galerie média' : 'Media gallery',
    },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  // Soulignement animé au survol / focus ; persistant sur l'élément actif.
  const navUnderline =
    "relative inline-flex items-center after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-brand after:transition-transform after:duration-200 after:ease-out after:content-[''] group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none";
  const navUnderlineIdle = "after:scale-x-0";
  const navUnderlineActive = "after:scale-x-100";

  return (
    <header className={`sticky top-0 z-50 w-full bg-white border-b border-slate-200 transition-shadow ${scrolled ? 'shadow-[0_1px_8px_rgba(0,0,0,0.06)]' : ''}`}>
      {/* Navbar Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo — largeur contenue ~115px */}
        <Link href={`/${locale}`} className="flex items-center shrink-0 py-1">
          <Image
            src="/logo-bnpc.svg"
            alt="BNP Coorporation Sarl (BNPC) — bnp coorporation sarl Yaoundé"
            width={115}
            height={43}
            priority
            className="h-[43px] w-[115px] object-contain"
          />
        </Link>

        {/* Desktop Navigation Links (Taille stricte 17px) */}
        <nav className="hidden lg:flex self-stretch items-center gap-6 text-[16px] font-medium text-ink">
          <Link
            href={`/${locale}`}
            className={`group py-2 transition-colors ${isActive(`/${locale}`) ? "text-brand font-semibold" : ""}`}
          >
            <span className={`${navUnderline} ${isActive(`/${locale}`) ? navUnderlineActive : navUnderlineIdle}`}>
              Accueil
            </span>
          </Link>

          {/* L'entreprise : bouton uniquement (aucune navigation au clic), ouvre le menu.
              Panneau gris doux collé au bas de la navbar (wrapper pleine hauteur). */}
          <div
            className="relative self-stretch flex items-center"
            onMouseEnter={() => setCompanyDropdownOpen(true)}
            onMouseLeave={() => setCompanyDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCompanyDropdownOpen((v) => !v)}
              aria-expanded={companyDropdownOpen}
              aria-haspopup="true"
              className={`group flex items-center gap-1 py-2 cursor-pointer text-[16px] font-medium transition-colors ${
                isActive(`/${locale}/qui-sommes-nous`) || isActive(`/${locale}/galerie`)
                  ? "text-brand font-semibold"
                  : ""
              }`}
            >
              <span className={`${navUnderline} gap-1 ${
                isActive(`/${locale}/qui-sommes-nous`) || isActive(`/${locale}/galerie`)
                  ? navUnderlineActive
                  : navUnderlineIdle
              }`}>
                L&apos;entreprise
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`transition-transform duration-200 ${companyDropdownOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {companyDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                {companyLinks.map((c) => (
                  <Link
                    key={c.slug}
                    href={c.href}
                    onClick={() => setCompanyDropdownOpen(false)}
                    className={`group flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-[16px] font-medium transition-all ${
                      isActive(c.href)
                        ? 'bg-surface text-brand'
                        : 'text-ink hover:bg-surface'
                    }`}
                  >
                    <span>{c.label}</span>
                    <CaretRight
                      size={14}
                      weight="bold"
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand shrink-0"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Shadcn-style Services Dropdown Menu */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              type="button"
              className={`group flex items-center gap-1 py-2 cursor-pointer text-[16px] font-medium transition-colors ${
                isActive(`/${locale}/services`)
                  ? "text-brand font-semibold"
                  : ""
              }`}
            >
              <span className={`${navUnderline} gap-1 ${
                isActive(`/${locale}/services`) ? navUnderlineActive : navUnderlineIdle
              }`}>
                Services
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`transition-transform duration-200 ${servicesDropdownOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {/* Shadcn Dropdown Panel */}
            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                {servicesList.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${locale}/services/${s.slug}`}
                    onClick={() => setServicesDropdownOpen(false)}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[16px] font-medium transition-all ${
                      isActive(`/${locale}/services/${s.slug}`)
                        ? 'bg-surface text-brand'
                        : 'text-ink hover:bg-surface'
                    }`}
                  >
                    <span>{s.label}</span>
                    <CaretRight
                      size={14}
                      weight="bold"
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/projets`}
            className={`group py-2 transition-colors ${isActive(`/${locale}/projets`) ? "text-brand font-semibold" : ""}`}
          >
            <span className={`${navUnderline} ${isActive(`/${locale}/projets`) ? navUnderlineActive : navUnderlineIdle}`}>
              Réalisations
            </span>
          </Link>

          <Link
            href={`/${locale}/actualites`}
            className={`group py-2 transition-colors ${isActive(`/${locale}/actualites`) ? "text-brand font-semibold" : ""}`}
          >
            <span className={`${navUnderline} ${isActive(`/${locale}/actualites`) ? navUnderlineActive : navUnderlineIdle}`}>
              Actualités
            </span>
          </Link>

          <Link
            href={`/${locale}/contact`}
            className={`group py-2 transition-colors ${isActive(`/${locale}/contact`) ? "text-brand font-semibold" : ""}`}
          >
            <span className={`${navUnderline} ${isActive(`/${locale}/contact`) ? navUnderlineActive : navUnderlineIdle}`}>
              Contact
            </span>
          </Link>
        </nav>

        {/* Right Actions: Language Switcher (17px) & Nous joindre Button (17px) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher façon MDN : icône + langue courante, clic = bascule */}
          <Link
            href={switchedPath}
            aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
            className="group inline-flex items-center px-2 py-1.5 text-[16px] font-medium text-ink transition-colors"
          >
            <span className={`${navUnderline} ${navUnderlineIdle} gap-1.5`}>
              <Translate size={18} weight="bold" aria-hidden />
              <span>{locale === 'fr' ? 'Français' : 'English'}</span>
            </span>
          </Link>

          {/* Button Nous Joindre (Taille stricte 17px) */}
          <Link
            href={`/${locale}/contact`}
            className="hidden sm:inline-flex items-center justify-center bg-brand text-white font-semibold text-[16px] px-4 py-1.5 rounded-full transition-colors border-none outline-none shadow-none btn-sweep"
            style={{ boxShadow: "none" }}
          >
            Nous joindre
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-brand"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={28} weight="bold" />
            ) : (
              <List size={28} weight="bold" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
          <Link
            href={`/${locale}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[16px] font-medium text-ink py-1"
          >
            Accueil
          </Link>
          <div className="space-y-1 pl-3 border-l-2 border-brand">
            <span className="block text-[16px] font-semibold text-brand uppercase tracking-wider py-1">
              L&apos;entreprise
            </span>
            <Link
              href={`/${locale}/qui-sommes-nous`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[16px] text-ink py-1"
            >
              {locale === 'fr' ? 'Qui sommes-nous' : 'About us'}
            </Link>
            <Link
              href={`/${locale}/galerie`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[16px] text-ink py-1"
            >
              {locale === 'fr' ? 'Galerie média' : 'Media gallery'}
            </Link>
          </div>
          <div className="space-y-1 pl-3 border-l-2 border-brand">
            <span className="block text-[16px] font-semibold text-brand uppercase tracking-wider py-1">
              Services
            </span>
            {servicesList.map((s) => (
              <Link
                key={s.slug}
                href={`/${locale}/services/${s.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[16px] text-ink py-1"
              >
                {s.label}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/projets`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[16px] font-medium text-ink py-1"
          >
            Réalisations
          </Link>
          <Link
            href={`/${locale}/actualites`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[16px] font-medium text-ink py-1"
          >
            Actualités
          </Link>
          <Link
            href={`/${locale}/contact`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[16px] font-medium text-ink py-1"
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link
              href={`/${locale}/contact`}
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block w-full text-center bg-brand text-white font-semibold text-[16px] py-2 rounded-full shadow-none btn-sweep"
            >
              Nous joindre
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
