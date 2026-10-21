import type { ReactNode } from 'react';
import { PageHero } from '@/components/PageHero';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalDocumentProps {
  title: string;
  subtitle: string;
  image: string;
  tocLabel: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  lastUpdatedDate: string;
  intro?: ReactNode;
  sections: LegalSection[];
}

export function LegalDocument({
  title,
  subtitle,
  image,
  tocLabel,
  lastUpdatedLabel,
  lastUpdated,
  lastUpdatedDate,
  intro,
  sections,
}: LegalDocumentProps) {
  const toc = (
    <ol className="space-y-2 border-l border-slate-200 pl-4 text-[15px] leading-snug">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="text-muted transition-colors hover:text-brand"
          >
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="w-full bg-white text-ink">
      <PageHero title={title} subtitle={subtitle} image={image} currentLabel={title} />

      <div className="mx-auto max-w-[1100px] px-6 py-12 sm:py-16 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
        <details className="mb-8 rounded-md border border-slate-200 bg-surface p-4 lg:hidden">
          <summary className="cursor-pointer text-[16px] font-semibold text-ink">
            {tocLabel}
          </summary>
          <div className="mt-4">{toc}</div>
        </details>

        <nav aria-label={tocLabel} className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-neutral-600">
              {tocLabel}
            </p>
            <div className="mt-4">{toc}</div>
          </div>
        </nav>

        <article className="min-w-0 max-w-[68ch]">
          <p className="text-[14px] text-muted">
            {lastUpdatedLabel} :{' '}
            <time dateTime={lastUpdatedDate}>{lastUpdated}</time>
          </p>

          {intro ? (
            <div className="legal-prose mt-4 text-[17px] leading-[1.75]">{intro}</div>
          ) : null}

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-[24px] leading-[1.25] font-semibold text-ink">
                  {section.title}
                </h2>
                <div className="legal-prose mt-3 text-[16px] leading-[1.75]">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
