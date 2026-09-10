import { setRequestLocale } from 'next-intl/server';

export default async function EquipePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Notre Équipe</h1>
    </div>
  );
}
