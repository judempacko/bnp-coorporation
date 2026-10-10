'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './gsap-setup';

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Compteur animé déclenché au scroll, une seule fois. */
export function Counter({
  target,
  suffix = '',
  duration = 1.4,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.textContent = `${target}${suffix}`;
        return;
      }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration,
        ease: 'power1.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.v)}${suffix}`;
        },
      });
    },
    { scope: ref, dependencies: [target, suffix, duration] }
  );

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
