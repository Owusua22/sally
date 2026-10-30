// app/checkout/page.tsx
'use client';

import Link from 'next/link';
import {
  Banknote,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Smartphone,
  Store,
  Truck,
} from 'lucide-react';

import { useCheckout } from '@/hooks/useCheckout';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { formatCedis } from '@/lib/utils';
import { site } from '@/lib/site';

import {
  CartIssues,
  CheckoutSkeleton,
  EmptyCheckout,
  FieldError,
  OptionCard,
  Section,
  SectionHeader,
} from '@/components/checkout/CheckoutParts';
import { LocationModal } from '@/components/checkout/LocationModal';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutSuccess } from '@/components/checkout/CheckoutSuccess';
import { useCart } from '@/hooks/useCart';

export default function CheckoutPage() {
  const c = useCheckout();
  const { toggleCart } = useCart();

  if (c.authLoading || (isSupabaseConfigured && !c.bootstrapped && c.isAuthenticated)) {
    return <CheckoutSkeleton label="Preparing your checkout…" />;
  }

  if (isSupabaseConfigured && !c.isAuthenticated) return null;

  if (!c.bootstrapped) return <CheckoutSkeleton label="Loading your basket…" />;

  if (c.orderSuccess) return <CheckoutSuccess c={c} />;

  if (c.items.length === 0 && !c.isSyncing) {
    return (
      <div className="min-h-screen bg-blush">
        <CheckoutTopBar />
        <EmptyCheckout />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush pb-32 lg:pb-14">
      <CheckoutTopBar />

      <main className="container-page grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 lg:py-12">
        {/* ── Steps ─────────────────────────────────────────── */}
        <div className="space-y-6">
          <header>
            <p className="eyebrow">Checkout</p>
            <h1 className="mt-2 font-display text-[30px] font-bold leading-tight text-ink sm:text-[38px]">
              Complete your order
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] text-muted">
              Confirm your contact details, choose how you want your parcel, then place
              your order. No online payment is taken.
            </p>
          </header>

          {c.hasCheckoutIssues && (
            <CartIssues issues={c.checkoutIssues} onOpenCart={toggleCart} />
          )}

          {/* 1 — Contact */}
          <Section innerRef={c.contactRef}>
            <SectionHeader
              step={1}
              title="Contact information"
              description="So we can confirm your order and send delivery updates."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="full_name">
                  Full name <span className="text-danger">*</span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  autoComplete="name"
                  value={c.effectiveShipping.full_name}
                  onChange={c.handleShippingChange}
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(c.fieldErrors.full_name)}
                  className="field-input"
                />
                <FieldError message={c.fieldErrors.full_name} />
              </div>

              <div>
                <label className="field-label" htmlFor="email">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={c.effectiveShipping.email}
                  onChange={c.handleShippingChange}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(c.fieldErrors.email)}
                  className="field-input"
                />
                <FieldError message={c.fieldErrors.email} />
              </div>

              <div>
                <label className="field-label" htmlFor="phone">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={c.effectiveShipping.phone}
                  onChange={c.handleShippingChange}
                  placeholder="+233 20 123 4567"
                  aria-invalid={Boolean(c.fieldErrors.phone)}
                  className="field-input"
                />
                <FieldError message={c.fieldErrors.phone} />
              </div>
            </div>
          </Section>

          {/* 2 — Delivery */}
          <Section innerRef={c.deliveryRef}>
            <SectionHeader
              step={2}
              title="Delivery method"
              description="Choose delivery to your door, or collect from the shop."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <OptionCard
                selected={c.deliveryMethod === 'delivery'}
                onClick={() => {
                  c.setDeliveryMethod('delivery');
                  c.setFieldErrors((prev) => ({ ...prev, location: undefined }));
                }}
                icon={<Truck className="h-5 w-5" />}
                title="Delivery"
                description="Send to your address"
              />
              <OptionCard
                selected={c.deliveryMethod === 'pickup'}
                onClick={() => {
                  c.setDeliveryMethod('pickup');
                  c.setFieldErrors((prev) => ({ ...prev, location: undefined }));
                }}
                icon={<Store className="h-5 w-5" />}
                title="Pick up"
                description="Collect from the shop"
                meta="Free"
              />
            </div>

            {c.deliveryMethod === 'delivery' ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={c.openLocationModal}
                  className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors ${
                    c.fieldErrors.location
                      ? 'border-danger bg-danger-soft'
                      : c.shipping.region && c.shipping.town
                        ? 'border-primary bg-primary-soft'
                        : 'border-dashed border-line-strong bg-surface-soft hover:bg-surface'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      c.shipping.region && c.shipping.town
                        ? 'bg-ink text-blush'
                        : 'bg-card text-accent'
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    {c.shipping.region && c.shipping.town ? (
                      <>
                        <span className="block truncate text-[13.5px] font-bold text-ink">
                          {c.shipping.town}, {c.shipping.region}
                        </span>
                        <span className="block truncate text-[12px] text-muted">
                          {c.shipping.address_line1 || 'Address not added'}
                        </span>
                        {c.activeShippingZone && (
                          <span className="mt-1 flex flex-wrap items-center gap-2 text-[11.5px] font-semibold text-accent-deep">
                            <span>
                              {c.activeShippingZone.estimated_days_min}–
                              {c.activeShippingZone.estimated_days_max} days
                            </span>
                            <span>
                              {c.shippingCost === 0
                                ? 'Free delivery'
                                : formatCedis(c.shippingCost)}
                            </span>
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="block text-[13.5px] font-bold text-ink">
                          Add delivery address
                        </span>
                        <span className="block text-[12px] text-muted">
                          Select your region, town and street address.
                        </span>
                      </>
                    )}
                  </span>

                  <span className="shrink-0 text-[12px] font-bold text-accent-deep">
                    Change
                  </span>
                </button>
                <FieldError message={c.fieldErrors.location} />
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-success-soft p-4">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <div>
                    <p className="text-[13px] font-bold text-ink">Store pickup selected</p>
                    <p className="mt-1 text-[12px] text-success">
                      Collect from {site.address} during opening hours. We will message you
                      when your parcel is ready.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Section>

          {/* 3 — Payment */}
          <Section>
            <SectionHeader
              step={3}
              title="Payment method"
              description="Nothing is charged online — you pay when we confirm."
            />

            <div className="space-y-3">
              <OptionCard
                selected={c.paymentMethod === 'cod'}
                onClick={() => c.setPaymentMethod('cod')}
                icon={<Banknote className="h-5 w-5" />}
                title="Cash on Delivery"
                description="Pay the rider when your order arrives."
              />
              <OptionCard
                selected={c.paymentMethod === 'mpesa'}
                onClick={() => c.setPaymentMethod('mpesa')}
                icon={<Smartphone className="h-5 w-5" />}
                title="Mobile Money"
                description="We will send you payment instructions."
              />
              <OptionCard
                selected={c.paymentMethod === 'card'}
                onClick={() => c.setPaymentMethod('card')}
                icon={<CreditCard className="h-5 w-5" />}
                title="Credit / Debit Card"
                description="Card instructions shared after you order."
              />
            </div>

            <div className="mt-5 rounded-2xl bg-surface-soft p-4">
              <p className="text-[13px] font-bold text-ink">{c.paymentCopy.title}</p>
              <p className="mt-1 text-[12px] text-muted">{c.paymentCopy.subtitle}</p>
            </div>

            <div className="mt-5">
              <label className="field-label" htmlFor="notes">
                Order notes <span className="font-medium text-muted">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={c.notes}
                onChange={(event) => c.setNotes(event.target.value)}
                rows={4}
                placeholder="Delivery instructions, a safe time to call, gift wrapping…"
                className="field-input resize-none"
              />
            </div>
          </Section>

          {/* 4 — Terms */}
          <Section
            innerRef={c.termsRef}
            className={c.termsError ? 'border-danger' : undefined}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={c.termsAccepted}
                onChange={(event) => {
                  c.setTermsAccepted(event.target.checked);
                  if (event.target.checked) c.setTermsError(false);
                }}
                className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded border-line-strong text-ink accent-[var(--ink)]"
              />
              <span className="text-[12.5px] leading-relaxed text-ink/80">
                I have read and agree to the{' '}
                <Link
                  href="/terms"
                  className="font-bold text-accent-deep underline underline-offset-2"
                >
                  Terms and Conditions
                </Link>
                . I confirm that my contact and delivery details are correct.
              </span>
            </label>

            {c.termsError && (
              <p className="field-error mt-2">
                Please accept the terms before placing your order.
              </p>
            )}
          </Section>

          {/* Mobile summary is rendered in the sticky bar below */}
        </div>

        {/* ── Summary ────────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary c={c} />
        </aside>
      </main>

      <LocationModal c={c} />

      {/* Sticky mobile total — the summary column sits below the form on
          small screens, so keep the total and the CTA within thumb reach. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-accent-deep">
              Total
            </p>
            <p className="font-display text-[20px] font-bold leading-none text-ink">
              {formatCedis(c.orderTotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={c.handlePlaceOrder}
            disabled={c.placeOrderDisabled}
            className="btn btn-primary ml-auto flex-1"
          >
            {c.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Placing…
              </>
            ) : (
              'Place order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */

function CheckoutTopBar() {
  return (
    <header className="border-b border-line bg-nav">
      <div className="container-page flex h-14 items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full px-1 text-[13px] font-semibold text-ink transition-colors hover:text-accent-deep"
        >
          ← Continue shopping
        </Link>

        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-accent-deep">
          <Lock className="h-3.5 w-3.5" />
          Secure checkout
        </span>
      </div>
    </header>
  );
}
