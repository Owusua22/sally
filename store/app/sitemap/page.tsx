// app/sitemap/page.tsx
// Human-readable sitemap. Crawlers get /sitemap.xml (app/sitemap.ts); this page
// helps shoppers — and gives every indexable URL one more internal link.

import type { Metadata } from 'next';
import Link from 'next/link';

import { getCategories, getProducts } from '@/lib/data/store';
import { getBlogPosts } from '@/lib/data/blog';
import { getPublicShippingZones } from '@/lib/data/shipping';
import { NAV_CATEGORIES, site } from '@/lib/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Sitemap',
  description: `Every page on ${site.nameFull}: shop categories, products, journal articles, delivery areas and account pages.`,
  alternates: { canonical: '/sitemap' },
};

const STATIC_PAGES = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All products' },
  { href: '/location', label: 'Shop location & delivery areas' },
  { href: '/about', label: 'About us' },
  { href: '/blog', label: 'Skincare journal' },
  { href: '/contact', label: 'Contact' },
  { href: '/policies', label: 'Delivery, payment & returns policies' },
  { href: '/terms', label: 'Terms & conditions' },
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/orders', label: 'Track an order' },
  { href: '/account', label: 'My account' },
];

export default async function SitemapPage() {
  const [categories, products, posts, zones] = await Promise.all([
    getCategories(),
    getProducts({ limit: 500 }),
    getBlogPosts({ limit: 100 }),
    getPublicShippingZones(),
  ]);

  const productsByCategory = NAV_CATEGORIES.map((category) => ({
    ...category,
    items: products.filter((product) => product.category?.slug === category.slug),
  }));

  const unmatched = products.filter(
    (product) => !NAV_CATEGORIES.some((c) => c.slug === product.category?.slug)
  );

  return (
    <div className="container-page py-8 sm:py-12">
      <header className="max-w-3xl">
        <p className="eyebrow">Sitemap</p>
        <h1 className="mt-2 font-display text-[30px] font-bold leading-tight text-ink sm:text-[38px]">
          Every page on {site.name}
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          Looking for something specific? {products.length} products,{' '}
          {categories.length} categories, {posts.length} journal articles and{' '}
          {zones.length} delivery towns are listed below.
        </p>
      </header>

      <nav className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Sitemap">
        <section className="rounded-[26px] border border-line bg-surface p-6">
          <h2 className="font-display text-[18px] font-bold text-ink">Main pages</h2>
          <ul className="mt-3 space-y-2">
            {STATIC_PAGES.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-[13px] text-muted transition-colors hover:text-accent-deep"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[26px] border border-line bg-surface p-6">
          <h2 className="font-display text-[18px] font-bold text-ink">Journal</h2>
          <ul className="mt-3 space-y-2">
            {posts.length === 0 ? (
              <li className="text-[13px] text-muted">No articles published yet.</li>
            ) : (
              posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[13px] text-muted transition-colors hover:text-accent-deep"
                  >
                    {post.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        {productsByCategory
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <section
              key={group.slug}
              className="rounded-[26px] border border-line bg-surface p-6"
            >
              <h2 className="font-display text-[18px] font-bold text-ink">
                <Link href={`/categories/${group.slug}`} className="hover:text-accent-deep">
                  {group.name}
                </Link>
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {group.items.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-[12.5px] text-muted transition-colors hover:text-accent-deep"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

        {unmatched.length > 0 && (
          <section className="rounded-[26px] border border-line bg-surface p-6">
            <h2 className="font-display text-[18px] font-bold text-ink">More products</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {unmatched.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[12.5px] text-muted transition-colors hover:text-accent-deep"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-[26px] border border-line bg-surface p-6">
          <h2 className="font-display text-[18px] font-bold text-ink">
            <Link href="/location" className="hover:text-accent-deep">
              Delivery towns
            </Link>
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {zones.map((zone) => (
              <li key={zone.id} className="text-[12.5px] text-muted">
                {zone.town}
                <span className="text-accent/60"> · {zone.region}</span>
              </li>
            ))}
          </ul>
        </section>
      </nav>
    </div>
  );
}
