import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold text-slate-900">Page introuvable</h1>
      <p className="mt-4 text-slate-600">
        La ressource demandée n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/fr"
        className="mt-8 inline-flex items-center justify-center bg-[#0A66C2] text-white font-semibold px-6 py-3 rounded-full"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
