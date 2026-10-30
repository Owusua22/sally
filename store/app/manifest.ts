// app/manifest.ts — web app manifest (installable storefront + Android icon).

import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nameFull,
    short_name: site.shortName,
    description: site.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFF8F5',
    theme_color: '#FBDCE2',
    lang: 'en-GH',
    dir: 'ltr',
    categories: ['shopping', 'health', 'beauty'],
    icons: [
      { src: '/icon', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Shop all products', url: '/products' },
      { name: 'Track my order', url: '/orders' },
    ],
  };
}
