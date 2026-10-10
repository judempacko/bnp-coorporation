'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LinkedinLogo } from '@phosphor-icons/react';
import { type TeamMember } from '@/lib/team';

interface TeamGridProps {
  members: TeamMember[];
  locale: string;
  labels: {
    title: string;
    subtitle: string;
  };
}

/**
 * Grille UNIQUE ordonnée par `order` (numérotation attribuée manuellement :
 * l'ordre d'affichage reflète les responsabilités, sans classement par pôle).
 * Chaque employé expose une description SEO invisible en JSON-LD `Person`
 * (recherche nominative Google + exploitation par les agents IA).
 */
export function TeamGrid({ members, locale, labels }: TeamGridProps) {
  const ordered = useMemo(
    () => [...members].sort((a, b) => a.order - b.order),
    [members]
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BNP Coorporation Sarl',
    employee: ordered.map((m) => ({
      '@type': 'Person',
      name: m.name,
      jobTitle: m.role,
      description:
        m.seoDescription || `${m.name}, ${m.role} — BNP Coorporation Sarl`,
      image: m.photo,
      ...(m.linkedin && m.linkedin !== '#'
        ? { sameAs: [m.linkedin] }
        : {}),
    })),
  };

  return (
    <div className="space-y-8">
      {/* Données structurées invisibles : SEO nominatif + agents IA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#2c2c2c]">
          {labels.title}
        </h2>
        <p className="text-[16px] text-[#666]">{labels.subtitle}</p>
      </div>

      {ordered.length === 0 ? (
        <p className="text-center text-[15px] text-[#666]">
          {locale === 'fr'
            ? 'Notre équipe sera bientôt présentée ici.'
            : 'Our team will soon be introduced here.'}
        </p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ordered.map((m) => (
          <article
            key={m.id}
            className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link
              href={`/${locale}/qui-sommes-nous/${m.slug}`}
              className="block relative h-56 w-full bg-slate-100 overflow-hidden"
              aria-label={`${m.name} — ${m.role}`}
            >
              <Image
                src={m.photo}
                alt={m.photoAlt || `${m.name}, ${m.role} — BNP Coorporation`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="p-5 space-y-1.5">
              <h3 className="text-[17px] font-semibold text-[#2c2c2c]">
                <Link
                  href={`/${locale}/qui-sommes-nous/${m.slug}`}
                  className="hover:text-[#0A66C2] transition-colors"
                >
                  {m.name}
                </Link>
              </h3>
              <p className="text-[14px] font-semibold text-[#0A66C2]">{m.role}</p>
              {m.linkedin && m.linkedin !== '#' && (
                <a
                  href={m.linkedin}
                  aria-label={`LinkedIn de ${m.name}`}
                  className="inline-flex items-center gap-2 pt-1 text-[14px] font-semibold text-[#0A66C2] hover:underline"
                >
                  <LinkedinLogo size={18} weight="fill" />
                  LinkedIn
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      )}
    </div>
  );
}
