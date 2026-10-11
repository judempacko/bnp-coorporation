'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CalendarBlank } from '@phosphor-icons/react';
import {
  GALLERY_CATEGORIES,
  categoryLabel,
  formatEventDate,
  type GalleryEvent,
} from '@/lib/gallery';

interface GalleryGridProps {
  events: GalleryEvent[];
  locale: string;
  allLabel: string;
}

export function GalleryGrid({ events, locale, allLabel }: GalleryGridProps) {
  const [activeCat, setActiveCat] = useState<string>('tout');

  const filtered = useMemo(
    () => (activeCat === 'tout' ? events : events.filter((e) => e.category === activeCat)),
    [events, activeCat]
  );

  void allLabel;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer la galerie">
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActiveCat(c.slug)}
            aria-pressed={activeCat === c.slug}
            className={`px-4 py-1.5 rounded-full text-[14px] font-semibold border transition-colors ${
              activeCat === c.slug
                ? 'bg-[#0A66C2] text-white border-[#0A66C2]'
                : 'bg-white text-[#2c2c2c] border-slate-300 hover:border-[#0A66C2] hover:text-[#0A66C2]'
            }`}
          >
            {locale === 'en' ? c.labelEn : c.labelFr}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => (
          <article
            key={event.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-56 w-full overflow-hidden bg-neutral-200">
              <Image
                src={event.cover}
                alt={event.coverAlt || event.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[13px] font-semibold text-[#0A66C2] border border-blue-100">
                {categoryLabel(event.category, locale)}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-[18px] font-semibold leading-snug text-[#2c2c2c] group-hover:text-[#0A66C2] transition-colors line-clamp-2">
                <Link href={`/${locale}/galerie/${event.slug}`}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  {event.title}
                </Link>
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#666] line-clamp-2">
                {event.description}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-4 text-[13px] font-medium text-[#51565d] border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarBlank size={15} weight="bold" className="text-[#0A66C2]" />
                  <time dateTime={event.date}>{formatEventDate(event.date, locale)}</time>
                </span>
                <span className="inline-flex items-center gap-1.5 truncate">
                  <MapPin size={15} weight="fill" className="text-[#0A66C2] shrink-0" />
                  {event.lieu}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-[15px] text-[#666]">
          {locale === 'fr' ? 'Aucun événement dans cette catégorie.' : 'No event in this category.'}
        </p>
      )}
    </div>
  );
}
