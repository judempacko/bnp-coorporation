import type { ReactNode } from 'react';
import { HeroIntro } from '@/components/animations/HeroIntro';
import { ParallaxBg } from '@/components/animations/ParallaxBg';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  currentLabel?: string;
  children?: ReactNode;
}

export function PageHero({
  title,
  subtitle,
  image,
  currentLabel,
  children,
}: PageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-banner">
      <ParallaxBg
        image={image}
        className="bg-cover bg-center grayscale"
        amplitude={8}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-12 sm:py-16">
        <Breadcrumbs variant="dark" currentLabel={currentLabel ?? title} />
        <HeroIntro className="mt-4">
          <h1 className="text-white text-[28px] sm:text-[40px] leading-[1.2] font-semibold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-3xl text-[16px] leading-[1.7] text-white/80">
              {subtitle}
            </p>
          )}
          {children}
        </HeroIntro>
      </div>
    </section>
  );
}
