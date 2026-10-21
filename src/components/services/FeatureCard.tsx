'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '../animations/gsap-setup';

interface FeatureCardProps {
  title: string;
  items: string[];
  image: string;
  imageAlt: string;
  index: number;
}

/**
 * Carte d'activité : image, numéro, titre et puces.
 * Apparition au scroll avec stagger sur les items. Sans JS : contenu visible.
 */
export function FeatureCard({
  title,
  items,
  image,
  imageAlt,
  index,
}: FeatureCardProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: { trigger: root, start: 'top 88%', once: true },
      });

      tl.fromTo(
        q('.feature-image'),
        { clipPath: 'inset(10% 10% 10% 10% round 8px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.9 },
        0
      )
        .fromTo(
          q('.feature-img'),
          { scale: 1.12 },
          { scale: 1, duration: 1.1 },
          0
        )
        .fromTo(
          q('.feature-title'),
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          0.1
        )
        .fromTo(
          q('.feature-item'),
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06 },
          0.2
        );
    },
    { scope: rootRef }
  );

  return (
    <article
      ref={rootRef}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white transition-colors duration-200 hover:border-brand/40"
    >
      <div className="relative">
        <div className="feature-image relative z-0 aspect-[16/10] w-full overflow-hidden rounded-t-xl bg-neutral-200">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="feature-img object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <span className="feature-num absolute -bottom-6 left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-brand text-[13px] font-semibold tracking-[0.12em] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] sm:left-7">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-9 sm:p-7 sm:pt-10">
        {title && (
          <h2 className="feature-title mt-2 text-[18px] font-semibold leading-snug text-ink sm:text-[22px]">
            {title}
          </h2>
        )}

        {items.length > 0 && (
          <ul className="mt-4 space-y-3 text-base leading-[1.7] text-ink">
            {items.map((item, i) => (
              <li key={i} className="feature-item flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-brand"
                />
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
