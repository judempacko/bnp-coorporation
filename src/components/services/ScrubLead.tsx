'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../animations/gsap-setup';

interface ScrubLeadProps {
  text: string;
  className?: string;
}

/**
 * Paragraphe d'intro en reveal mot-à-mot lié au scroll (scrub).
 * Style Awwwards : les mots s'illuminent de 0.15 -> 1 d'opacité.
 * Sans JS / reduced-motion : texte entièrement visible.
 */
export function ScrubLead({ text, className = '' }: ScrubLeadProps) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el || prefersReducedMotion()) return;

      const wordSpans = el.querySelectorAll('.scrub-word');
      const mm = gsap.matchMedia();

      // Desktop : reveal progressif lié au scroll
      mm.add('(min-width: 640px)', () => {
        gsap.fromTo(
          wordSpans,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'bottom 45%',
              scrub: true,
            },
          }
        );
      });

      // Mobile : apparition unique et stable.
      // Le scrub ferait flicker les mots à cause de la barre d'URL mobile.
      mm.add('(max-width: 639px)', () => {
        gsap.fromTo(
          wordSpans,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: 'power1.out',
            duration: 0.5,
            stagger: 0.04,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <p
      ref={rootRef}
      className={`text-[18px] leading-[1.7] text-ink ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="scrub-word">
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
