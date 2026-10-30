// app/cart/page.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Loader2, Lock, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/stores/authModalStore';
import { CartItem } from '@/components/cart/CartItem';
import { formatCedis } from '@/lib/utils';
import { site } from '@/lib/site';

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart, canCheckout, isSyncing } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const openAuth = useAuthModal((state) => state.openAuth);

  const deliveryFree = totalPrice >= site.freeDeliveryThreshold;

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-md rounded-[28px] border border-line bg-surface p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-card text-accent-deep">
            <Lock className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-[24px] font-bold text-ink">
            Sign in to see your basket
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Your basket is saved to your account, so you can pick up where you left off on
            any device. Creating an account takes about 20 seconds.
          </p>
          <div className="mt-6 grid gap-2.5">
            <button
              type="button"
              onClick={() => openAuth({ view: 'login', redirectTo: '/cart' })}
              className="btn btn-primary btn-lg btn-block"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => openAuth({ view: 'register', redirectTo: '/cart' })}
              className="btn btn-outline btn-lg btn-block"
            >
              Create an account
            </button>
          </div>
          <Link
            href="/products"
            className="mt-5 inline-block text-[12.5px] font-bold text-accent-deep hover:underline"
          >
            Keep browsing instead
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-10">
      <header>
        <p className="eyebrow">Your basket</p>
        <h1 className="mt-2 font-display text-[28px] font-bold leading-tight text-ink sm:text-[34px]">
          Shopping basket
        </h1>
        <p className="mt-1.5 text-[13px] text-muted">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} · {formatCedis(totalPrice)}
          {isSyncing && <span className="ml-2 text-accent-deep">updating…</span>}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-[28px] border border-line bg-surface px-6 py-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-card text-accent">
            <ShoppingBag className="h-9 w-9" />
          </span>
          <h2 className="mt-5 font-display text-[20px] font-bold text-ink">
            Your basket is empty
          </h2>
          <p className="mt-1.5 max-w-sm text-[13px] text-muted">
            Browse body lotions, serums, hair care and baby essentials to get started.
          </p>
          <Link href="/products" className="btn btn-primary btn-lg mt-6">
            Start shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div>
            <div className="space-y-2.5">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Link
                href="/products"
                className="text-[12.5px] font-bold text-accent-deep hover:underline"
              >
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={() => void clearCart()}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted transition-colors hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear basket
              </button>
            </div>
          </div>

          <aside className="h-fit rounded-[26px] border border-line bg-surface p-5 lg:sticky lg:top-28">
            <h2 className="font-display text-[18px] font-bold text-ink">Order summary</h2>

            <dl className="mt-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-bold text-ink">{formatCedis(totalPrice)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="font-bold text-success">
                  {deliveryFree ? 'Free' : 'From GH₵25'}
                </dd>
              </div>
              <div className="flex items-end justify-between border-t border-line pt-3">
                <dt className="text-[13px] font-bold text-ink">Total</dt>
                <dd className="font-display text-[24px] font-bold leading-none text-ink">
                  {formatCedis(totalPrice)}
                </dd>
              </div>
            </dl>

            {!deliveryFree && (
              <p className="mt-3 rounded-2xl bg-card px-3.5 py-2.5 text-[11.5px] font-semibold text-accent-deep">
                Add {formatCedis(site.freeDeliveryThreshold - totalPrice)} more for free
                delivery.
              </p>
            )}

            <Link
              href={canCheckout ? '/checkout' : '#'}
              aria-disabled={!canCheckout}
              className={`btn btn-primary btn-lg btn-block mt-5 ${
                canCheckout ? '' : 'pointer-events-none opacity-50'
              }`}
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-3 text-center text-[11px] text-muted">
              Pay on delivery · MoMo · Card
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
