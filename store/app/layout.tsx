// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

import { AppShell } from '@/components/layout/AppShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { Analytics, searchConsoleVerification } from '@/components/seo/Analytics';
import { organizationSchema, websiteSchema } from '@/lib/seo/jsonld';
import { site } from '@/lib/site';

const title = `${site.nameFull} — East Doboro, Nsawam | ${site.tagline}`;
const description = site.description;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.nameFull}`,
  },
  description,
  applicationName: site.nameFull,
  authors: [{ name: site.nameFull, url: site.url }],
  creator: site.nameFull,
  publisher: site.nameFull,
  category: 'shopping',
  keywords: [
    'skin care Ghana',
    'mother care Ghana',
    'body lotion Ghana',
    'Nivea Ghana',
    'Vaseline Ghana',
    "Johnson's baby Ghana",
    'face cream',
    'vitamin c serum',
    'shampoo and conditioner Ghana',
    'shower gel',
    'baby diapers',
    'baby lotion',
    'online shopping Ghana',
    'skincare shop East Doboro',
    'cosmetics shop Nsawam',
    'mothercare Nsawam',
    'baby products Doboro',
    'skincare near St. George’s Height',
  ],
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${site.url}/feed.xml` },
  },
  verification: {
    google: searchConsoleVerification(),
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.nameFull,
    title: `${site.name} | ${site.tagline}`,
    description,
    locale: 'en_GH',
    countryName: 'Ghana',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${site.nameFull} — skincare and mother care in East Doboro, Nsawam`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | ${site.tagline}`,
    description,
    images: ['/opengraph-image'],
  },
  formatDetection: { telephone: true, address: true, email: true },
  other: {
    'geo.region': 'GH-EP',
    'geo.placename': 'East Doboro, Nsawam, Eastern Region, Ghana',
    'og:price:currency': 'GHS',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#49383D' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-GH" data-scroll-behavior="smooth">
      <body className="antialiased bg-blush text-ink font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-blush"
        >
          Skip to content
        </a>
        <JsonLd id="site" data={[organizationSchema(), websiteSchema()]} />
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
