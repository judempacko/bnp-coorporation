import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const nextConfig: NextConfig = {
  // Autorise le test sur téléphone réel via IP locale (HMR + refresh).
  // Si ton IP change, remplace-la ici et redémarre `npm run dev`.
  allowedDevOrigins: ['192.168.100.5'],
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/:locale(fr|en)/bnp-coorporation-sarl-bnpc',
        destination: '/:locale',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.bnp-coorporation.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
