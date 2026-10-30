// components/home/CategoryStrip.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { DemoCategory } from '@/lib/demo/catalog';

interface CategoryStripProps {
  categories: DemoCategory[];
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  if (categories.length === 0) return null;

  return (
    <section className="container-page section-y" aria-label="Shop by category">
      <div className="section-head">
        <div>
          <p className="eyebrow">Shop by category</p>
          <h2 className="section-title mt-1.5">Find your routine</h2>
        </div>
        <Link href="/products" className="section-link">
          All products <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="hide-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2 sm:gap-7">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group flex w-[86px] shrink-0 flex-col items-center sm:w-[112px]"
          >
            <span className="relative flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-full border border-line bg-surface shadow-sm transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_10px_24px_-8px_rgba(166,107,120,0.55)] sm:h-[112px] sm:w-[112px]">
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  sizes="112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <span className="text-3xl">{category.icon ?? '🧴'}</span>
              )}
            </span>
            <span className="mt-2.5 line-clamp-2 text-center text-[11.5px] font-semibold leading-tight text-ink transition-colors group-hover:text-accent-deep sm:text-[13px]">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
