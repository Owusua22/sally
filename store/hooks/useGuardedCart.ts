// hooks/useGuardedCart.ts
// Adding to the basket is a signed-in action: the server rejects anonymous
// writes to /api/cart with 401, so the storefront asks the shopper to sign in
// (or create an account) *before* the request is made.
//
// Usage:
//   const { add, isReady } = useGuardedCart();
//   await add(product.id, 1, size, colour);   // resolves to true when added

'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useAuthModal } from '@/stores/authModalStore';

export type AddResult = 'added' | 'auth-required' | 'blocked';

export function useGuardedCart() {
  const { isAuthenticated, isLoading } = useAuth();
  const { addToCart } = useCart();
  const openAuth = useAuthModal((state) => state.openAuth);
  const pathname = usePathname() ?? '/';

  const add = useCallback(
    async (
      productId: string,
      quantity = 1,
      size?: string | null,
      color?: string | null
    ): Promise<AddResult> => {
      // Wait until the session has been resolved before deciding.
      if (isLoading) return 'blocked';

      if (!isAuthenticated) {
        toast.info('Sign in or create an account to start your basket.', {
          toastId: 'auth-required-cart',
        });
        openAuth({ view: 'login', redirectTo: pathname });
        return 'auth-required';
      }

      await addToCart(productId, quantity, size ?? null, color ?? null);
      return 'added';
    },
    [addToCart, isAuthenticated, isLoading, openAuth, pathname]
  );

  return { add, isAuthenticated, isLoading, isReady: !isLoading };
}
