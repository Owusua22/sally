// components/checkout/OrderSummary.tsx
'use client';

import Image from 'next/image';
import { Clock, Loader2, Package, Tag, Truck, X } from 'lucide-react';
import { cn, formatCedis } from '@/lib/utils';
import type { CheckoutController } from '@/hooks/useCheckout';

export function OrderSummary({ c }: { c: CheckoutController }) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-line bg-surface shadow-[0_18px_40px_-34px_rgba(73,56,61,0.6)]">
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-line p-5">
        <div>
          <h2 className="font-display text-[18px] font-bold text-ink">Order summary</h2>
          <p className="mt-0.5 text-[12px] text-muted">
            {c.totalItems} {c.totalItems === 1 ? 'item' : 'items'} in your basket
          </p>
        </div>
        {c.isSyncing && <Loader2 className="h-5 w-5 animate-spin text-accent" />}
      </div>

      {/* items */}
      <div className="max-h-[320px] overflow-y-auto p-4">
        <ul className="space-y-2.5">
          {c.items.map((item) => {
            const issue = c.checkoutIssues.find((entry) => entry.itemId === item.id);

            return (
              <li
                key={item.id}
                className={cn(
                  'flex gap-3 rounded-2xl border p-3',
                  issue ? 'border-danger/25 bg-danger-soft' : 'border-line bg-surface-soft'
                )}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                  {item.product.thumbnail ? (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className={cn('object-cover', issue && 'opacity-60 grayscale')}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-accent/40">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[12.5px] font-bold leading-snug text-ink">
                    {item.product.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                    <span className="rounded-full bg-surface px-2 py-0.5 font-semibold">
                      Qty {item.quantity}
                    </span>
                    {item.selected_size && (
                      <span className="rounded-full bg-surface px-2 py-0.5 font-semibold">
                        {item.selected_size}
                      </span>
                    )}
                    {item.selected_color && (
                      <span className="rounded-full bg-surface px-2 py-0.5 font-semibold">
                        {item.selected_color}
                      </span>
                    )}
                  </div>
                  {issue && (
                    <p className="mt-1 text-[11px] font-semibold text-danger">{issue.reason}</p>
                  )}
                </div>

                <p className="shrink-0 text-[12.5px] font-extrabold text-ink">
                  {formatCedis(item.product.price * item.quantity)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* totals */}
      <div className="border-t border-line p-5">
        {/* discount code */}
        <div className="mb-5">
          {c.activeDiscount ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-success/25 bg-success-soft px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-mono text-[12.5px] font-bold text-ink">
                  {c.activeDiscount.code}
                </p>
                <p className="text-[11.5px] font-semibold text-success">
                  {c.activeDiscount.discount_type === 'free_shipping'
                    ? 'Free shipping applied'
                    : c.activeDiscount.discount_type === 'percentage'
                      ? `${c.activeDiscount.discount_value}% off`
                      : `${formatCedis(c.activeDiscount.discount_value)} off`}
                </p>
              </div>
              <button
                type="button"
                onClick={c.handleRemoveCode}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-success transition-colors hover:bg-success/10"
                aria-label="Remove discount code"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={c.discountCode}
                onChange={(event) => c.setDiscountCode(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void c.handleApplyCode();
                  }
                }}
                placeholder="Discount code"
                aria-label="Discount code"
                className="field-input min-w-0 flex-1 rounded-full uppercase"
              />
              <button
                type="button"
                onClick={() => void c.handleApplyCode()}
                disabled={c.isValidatingCode || !c.discountCode.trim()}
                className="btn btn-dark shrink-0 px-5"
              >
                {c.isValidatingCode ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          )}
        </div>

        <dl className="space-y-2.5 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-bold text-ink">{formatCedis(c.totalPrice)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="inline-flex items-center gap-1.5 text-muted">
              <Truck className="h-3.5 w-3.5" />
              {c.deliveryMethod === 'pickup'
                ? 'Store pickup'
                : (c.activeShippingZone?.town ?? 'Shipping')}
            </dt>
            <dd
              className={cn(
                'font-bold',
                c.shippingCost === 0 ? 'text-success' : 'text-ink'
              )}
            >
              {c.deliveryMethod === 'pickup'
                ? 'Free'
                : !c.activeShippingZone
                  ? '—'
                  : c.shippingCost === 0
                    ? 'Free'
                    : formatCedis(c.shippingCost)}
            </dd>
          </div>

          {c.discountAmount > 0 && (
            <div className="flex items-center justify-between">
              <dt className="inline-flex items-center gap-1.5 text-success">
                <Tag className="h-3.5 w-3.5" />
                Discount
              </dt>
              <dd className="font-bold text-success">−{formatCedis(c.discountAmount)}</dd>
            </div>
          )}
        </dl>

        {c.activeShippingZone && c.deliveryMethod === 'delivery' && (
          <p className="mt-3.5 flex items-center gap-1.5 rounded-2xl bg-card px-3.5 py-2.5 text-[11.5px] font-semibold text-accent-deep">
            <Clock className="h-3.5 w-3.5" />
            Arrives in {c.activeShippingZone.estimated_days_min}–
            {c.activeShippingZone.estimated_days_max} business days
          </p>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <span className="text-[13px] font-bold text-ink">Total</span>
          <span className="font-display text-[26px] font-bold leading-none text-ink">
            {formatCedis(c.orderTotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={c.handlePlaceOrder}
          disabled={c.placeOrderDisabled}
          className="btn btn-primary btn-lg btn-block mt-5"
        >
          {c.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Placing order…
            </>
          ) : (
            `Place order · ${formatCedis(c.orderTotal)}`
          )}
        </button>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
          You will not be charged online. Pay on delivery or by Mobile Money once we
          confirm your order.
        </p>
      </div>
    </div>
  );
}
