// app/page.tsx — GlowMom homepage
import type { Metadata } from 'next';

import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { ProductSection } from '@/components/home/ProductSection';
import { ProductRail } from '@/components/home/ProductRail';
import {
  DealBanner,
  MarqueeStrip,
  PromoBands,
  ShopByStage,
  ValueStrip,
} from '@/components/home/PromoBands';
import {
  JournalPreview,
  NewsletterBand,
  PromiseBand,
  Testimonials,
} from '@/components/home/HomeSections';
import { getHomeData } from '@/lib/data/store';
import { getBlogPosts } from '@/lib/data/blog';
import { StoreSetupNotice } from '@/components/layout/StoreSetupNotice';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { checkDatabaseHealth } from '@/lib/supabase/health';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  localBusinessSchema,
} from '@/lib/seo/jsonld';
import { site } from '@/lib/site';
import { HOME_FAQS } from '@/lib/seo/content';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${site.nameFull} — Skincare, Body Care & Mother Care in Nsawam`,
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${site.nameFull} — Skincare, Body Care & Mother Care in Nsawam`,
    description: site.description,
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.nameFull} — Skincare, Body Care & Mother Care in Nsawam`,
    description: site.description,
  },
};

export default async function HomePage() {
  const { banners, categories, hotArrivals, topPicks, hotSellers, showrooms } =
    await getHomeData();
  const posts = await getBlogPosts({ limit: 3 }).catch(() => []);

  const deals = showrooms[0]?.products ?? [];

  // Connected but no tables yet: tell shoppers instead of showing an empty store.
  const database = isSupabaseConfigured ? await checkDatabaseHealth() : null;
  const awaitingCatalogue = Boolean(database?.configured && !database.initialized);

  return (
    <>
      <JsonLd
        id="home"
        data={[
          localBusinessSchema(),
          itemListSchema(topPicks, {
            name: 'Our top picks',
            url: '/products?sort=popular',
            description: `Bestselling skincare, hair care and baby care at ${site.name}.`,
          }),
          faqSchema(HOME_FAQS),
          breadcrumbSchema([{ name: 'Home', href: '/' }]),
        ]}
      />

      {awaitingCatalogue ? <StoreSetupNotice /> : null}

      <HeroBanner banners={banners} />
      <ValueStrip />
      <MarqueeStrip />
      <CategoryStrip categories={categories} />
      <ShopByStage />

      <ProductSection
        eyebrow="Just landed"
        title="Hot arrivals"
        subtitle="Fresh stock, loved by our customers"
        href="/products?sort=newest"
        hrefLabel="View more"
        products={hotArrivals.slice(0, 10)}
        columns="five"
      />

      <PromoBands />

      <ProductSection
        eyebrow="Save more"
        title="Mega deals"
        subtitle="More shopping, less spending"
        href="/products?deals=1"
        hrefLabel="All deals"
        products={deals.slice(0, 8)}
        columns="four"
      />

      <DealBanner />

      <ProductSection
        eyebrow="Hand-picked"
        title="Our top picks"
        subtitle="Tried, loved and highly rated"
        href="/products?sort=popular"
        hrefLabel="View more"
        products={topPicks.slice(0, 8)}
        tone="soft"
        columns="four"
      />

      <ProductRail
        eyebrow="Trending now"
        title="Hot sellers"
        subtitle="The items everyone is buying"
        href="/products?sort=popular"
        products={hotSellers.slice(0, 10)}
      />

      <PromiseBand />
      <Testimonials />
      <JournalPreview posts={posts} />
      <NewsletterBand />
    </>
  );
}
