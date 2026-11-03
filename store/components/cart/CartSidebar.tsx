// components/cart/CartSidebar.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle, ArrowRight, Loader2, Lock, ShoppingBag, Truck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/stores/authModalStore';
import { formatCedis } from '@/lib/utils';
import { site } from '@/lib/site';
import { CartItem } from './CartItem';

export function CartSidebar() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    isLoading,
    isSyncing,
    canCheckout,
    checkoutIssues,
    clearCart,
    fetchCart,
    toggleCart,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const openAuth = useAuthModal((state) => state.openAuth);
  const router = useRouter();

  const hasCheckoutIssues = checkoutIssues.length > 0;
  const checkoutDisabled = isLoading || isSyncing || items.length === 0;
  const qualifiesForFreeDelivery = totalPrice >= site.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, site.freeDeliveryThreshold - totalPrice);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) toggleCart();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, toggleCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    if (isLoading || isSyncing) return;

    // Guests must have an account before they can order.
    if (!isAuthenticated) {
      toggleCart();
      toast.info('Sign in or create an account to check out.', {
        toastId: 'auth-required-checkout',
      });
      openAuth({ view: 'login', redirectTo: '/checkout' });
      return;
    }

    if (!canCheckout) {
      toast.error(checkoutIssues[0]?.reason || 'Remove unavailable items before checkout.');
      return;
    }

    await fetchCart();

    const latestCart = useCart.getState();
    if (!latestCart.canCheckout) {
      toast.error(
        latestCart.checkoutIssues[0]?.reason || 'Remove unavailable items before checkout.'
      );
      return;
    }

    if (latestCart.isOpen) latestCart.toggleCart();
    router.push('/checkout');
  };

  const showSpinner = isLoading && items.length === 0;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-ink/50 backdrop-blur-sm"
          onClick={toggleCart}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[60] flex h-full w-full flex-col bg-blush shadow-2xl transition-transform duration-300 sm:w-[410px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping basket"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-nav px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink text-blush">
              <ShoppingBag className="h-4.5 w-4.5" />
            </span>
            <h2 className="text-[15px] font-extrabold text-ink">
              Your basket
              <span className="ml-1.5 text-[12px] font-semibold text-ink/60">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            </h2>
            {isSyncing && <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />}
          </div>

          <button
            type="button"
            onClick={toggleCart}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-card"
            aria-label="Close basket"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Free delivery progress */}
        {items.length > 0 && (
          <div className="border-b border-line bg-card/70 px-5 py-3">
            <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-accent-deep">
              <Truck className="h-3.5 w-3.5" />
              {qualifiesForFreeDelivery
                ? 'You qualify for free delivery!'
                : `Add ${formatCedis(remainingForFreeDelivery)} more for free delivery`}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min(100, (totalPrice / site.freeDeliveryThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
          {showSpinner ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-[12.5px]">Loading your basket…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-accent">
                <ShoppingBag className="h-8 w-8" />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-ink">Your basket is empty</p>
                <p className="mt-0.5 text-[11.5px] text-muted">
                  Add a few skincare favourites to get started.
                </p>
              </div>
              <button type="button" onClick={toggleCart} className="btn btn-primary">
                Start shopping
              </button>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="space-y-3 border-t border-line bg-surface p-5">
            {hasCheckoutIssues && (
              <div className="flex items-start gap-2 rounded-2xl bg-warning-soft p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-[11.5px] leading-snug text-ink/80">
                  {checkoutIssues[0]?.reason}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between text-[12.5px] text-muted">
                <span>Subtotal</span>
                <span className="font-bold text-ink">{formatCedis(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-[12.5px] text-muted">
                <span>Delivery</span>
                <span className="font-bold text-success">
                  {qualifiesForFreeDelivery ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="flex items-end justify-between border-t border-line pt-2.5">
                <span className="text-[13px] font-bold text-ink">Total</span>
                <span className="font-display text-[22px] font-bold leading-none text-ink">
                  {formatCedis(totalPrice)}
                </span>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => void handleCheckout()}
                disabled={checkoutDisabled}
                className="btn btn-primary btn-lg btn-block"
              >
                {isSyncing ? (
                  <>
                    Checking basket <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : hasCheckoutIssues ? (
                  <>
                    Fix items to checkout <AlertTriangle className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Proceed to checkout <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  toggleCart();
                  openAuth({ view: 'login', redirectTo: '/checkout' });
                }}
                className="btn btn-primary btn-lg btn-block"
              >
                <Lock className="h-4 w-4" />
                Sign in to checkout
              </button>
            )}

            <button
              type="button"
              onClick={() => void clearCart()}
              disabled={isLoading || isSyncing}
              className="w-full text-[11.5px] font-semibold text-muted transition-colors hover:text-danger disabled:opacity-50"
            >
              Clear basket
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
