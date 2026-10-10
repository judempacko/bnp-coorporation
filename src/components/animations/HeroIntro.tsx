'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './gsap-setup';

interface HeroIntroProps {
  children: React.ReactNode;
  className?: string;
  /** décalage entre chaque enfant, en secondes */
  stagger?: number;
}

/** Entrée de hero au chargement : les enfants directs apparaissent en cascade. */
export function HeroIntro({
  children,
  className,
  stagger = 0.1,
}: HeroIntroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || el.children.length === 0 || prefersReducedMotion()) return;
      gsap.fromTo(
        el.children,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger,
        }
      );
    },
    { scope: ref, dependencies: [stagger] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
