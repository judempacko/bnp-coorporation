'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './gsap-setup';

interface ParallaxBgProps {
  image: string;
  className?: string;
  /** amplitude du déplacement en % (de -amplitude à +amplitude) */
  amplitude?: number;
}

/**
 * Fond en parallaxe douce liée au scroll (scrub).
 * À placer dans une section `relative overflow-hidden`.
 */
export function ParallaxBg({
  image,
  className = '',
  amplitude = 8,
}: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { yPercent: -amplitude },
        {
          yPercent: amplitude,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [amplitude] }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={`absolute inset-0 scale-[1.2] ${className}`}
      style={{ backgroundImage: `url('${image}')` }}
    />
  );
}
