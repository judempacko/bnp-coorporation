'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './gsap-setup';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** délai en secondes avant le déclenchement */
  delay?: number;
  /** distance verticale de départ en px */
  y?: number;
  as?: 'div' | 'section';
}

/** Apparition douce au scroll, une seule fois. Sans JS : contenu visible. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { y, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power2.out',
          delay,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    },
    { scope: ref, dependencies: [delay, y] }
  );

  if (as === 'section') {
    return (
      <section ref={ref as React.RefObject<HTMLElement>} className={className}>
        {children}
      </section>
    );
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}
