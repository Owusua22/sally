// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetails } from '@/components/products/ProductDetails';
import {
  getCategories,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/data/store';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  productSchema,
} from '@/lib/seo/jsonld';
import { PRODUCT_FAQS } from '@/lib/seo/content';
import { site } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

function howToSteps(howToUse: string | null | undefined): string[] {
  if (!howToUse) return [];

  return howToUse
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z])/)
    .map((step) => step.replace(/^\s*[-•\d.]+\s*/, '').trim())
    .filter((step) => step.length > 8)
    .slice(0, 8);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product not found', robots: { index: false, follow: true } };
  }

  const title = `${product.name}${product.brand ? ` — ${product.brand}` : ''}`;
  const description =
    product.short_description ||
    product.description?.slice(0, 155) ||
    `Buy ${product.name} from ${site.nameFull} in East Doboro, Nsawam. Authentic, sealed and delivered nationwide.`;
  const url = `/products/${product.slug}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand ?? '',
      product.category?.name ?? '',
      'buy in Ghana',
      'Nsawam',
      'East Doboro',
    ].filter(Boolean),
    alternates: { canonical: url },
    robots: product.is_active === false ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: product.thumbnail
        ? [{ url: product.thumbnail, alt: product.name }]
        : [{ url: '/opengraph-image' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.thumbnail ? [product.thumbnail] : ['/opengraph-image'],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  /**
   * Some catalogue rows carry a category_id without a joined category row (or
   * no category at all). Resolve the shelf from the categories list before
   * rendering, so the breadcrumb, the chip and "you may also like" always agree
   * with the product instead of silently disappearing.
   */
  const categories = await getCategories();
  const category =
    product.category ??
    categories.find((entry) => entry.id === product.category_id) ??
    null;

  const productWithCategory: typeof product = category
    ? { ...product, category }
    : product;

  const relatedProducts = await getRelatedProducts(productWithCategory, 4);

  const steps = howToSteps(product.how_to_use);

  return (
    <>
      <JsonLd
        id="product"
        data={[
          productSchema(productWithCategory),
          ...(steps.length > 0
            ? [
                howToSchema({
                  name: `How to use ${product.name}`,
                  steps,
                  url: `/products/${product.slug}`,
                }),
              ]
            : []),
          faqSchema(PRODUCT_FAQS),
          breadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Shop', href: '/products' },
            ...(category
              ? [{ name: category.name, href: `/categories/${category.slug}` }]
              : []),
            { name: product.name, href: `/products/${product.slug}` },
          ]),
        ]}
      />
      <ProductDetails
        product={productWithCategory}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
