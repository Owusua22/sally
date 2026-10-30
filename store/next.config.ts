// next.config.ts
import type { NextConfig } from 'next';

/**
 * Image hosts are derived from the environment so uploaded product photos from
 * Cloudflare R2 (bucket: glow-up) and Supabase storage always render.
 */
function hostsFromEnv(): string[] {
  const hosts = new Set<string>();

  const add = (value?: string) => {
    if (!value) return;
    try {
      const url = new URL(value.startsWith('http') ? value : `https://${value}`);
      hosts.add(url.hostname);
    } catch {
      // ignore malformed values
    }
  };

  add(process.env.CLOUDFLARE_R2_PUBLIC_URL);
  add(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return [...hosts];
}

const staticHosts = [
  'images.unsplash.com',
  '*.r2.cloudflarestorage.com',
  '*.r2.dev',
  '*.supabase.co',
];

const envHosts = hostsFromEnv();

/**
 * Category slugs that changed when the catalogue was reorganised. Old links
 * (and any backlinks pointing at them) 308 to the live category instead of
 * 404-ing, so no link equity is lost. Mirrors LEGACY_CATEGORY_SLUGS in
 * lib/site.ts — Next.js cannot read path aliases from this file.
 */
const LEGACY_CATEGORY_REDIRECTS: Record<string, string> = {
  'body-lotions': 'bath-body-care',
  'shower-gels': 'bath-body-care',
  'face-care': 'facial-skincare',
  'face-wash': 'facial-skincare',
  'serums-oils': 'facial-skincare',
  'sun-care': 'facial-skincare',
  shampoos: 'haircare',
  conditioners: 'haircare',
  'hair-care': 'haircare',
  'mother-care': 'mothercare-pregnancy',
  'baby-care': 'baby-care-essentials',
  deals: 'bundles-offers',
  offers: 'bundles-offers',
};

const nextConfig: NextConfig = {
  images: {
    // Remote hosts used by the admin (Cloudflare R2 public URL, Supabase storage)
    remotePatterns: [...new Set([...staticHosts, ...envHosts])].map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
    // Local dev over http://localhost still needs to serve public/images
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  async redirects() {
    return Object.entries(LEGACY_CATEGORY_REDIRECTS).map(([from, to]) => ({
      source: `/categories/${from}`,
      destination: `/categories/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
