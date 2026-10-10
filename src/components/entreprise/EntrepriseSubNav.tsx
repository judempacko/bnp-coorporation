import Link from 'next/link';

interface EntrepriseSubNavProps {
  locale: string;
  active: 'presentation' | 'equipe' | 'galerie';
  labels: { presentation: string; equipe: string; galerie: string };
}

export function EntrepriseSubNav({ locale, active, labels }: EntrepriseSubNavProps) {
  const items = [
    { key: 'presentation' as const, href: `/${locale}/qui-sommes-nous`, label: labels.presentation },
    { key: 'equipe' as const, href: `/${locale}/qui-sommes-nous#equipe`, label: labels.equipe },
    { key: 'galerie' as const, href: `/${locale}/galerie`, label: labels.galerie },
  ];

  return (
    <nav
      aria-label="Sous-navigation entreprise"
      className="sticky top-16 sm:top-[72px] z-30 bg-white/95 backdrop-blur border-b border-slate-200"
    >
      <div className="max-w-[1100px] mx-auto px-6 flex items-center gap-1 overflow-x-auto">
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`whitespace-nowrap px-4 py-3 text-[15px] font-semibold border-b-2 -mb-px transition-colors ${
                isActive
                  ? 'text-[#0A66C2] border-[#0A66C2]'
                  : 'text-[#2c2c2c] border-transparent hover:text-[#0A66C2]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
