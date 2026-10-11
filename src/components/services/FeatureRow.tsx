'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../animations/gsap-setup';

interface FeatureRowProps {
  title: string;
  items: string[];
  image: string;
  imageAlt: string;
  index: number;
  imageFirst: boolean;
}

/**
 * Ligne éditoriale alternée avec :
 * - image en reveal rideau (clip-path) + dézoom interne 1.35 -> 1
 * - numéro + ligne qui se trace, titre en slide-up, items en stagger
 * Déclenché une seule fois au scroll. Sans JS : contenu visible.
 */
export function FeatureRow({
  title,
  items,
  image,
  imageAlt,
  index,
  imageFirst,
}: FeatureRowProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: { trigger: root, start: 'top 85%', once: true },
      });

      // Image : rideau + dézoom
      tl.fromTo(
        q('.feature-clip'),
        { clipPath: 'inset(12% 6% 12% 6% round 12px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.1 },
        0
      )
        .fromTo(
          q('.feature-img'),
          { scale: 1.35 },
          { scale: 1, duration: 1.4 },
          0
        )
        // Numéro + ligne
        .fromTo(
          q('.feature-num'),
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          0.15
        )
        .fromTo(
          q('.feature-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8 },
          0.25
        )
        // Titre
        .fromTo(
          q('.feature-title'),
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          0.25
        )
        // Items en cascade
        .fromTo(
          q('.feature-item'),
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 },
          0.35
        );
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10"
    >
      <div
        className={`relative h-52 w-full overflow-hidden rounded-xl bg-neutral-200 sm:h-72 md:col-span-5 ${
          imageFirst ? '' : 'md:order-2'
        }`}
      >
        <div className="feature-clip relative h-full w-full will-change-transform">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="feature-img object-cover will-change-transform"
          />
        </div>
      </div>

      <div className={`md:col-span-7 ${imageFirst ? '' : 'md:order-1'}`}>
        <div className="flex items-center gap-3">
          <span className="feature-num text-[15px] font-semibold tracking-[0.2em] text-[#0A66C2]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="feature-line h-px w-12 origin-left bg-[#0A66C2]" />
        </div>
        {title && (
          <h2 className="feature-title mt-2 text-[18px] font-semibold leading-snug text-[#2c2c2c] sm:text-[24px]">
            {title}
          </h2>
        )}
        {items.length > 0 && (
          <ul className="mt-4 space-y-2.5 text-base leading-[1.7] text-[#2c2c2c]">
            {items.map((item, i) => (
              <li key={i} className="feature-item flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-[10px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#0A66C2]"
                />
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
