import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getAllServices, getAllPosts } from '@/lib/api';
import { getGalleryEvents } from '@/lib/gallery';
import { getTeam } from '@/lib/team';

const FALLBACK_SERVICE_SLUGS = [
  'securite-incendie',
  'construction-btp',
  'forage-et-eau',
  'energies-renouvelables',
  'drones-imagerie-aerienne',
  'reparation-navale',
  'nettoyage-industriel',
];

const STATIC_PATHS = [
  '',
  '/bnp-coorporation-sarl-bnpc',
  '/services',
  '/projets',
  '/actualites',
  '/qui-sommes-nous',
  '/galerie',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ['fr', 'en']) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : path === '/services' ? 0.9 : 0.7,
        alternates: {
          languages: {
            fr: `${SITE_URL}/fr${path}`,
            en: `${SITE_URL}/en${path}`,
            'x-default': `${SITE_URL}/fr${path}`,
          },
        },
      });
    }

    // Services (money pages — highest SEO value)
    let serviceSlugs = FALLBACK_SERVICE_SLUGS;
    try {
      const services = await getAllServices(locale);
      if (services.length > 0) serviceSlugs = services.map((s) => s.slug);
    } catch {
      // fallback silencieux — le sitemap ne doit jamais casser le build
    }
    for (const slug of serviceSlugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/services/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            fr: `${SITE_URL}/fr/services/${slug}`,
            en: `${SITE_URL}/en/services/${slug}`,
          },
        },
      });
    }

    // Actualités
    try {
      const posts = await getAllPosts();
      for (const post of posts.slice(0, 100)) {
        entries.push({
          url: `${SITE_URL}/${locale}/actualites/${post.slug}`,
          lastModified: post.date ? new Date(post.date) : now,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    } catch {
      // fallback silencieux
    }

    // Galerie
    try {
      const events = await getGalleryEvents(locale);
      for (const event of events.slice(0, 100)) {
        entries.push({
          url: `${SITE_URL}/${locale}/galerie/${event.slug}`,
          lastModified: event.date ? new Date(event.date) : now,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      }
    } catch {
      // fallback silencieux
    }

    // Équipe
    try {
      const members = await getTeam(locale);
      for (const member of members.slice(0, 100)) {
        entries.push({
          url: `${SITE_URL}/${locale}/qui-sommes-nous/${member.slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      }
    } catch {
      // fallback silencieux
    }
  }

  return entries;
}
