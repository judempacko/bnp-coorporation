'use client';

import Link from 'next/link';
import { ArrowLeft, CaretDown } from '@phosphor-icons/react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../animations/gsap-setup';

interface ServiceHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  backLabel: string;
  backHref: string;
}

/**
 * Hero cinématique style Awwwards :
 * - titre découpé en mots avec reveal masqué (y 110% -> 0, expo.out)
 * - fond qui dézoome + parallaxe au scroll (scrub)
 * - grand texte outline en fond qui glisse en parallaxe
 * - breadcrumb en pill glass + indicateur scroll
 * Sans JS : contenu visible, image en cover statique.
 */
export function ServiceHero({
  title,
  subtitle,
  image,
  backLabel,
  backHref,
}: ServiceHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const words = title.split(' ');

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      const q = gsap.utils.selector(root);

      // 1. Intro timeline au chargement
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo(
        q('.hero-bg'),
        { scale: 1.25 },
        { scale: 1.15, duration: 1.6, ease: 'expo.out' },
        0
      )
        .fromTo(
          q('.hero-word-inner'),
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.08 },
          0.15
        )
        .fromTo(
          q('.hero-fade'),
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12 },
          0.4
        );

      // 2. Effets liés au scroll : desktop uniquement.
      // Sur mobile, la barre d'URL qui apparaît/disparaît déclenche des
      // micro-scrolls en continu → les tweens scrub (opacités à moitié
      // fondues) flickerent et le hero paraît instable/cassé.
      // Sur mobile : intro cinématique puis hero stable et net.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 640px)', () => {
        gsap.to(q('.hero-bg'), {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to(q('.hero-content'), {
          yPercent: -8,
          autoAlpha: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom 35%',
            scrub: true,
          },
        });

      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden bg-[#181b1e] text-white"
    >
      {/* Fond */}
      <div
        aria-hidden
        className="hero-bg absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />

      {/* Contenu */}
      <div className="hero-content relative z-10 mx-auto max-w-4xl px-6 pb-10 pt-10 sm:px-12 sm:pb-24 sm:pt-16">
        <Link
          href={backHref}
          className="hero-fade group inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[14px] font-semibold text-slate-100 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft
            size={16}
            weight="bold"
            aria-hidden
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1.5"
          />
          {backLabel}
        </Link>

        <h1 className="mt-6 text-balance text-[30px] font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="inline-block overflow-hidden pb-1 align-bottom"
            >
              <span className="hero-word-inner inline-block will-change-transform">
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </h1>

        {subtitle && (
          <p className="hero-fade mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-200 sm:mt-4">
            {subtitle}
          </p>
        )}

        {/* Indicateur scroll : double chevron en boucle */}
        <div className="hero-fade mt-6 flex items-center gap-3 text-slate-300 sm:mt-8">
          <span className="flex flex-col items-center -space-y-2" aria-hidden>
            <CaretDown
              size={18}
              weight="bold"
              className="animate-hero-chevron text-white/90"
            />
            <CaretDown
              size={18}
              weight="bold"
              className="animate-hero-chevron text-white/90"
              style={{ animationDelay: '0.3s' }}
            />
          </span>
          <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-300">
            Scroll
          </span>
          <span className="h-px w-12 bg-white/30" />
        </div>
      </div>
    </section>
  );
}
