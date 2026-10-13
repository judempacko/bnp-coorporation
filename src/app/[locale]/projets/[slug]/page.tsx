import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft,
  CalendarBlank,
  LinkedinLogo,
  MapPin,
  User,
  Wrench,
} from '@phosphor-icons/react/dist/ssr';
import { getProjects, getProjectBySlug } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { canonicalFor, languageAlternates } from '@/lib/seo';

export async function generateStaticParams() {
  try {
    const projects = await getProjects('fr');
    return projects
      .filter((p) => p.href.startsWith('/projets/'))
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const fr = locale !== 'en';
  const project = await getProjectBySlug(slug, locale).catch(() => null);
  const title = project?.title ?? slug;
  const description =
    project?.excerpt ||
    (fr
      ? `${title} : réalisation BNPC au Cameroun. Client, année, lieu et service concerné.`
      : `${title}: BNPC achievement in Cameroon. Client, year, location and related service.`);
  const path = `/projets/${slug}`;
  return {
    title: `${title} — BNPC`,
    description,
    alternates: {
      canonical: canonicalFor(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
      description,
      type: 'article',
      url: canonicalFor(locale, path),
      ...(project?.image
        ? { images: [{ url: project.image, alt: project.imageAlt || title }] }
        : {}),
    },
  };
}

export default async function ProjetDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug, locale),
    getProjects(locale).catch(() => []),
  ]);
  if (!project) notFound();

  const others = allProjects.filter((p) => p.slug !== slug).slice(0, 3);
  const gallery = project.images.slice(1);

  const meta: Array<{ icon: typeof MapPin; label: string; value: string }> = [];
  if (project.client)
    meta.push({
      icon: User,
      label: fr ? 'Client' : 'Client',
      value: project.client,
    });
  if (project.year)
    meta.push({
      icon: CalendarBlank,
      label: fr ? 'Année' : 'Year',
      value: project.year,
    });
  if (project.lieu)
    meta.push({ icon: MapPin, label: fr ? 'Lieu' : 'Site', value: project.lieu });
  if (project.ville)
    meta.push({ icon: MapPin, label: fr ? 'Ville' : 'City', value: project.ville });

  return (
    <div className="w-full bg-white text-ink">
      {/* 1. En-tête */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-10 sm:pt-14">
        <Link
          href={`/${locale}/projets`}
          className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand hover:underline"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden />
          {fr ? 'Tous nos projets' : 'All our projects'}
        </Link>
        {project.tags.length > 0 && (
          <p className="mt-4 text-[13px] font-semibold uppercase tracking-wide text-brand">
            {project.tags.join(' • ')}
          </p>
        )}
        <h1 className="mt-2 text-[28px] sm:text-[40px] leading-[1.2] font-semibold max-w-4xl">
          {project.title}
        </h1>
        {project.excerpt && (
          <p className="mt-4 text-[18px] leading-relaxed text-muted max-w-3xl">
            {project.excerpt}
          </p>
        )}

        {/* Méta : client, année, lieu, ville, service */}
        {(meta.length > 0 || project.serviceSlug) && (
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {meta.map((m) => (
              <div key={m.label} className="rounded-lg border border-slate-200 p-4">
                <dt className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-muted">
                  <m.icon size={16} weight="fill" className="text-brand" aria-hidden />
                  {m.label}
                </dt>
                <dd className="mt-1 text-[16px] font-semibold">{m.value}</dd>
              </div>
            ))}
            {project.serviceSlug && (
              <div className="rounded-lg border border-slate-200 p-4">
                <dt className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-muted">
                  <Wrench size={16} weight="fill" className="text-brand" aria-hidden />
                  {fr ? 'Service' : 'Service'}
                </dt>
                <dd className="mt-1 text-[16px] font-semibold">
                  <Link
                    href={`/${locale}/services/${project.serviceSlug}`}
                    className="text-brand hover:underline"
                  >
                    {project.serviceLabel || project.serviceSlug}
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>

      {/* 2. Image principale */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-8">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-neutral-200">
          <Image
            src={project.image}
            alt={project.imageAlt || project.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* 3. Description */}
      {project.description.length > 0 && (
        <div className="max-w-[960px] mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-12 space-y-4">
          {project.description.map((para, i) => (
            <p key={i} className="text-[16px] leading-[1.75] text-ink">
              {para}
            </p>
          ))}
        </div>
      )}

      {/* 4. Galerie images */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-12">
          <h2 className="text-[22px] sm:text-[24px] font-semibold">
            {fr ? 'Galerie du projet' : 'Project gallery'}
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {gallery.map((img, i) => (
              <div
                key={`${img.url}-${i}`}
                className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-neutral-200"
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${project.title} — ${fr ? 'photo' : 'photo'} ${i + 2}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Vidéos */}
      {project.videos.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-12">
          <h2 className="text-[22px] sm:text-[24px] font-semibold">
            {fr ? 'Vidéos du projet' : 'Project videos'}
          </h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {project.videos.map((video) => (
              <div key={video.url} className="space-y-2">
                {video.embedUrl ? (
                  <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
                    <iframe
                      src={video.embedUrl}
                      title={video.title || project.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                ) : video.kind === 'mp4' ? (
                  <video
                    src={video.url}
                    controls
                    preload="none"
                    className="w-full aspect-video rounded-lg bg-black"
                  />
                ) : (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-slate-200 p-5 text-[16px] font-semibold text-brand hover:border-brand transition-colors"
                  >
                    {video.title || video.url} <span aria-hidden>↗</span>
                  </a>
                )}
                {video.title && (video.embedUrl || video.kind === 'mp4') && (
                  <p className="text-[14px] text-muted">{video.title}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. LinkedIn */}
      {project.linkedinUrl && (
        <section className="w-full bg-surface">
          <div className="max-w-[960px] mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-[16px] font-semibold">
              {fr
                ? 'Ce projet a aussi été publié sur LinkedIn.'
                : 'This project was also published on LinkedIn.'}
            </p>
            <a
              href={project.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-hover transition-colors shrink-0"
            >
              <LinkedinLogo size={20} weight="fill" aria-hidden />
              {fr ? 'Voir sur LinkedIn' : 'View on LinkedIn'}
            </a>
          </div>
        </section>
      )}

      {/* 7. Autres projets */}
      {others.length > 0 && (
        <section className="bg-neutral-100 border-t border-slate-200 py-12 sm:py-14">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
            <h2 className="text-[24px] font-semibold mb-6 sm:text-[28px] sm:mb-8">
              {fr ? 'Autres réalisations' : 'More achievements'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {others.slice(0, 3).map((card) => (
                <ProjectCard key={card.id} project={card} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. CTA */}
      <section className="bg-brand text-white py-12 px-6 sm:py-14 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center items-stretch justify-between gap-6 md:gap-8">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-[26px] font-semibold text-white leading-tight sm:text-[32px]">
              {fr ? 'Un projet similaire ? Parlons-en.' : 'A similar project? Let’s talk.'}
            </h2>
            <p className="text-[16px] text-white leading-relaxed">
              {fr
                ? 'Visite technique puis devis détaillé sous 24 à 48h ouvrées.'
                : 'Site visit first, then a detailed quote within 24-48 business hours.'}
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-block w-full text-center bg-white text-brand font-semibold text-[16px] px-8 py-3.5 rounded-full shrink-0 sm:w-auto btn-sweep-white"
          >
            {fr ? 'Demander un devis' : 'Request a quote'}
          </Link>
        </div>
      </section>
    </div>
  );
}

export const dynamicParams = true;
