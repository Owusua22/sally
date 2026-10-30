// components/home/ProductRail.tsx
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

interface ProductRailProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  href?: string;
  products: Product[];
}

export function ProductRail({
  title,
  subtitle,
  eyebrow,
  href = '/products',
  products,
}: ProductRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="pt-12 sm:pt-16" aria-label={title}>
      <div className="container-page">
        <div className="section-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="section-title mt-1.5">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 sm:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-primary hover:bg-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Scroll right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-primary hover:bg-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <Link href={href} className="section-link">
              View more <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:gap-4 sm:px-6 lg:px-10"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[154px] shrink-0 snap-start sm:w-[192px] lg:w-[216px]"
          >
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
