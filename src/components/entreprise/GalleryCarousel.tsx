'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { GalleryImage } from '@/lib/gallery';

interface GalleryCarouselProps {
  images: GalleryImage[];
  title: string;
}

/**
 * Carousel sans dépendance : image principale + flèches + miniatures.
 * Chaque image garde son alt descriptif → SEO + accessibilité.
 */
export function GalleryCarousel({ images, title }: GalleryCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  if (total === 0) return null;
  const current = images[index];

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[16/9]">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt || title}
          fill
          priority
          sizes="(max-width: 1100px) 100vw, 1100px"
          className="object-cover"
        />
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center transition-colors"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center transition-colors"
            >
              <CaretRight size={20} weight="bold" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-[13px] font-semibold px-3 py-1">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir l’image ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors ${
                i === index ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="150px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      {current.alt && (
        <p className="text-[14px] text-muted italic">{current.alt}</p>
      )}
    </div>
  );
}
