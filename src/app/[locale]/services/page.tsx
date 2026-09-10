import { setRequestLocale } from 'next-intl/server';

export default async function ServicesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Nos Services</h1>
    </div>
  );
}
