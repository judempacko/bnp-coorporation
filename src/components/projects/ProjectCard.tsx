import Link from 'next/link';
import Image from 'next/image';
import { LinkedinLogo } from '@phosphor-icons/react/dist/ssr';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
  locale: string;
}

/**
 * Carte projet (accueil, listing, autres projets) : image 16/10, tags,
 * titre, extrait, méta ville • année, lien fiche + LinkedIn si présent.
 */
export function ProjectCard({ project, locale }: ProjectCardProps) {
  const fr = locale !== 'en';
  const href = `/${locale}${project.href}`;
  const meta = [project.ville, project.year].filter(Boolean).join(' • ');

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-[#0A66C2] hover:shadow-lg transition-all">
      <Link
        href={href}
        className="relative block w-full aspect-[16/10] bg-neutral-200 overflow-hidden"
        aria-label={project.title}
      >
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {project.tags.length > 0 && (
          <p className="text-[13px] font-semibold text-[#0A66C2]">
            {project.tags.join(', ')}
          </p>
        )}
        <h3 className="mt-1.5 text-[20px] leading-snug font-semibold text-[#2c2c2c] group-hover:text-[#0A66C2] transition-colors">
          <Link href={href}>{project.title}</Link>
        </h3>
        {project.excerpt && (
          <p className="mt-2 text-[15px] leading-relaxed text-[#51565d] line-clamp-3">
            {project.excerpt}
          </p>
        )}
        {meta && (
          <p className="mt-2 text-[13px] font-medium text-[#51565d]">{meta}</p>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#0A66C2] hover:underline"
          >
            {fr ? 'Lire la suite' : 'Read more'}
            <span aria-hidden>→</span>
          </Link>
          {project.linkedinUrl && (
            <a
              href={project.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={fr ? `Voir ce projet sur LinkedIn : ${project.title}` : `See this project on LinkedIn: ${project.title}`}
              title="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#0A66C2] hover:border-[#0A66C2] hover:bg-blue-50 transition-colors"
            >
              <LinkedinLogo size={18} weight="fill" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
