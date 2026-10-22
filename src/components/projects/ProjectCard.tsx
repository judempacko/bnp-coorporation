import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
  locale: string;
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const fr = locale !== 'en';
  const href = `/${locale}${project.href}`;
  const location = project.ville || project.lieu;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-brand transition-colors"
    >
      <div className="relative w-full h-52 bg-neutral-200 overflow-hidden">
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-2.5 sm:space-y-3">
        <h3 className="text-[20px] sm:text-[24px] leading-[1.3] font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2">
          {project.title}
        </h3>
        {project.excerpt && (
          <p className="text-[16px] leading-[1.7] text-muted line-clamp-2">
            {project.excerpt}
          </p>
        )}
        {(location || project.year) && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[15px] leading-snug font-medium text-neutral-600">
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={17} weight="fill" className="shrink-0 text-brand" aria-hidden />
                {location}
              </span>
            )}
            {location && project.year && (
              <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
            )}
            {project.year && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarBlank size={17} weight="fill" className="shrink-0 text-brand" aria-hidden />
                {project.year}
              </span>
            )}
          </p>
        )}
        <span className="mt-auto w-fit inline-flex items-center rounded-full bg-brand px-4 py-2 text-[14px] font-semibold text-white transition-colors group-hover:bg-brand-hover">
          {fr ? 'Voir le projet' : 'View project'}
        </span>
      </div>
    </Link>
  );
}
