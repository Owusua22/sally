// components/home/ProductSection.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  href?: string;
  hrefLabel?: string;
  products: Product[];
  columns?: 'grid' | 'five' | 'four';
  tone?: 'default' | 'soft';
}

export function ProductSection({
  title,
  subtitle,
  eyebrow,
  href = '/products',
  hrefLabel = 'View more',
  products,
  columns = 'grid',
  tone = 'default',
}: ProductSectionProps) {
  if (products.length === 0) return null;

  const gridClass =
    columns === 'five'
      ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5'
      : columns === 'four'
        ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'
        : 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4';

  return (
    <section
      className={`${tone === 'soft' ? 'bg-surface-soft py-12 sm:py-16' : 'pt-12 sm:pt-16'}`}
      aria-label={title}
    >
      <div className="container-page">
        <div className="section-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="section-title mt-1.5">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          <Link href={href} className="section-link">
            {hrefLabel} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className={gridClass}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
