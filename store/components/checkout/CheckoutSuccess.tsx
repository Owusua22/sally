// components/checkout/CheckoutSuccess.tsx
import Link from 'next/link';
import { CheckCircle2, Clock, Package, ShoppingBag } from 'lucide-react';
import { formatCedis } from '@/lib/utils';
import type { CheckoutController } from '@/hooks/useCheckout';

export function CheckoutSuccess({ c }: { c: CheckoutController }) {
  return (
    <div className="container-page flex min-h-[75vh] items-center justify-center py-12">
      <div className="w-full max-w-lg rounded-[30px] border border-line bg-surface p-7 text-center shadow-[0_24px_60px_-40px_rgba(73,56,61,0.6)] sm:p-10">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-ink">
          <CheckCircle2 className="h-10 w-10" />
        </span>

        <h1 className="mt-6 font-display text-[26px] font-bold text-ink sm:text-[30px]">
          Thank you — your order is in
        </h1>
        <p className="mx-auto mt-2.5 max-w-sm text-[13.5px] leading-relaxed text-muted">
          We have received your order and will call or WhatsApp you shortly to confirm
          payment and delivery.
        </p>

        <div className="mt-6 rounded-2xl border border-line bg-blush p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-accent-deep">
            Order number
          </p>
          <p className="mt-1 font-display text-[22px] font-bold tracking-tight text-ink">
            {c.orderNumber}
          </p>
        </div>

        {c.activeShippingZone && (
          <p className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted">
            <Clock className="h-4 w-4 text-accent" />
            Estimated delivery: {c.activeShippingZone.estimated_days_min}–
            {c.activeShippingZone.estimated_days_max} business days
          </p>
        )}

        <div className="mt-8 grid gap-2.5">
          <Link href="/orders" className="btn btn-primary btn-lg btn-block">
            <Package className="h-4 w-4" />
            Track my order
          </Link>
          <Link href="/products" className="btn btn-outline btn-lg btn-block">
            <ShoppingBag className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        {c.orderTotal > 0 && (
          <p className="mt-5 text-[11.5px] text-muted">
            Order total: <span className="font-bold text-ink">{formatCedis(c.orderTotal)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
