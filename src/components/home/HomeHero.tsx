'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { HeroIntro } from '@/components/animations/HeroIntro';

export interface HomeHeroSlide {
  src: string;
  alt: string;
}

interface HomeHeroProps {
  slides: HomeHeroSlide[];
  locale: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  fr: boolean;
  /** durée autoplay en ms */
  interval?: number;
}

/**
 * Hero homepage épuré : eyebrow + H1 + une accroche + 2 CTA.
 * Fond : images défilantes avec chevrons latéraux bien visibles.
 */
export function HomeHero({
  slides,
  locale,
  eyebrow,
  title,
  subtitle,
  fr,
  interval = 6000,
}: HomeHeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const total = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (total <= 1 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % total);
    }, interval);
    return () => window.clearInterval(id);
  }, [total, paused, interval]);

  if (total === 0) return null;

  const arrowCls =
    'z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-white';

  return (
    <section
      aria-label={fr ? 'Présentation BNPC' : 'BNPC introduction'}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }}
      className="relative flex min-h-[82svh] w-full items-center justify-center overflow-hidden bg-coal text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Fond : images empilées, seule l'active est visible */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((s, i) => (
          <div
            key={`${s.src}-${i}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={s.src}
              alt=""
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : 'lazy'}
              sizes="100vw"
              className={`object-cover ${
                i === index ? 'scale-100' : 'scale-105'
              } transition-transform duration-[6000ms] ease-out`}
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75"
      />

      {/* Chevron gauche — sur le côté, centré verticalement */}
      {total > 1 && (
        <button
          type="button"
          onClick={prev}
          aria-label={fr ? 'Image précédente' : 'Previous image'}
          className={`${arrowCls} absolute left-3 top-1/2 -translate-y-1/2 sm:left-6`}
        >
          <CaretLeft size={24} weight="bold" aria-hidden="true" />
        </button>
      )}

      {/* Chevron droit — sur le côté, centré verticalement */}
      {total > 1 && (
        <button
          type="button"
          onClick={next}
          aria-label={fr ? 'Image suivante' : 'Next image'}
          className={`${arrowCls} absolute right-3 top-1/2 -translate-y-1/2 sm:right-6`}
        >
          <CaretRight size={24} weight="bold" aria-hidden="true" />
        </button>
      )}

      {/* Contenu épuré */}
      <div
        className="relative z-10 mx-auto max-w-3xl px-12 pb-20 pt-16 text-center sm:px-16 sm:pb-24 sm:pt-24"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) {
            if (dx < 0) next();
            else prev();
          }
          touchX.current = null;
        }}
      >
        <HeroIntro>
          <div className="flex items-center justify-center gap-3" aria-hidden="false">
            <span aria-hidden="true" className="h-px w-8 bg-white/50 sm:w-12" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-xs">
              {eyebrow}
            </p>
            <span aria-hidden="true" className="h-px w-8 bg-white/50 sm:w-12" />
          </div>
          <h1 className="mt-5 text-balance text-[30px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[42px]">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-slate-100 sm:text-xl">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-lg btn-sweep"
            >
              {fr ? 'Demander un devis' : 'Request a quote'}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-white btn-sweep-ghost"
            >
              {fr ? 'Nos services' : 'Our services'}
            </Link>
          </div>
        </HeroIntro>
      </div>

      {/* Dots + compteur en bas */}
      {total > 1 && (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center">
          {slides.map((s, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              aria-label={`${fr ? 'Image' : 'Image'} ${i + 1} : ${s.alt}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => goTo(i)}
              className="group flex h-11 w-7 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-8 bg-white'
                    : 'w-2.5 bg-white/40 group-hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      )}
      {total > 1 && (
        <span
          aria-hidden="true"
          className="absolute bottom-4 right-4 z-10 rounded-full bg-black/60 px-3 py-1 text-[13px] font-semibold text-white"
        >
          {index + 1} / {total}
        </span>
      )}

      <span aria-live="polite" className="sr-only">
        {fr ? 'Image' : 'Image'} {index + 1} {fr ? 'sur' : 'of'} {total} :{' '}
        {slides[index]?.alt}
      </span>
    </section>
  );
}
