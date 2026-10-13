'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../animations/gsap-setup';

interface EditorialRowProps {
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  index: number;
  imageFirst: boolean;
}

/**
 * Ligne éditoriale Entreprise, pendant de FeatureRow pour paragraphes :
 * - image en reveal rideau (clip-path) + dézoom interne 1.35 -> 1
 * - numéro + ligne qui se trace, titre en slide-up, paragraphes en cascade
 * Déclenché une seule fois au scroll. Sans JS : contenu visible.
 */
export function EditorialRow({
  title,
  paragraphs,
  image,
  imageAlt,
  index,
  imageFirst,
}: EditorialRowProps) {
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

      tl.fromTo(
        q('.story-clip'),
        { clipPath: 'inset(12% 6% 12% 6% round 12px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.1 },
        0
      )
        .fromTo(
          q('.story-img'),
          { scale: 1.35 },
          { scale: 1, duration: 1.4 },
          0
        )
        .fromTo(
          q('.story-num'),
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          0.15
        )
        .fromTo(
          q('.story-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8 },
          0.25
        )
        .fromTo(
          q('.story-title'),
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          0.25
        )
        .fromTo(
          q('.story-para'),
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 },
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
        <div className="story-clip relative h-full w-full will-change-transform">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="story-img object-cover will-change-transform"
          />
        </div>
      </div>

      <div className={`md:col-span-7 ${imageFirst ? '' : 'md:order-1'}`}>
        <div className="flex items-center gap-3">
          <span className="story-num text-[15px] font-semibold tracking-[0.2em] text-brand">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="story-line h-px w-12 origin-left bg-brand" />
        </div>
        <h2 className="story-title mt-2 text-[18px] font-semibold leading-snug text-ink sm:text-[24px]">
          {title}
        </h2>
        <div className="mt-4 space-y-4 text-base leading-[1.7] text-ink">
          {paragraphs.map((p, i) => (
            <p key={i} className="story-para">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
