// app/sitemap.ts
// XML sitemap: every indexable URL with a last-modified date so crawlers can
// re-fetch only what changed.

import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { getCategories, getProducts } from '@/lib/data/store';
import { getBlogPosts } from '@/lib/data/blog';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, '');
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    {
      url: `${base}/location`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    {
      url: `${base}/policies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    { url: `${base}/sitemap`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const [categories, products, posts] = await Promise.all([
      getCategories(),
      getProducts({ limit: 1000 }),
      getBlogPosts({ limit: 200 }),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${base}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
