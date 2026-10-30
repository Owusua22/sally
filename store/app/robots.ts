// app/robots.ts
// Crawl budget: let bots reach shop content, keep account + app routes out.

import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Account, basket, checkout and API routes carry no public content.
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/cart',
          '/checkout',
          '/account',
          '/profile',
          '/orders',
          '/login',
          '/register',
        ],
      },
      // Facet and tracking parameters create near-duplicate URLs.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/*?sort=', '/*?view=', '/*?auth=', '/*?redirect='],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
