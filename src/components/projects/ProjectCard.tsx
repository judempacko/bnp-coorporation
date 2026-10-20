import Link from 'next/link';
import Image from 'next/image';
import { LinkedinLogo } from '@phosphor-icons/react/dist/ssr';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
  locale: string;
}

/**
 * Carte projet signature « black + accent » (réf. Nisoz adaptée charte BNPC) :
 * corps noir #14181d, photo légèrement désaturée qui s'anime au survol,
 * bouton bleu rounded sous le titre = seul CTA. Titre blanc,
 * excerpt court, méta discrète. Zéro pavé, zéro double lien.
 */
export function ProjectCard({ project, locale }: ProjectCardProps) {
  const fr = locale !== 'en';
  const href = `/${locale}${project.href}`;
  const meta = [project.ville, project.year].filter(Boolean).join(' • ');

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-coal transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={href}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-neutral-800"
        aria-label={project.title}
      >
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover saturate-[.8] transition-all duration-700 ease-out group-hover:scale-105 group-hover:saturate-100"
        />
      </Link>

      <div className="relative flex flex-1 flex-col p-5">
        {project.tags.length > 0 && (
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-blue-300">
            {project.tags.join(' • ')}
          </p>
        )}
        <h3 className="mt-2 text-[19px] font-semibold leading-snug text-white transition-colors group-hover:text-blue-200">
          <Link href={href}>{project.title}</Link>
        </h3>
        <Link
          href={href}
          aria-label={`${fr ? 'Voir le projet' : 'View project'} : ${project.title}`}
          className="mt-3 inline-flex w-fit items-center rounded-full bg-brand px-4 py-2 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-brand-hover"
        >
          {fr ? 'Voir le projet' : 'View project'}
        </Link>
        {project.excerpt && (
          <p className="mt-2 text-[14px] leading-relaxed text-white/70 line-clamp-2">
            {project.excerpt}
          </p>
        )}
        <div className="mt-auto pt-4">
          {meta && (
            <p className="truncate text-[13px] font-medium text-white/50">{meta}</p>
          )}
          {project.linkedinUrl && (
            <a
              href={project.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={fr ? `Voir ce projet sur LinkedIn : ${project.title}` : `See this project on LinkedIn: ${project.title}`}
              title="LinkedIn"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white"
            >
              <LinkedinLogo size={16} weight="fill" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
