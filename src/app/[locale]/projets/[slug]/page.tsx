import { setRequestLocale } from 'next-intl/server';

export default async function ProjetDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-[#2c2c2c]">Détail du Projet : {slug}</h1>
    </div>
  );
}
