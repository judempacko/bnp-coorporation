import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getProjects } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { canonicalFor, languageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  const title = fr ? 'Projets & Réalisations' : 'Projects & Achievements';
  const description = fr
    ? "Réalisations BNPC au Cameroun : BTP, sécurité incendie, forages, solaire, drones, naval. Études de cas et chantiers Yaoundé-Douala-Kribi."
    : 'BNPC projects in Cameroon: construction, fire safety, drilling, solar, drones, naval. Case studies across Cameroon.';
  return {
    title: `${title} — BNPC`,
    description,
    alternates: {
      canonical: canonicalFor(locale, '/projets'),
      languages: languageAlternates('/projets'),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
      description,
      type: 'website',
      url: canonicalFor(locale, '/projets'),
    },
  };
}

export default async function ProjetsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const projects = await getProjects(locale).catch(() => []);

  return (
    <main className="w-full bg-white">
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-12 sm:pt-24 pb-6 sm:pb-8 text-center">
        <h1 className="text-[28px] sm:text-[40px] leading-[1.2] font-semibold text-[#2c2c2c]">
          {fr ? 'Nos Projets & Réalisations' : 'Our Projects & Achievements'}
        </h1>
        <p className="mt-3 text-[16px] leading-[1.7] text-[#666] max-w-3xl mx-auto">
          {fr
            ? "Études de cas et chantiers BNPC au Cameroun : client, année, lieu et service concerné pour chaque réalisation."
            : 'BNPC case studies and sites in Cameroon: client, year, location and related service for each achievement.'}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-12 sm:pb-24">
        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">
              {fr ? 'Aucun projet disponible.' : 'No projects available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
