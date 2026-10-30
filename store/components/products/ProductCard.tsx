// components/products/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, Loader2, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { formatCedis, metaNumber, metaString } from '@/lib/utils';
import { useGuardedCart } from '@/hooks/useGuardedCart';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { add } = useGuardedCart();
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) / product.compare_at_price) * 100
        )
      : null;

  const categoryName =
    typeof product.category === 'string'
      ? product.category
      : product.category?.name ?? '';

  const rating = product.rating ?? metaNumber(product.metadata, 'rating', 4.8);
  const reviews = product.reviews_count ?? metaNumber(product.metadata, 'reviews', 0);
  const sold = product.sold_count ?? metaNumber(product.metadata, 'sold', 0);
  const badge = metaString(product.metadata, 'badge');

  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock || status !== 'idle') return;

    const firstOption = product.sizes?.[0] ?? null;

    setStatus('loading');
    try {
      const result = await add(product.id, 1, firstOption, null);
      if (result === 'added') {
        setStatus('done');
        setTimeout(() => setStatus('idle'), 1600);
        return;
      }
      setStatus('idle');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group"
      aria-label={product.name}
    >
      <div className="product-card__media">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-accent/30">
            <ShoppingBag className="h-10 w-10" strokeWidth={1.2} />
          </div>
        )}

        {/* discount */}
        {discount ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-extrabold text-blush">
            −{discount}%
          </span>
        ) : badge ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blush">
            {badge}
          </span>
        ) : null}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/45 backdrop-blur-[1px]">
            <span className="rounded-full bg-surface px-3.5 py-1.5 text-[11px] font-bold text-ink">
              Sold out
            </span>
          </div>
        )}

        {/* quick add */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={status !== 'idle'}
            className={`absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-200 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 ${
              status === 'done'
                ? 'bg-success text-white'
                : 'bg-surface text-ink hover:bg-primary'
            }`}
            aria-label={`Add ${product.name} to basket`}
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === 'done' ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        {(product.brand || categoryName) && (
          <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
            {product.brand ?? categoryName}
          </p>
        )}

        <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-[1.4] text-ink">
          {product.name}
        </h3>

        {/* The rail passes `compact`: keep those cards to name + price only. */}
        {!compact ? (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted">
            <span className="flex items-center gap-0.5 text-warning">
              <Star className="h-3 w-3 fill-current" />
              <span className="font-bold text-ink">{rating.toFixed(1)}</span>
            </span>
            {reviews > 0 && <span>({reviews})</span>}
            {sold > 0 && (
              <>
                <span className="text-accent/50">·</span>
                <span>{sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold} sold</span>
              </>
            )}
          </div>
        ) : null}

        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-[16px] font-extrabold tracking-tight text-ink">
            {formatCedis(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-[11.5px] text-muted line-through">
              {formatCedis(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
