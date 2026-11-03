// components/AddtoCartButton.tsx
// Add-to-basket button used on product pages and showroom grids.
// Guests are sent to the sign-in / create-account dialog first — the cart API
// only accepts authenticated requests.

'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2, Check, Lock } from 'lucide-react';
import { useGuardedCart } from '@/hooks/useGuardedCart';
import type { CartItem } from '@/hooks/useCart';

interface AddToCartButtonProps {
  product: CartItem['product'];
  quantity?: number;
  selectedSize?: string | null;
  selectedColor?: string | null;
  className?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  selectedSize = null,
  selectedColor = null,
  className = '',
}: AddToCartButtonProps) {
  const { add } = useGuardedCart();
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleClick = async () => {
    if (status !== 'idle') return;
    setStatus('loading');

    const result = await add(product.id, quantity, selectedSize, selectedColor);

    if (result === 'added') {
      setStatus('done');
      setTimeout(() => setStatus('idle'), 1600);
      return;
    }

    setStatus('idle');
  };

  const isOutOfStock = product.stock_quantity < 1;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOutOfStock || status === 'loading'}
      className={`btn ${isOutOfStock ? 'btn-outline opacity-60' : 'btn-primary'} ${className}`}
      aria-label={
        isOutOfStock
          ? `${product.name} is out of stock`
          : `Add ${product.name} to basket`
      }
    >
      {status === 'loading' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : status === 'done' ? (
        <Check className="h-4 w-4" />
      ) : isOutOfStock ? (
        <Lock className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {isOutOfStock
        ? 'Out of stock'
        : status === 'loading'
          ? 'Adding…'
          : status === 'done'
            ? 'Added to basket'
            : 'Add to basket'}
    </button>
  );
}

export default AddToCartButton;
