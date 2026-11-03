// components/checkout/CheckoutParts.tsx
// Small presentational pieces shared by the checkout page.

import Link from 'next/link';
import { AlertTriangle, Check, Lock, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Section header ────────────────────────────────────────── */
export function SectionHeader({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-[13px] font-extrabold text-accent-deep">
        {step}
      </span>
      <div>
        <h2 className="font-display text-[19px] font-bold leading-tight text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[12.5px] text-muted">{description}</p>}
      </div>
    </div>
  );
}

/* ── Card wrapper ──────────────────────────────────────────── */
export function Section({
  children,
  className,
  innerRef,
}: {
  children: React.ReactNode;
  className?: string;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={innerRef}
      className={cn(
        'rounded-[26px] border border-line bg-surface p-5 shadow-[0_10px_30px_-28px_rgba(73,56,61,0.6)] sm:p-7',
        className
      )}
    >
      {children}
    </section>
  );
}

/* ── Field error ───────────────────────────────────────────── */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

/* ── Selectable option card (delivery / payment) ───────────── */
export function OptionCard({
  selected,
  onClick,
  icon,
  title,
  description,
  meta,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description?: string;
  meta?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary-soft shadow-[0_0_0_3px_var(--primary-soft)]'
          : 'border-line bg-surface hover:border-primary/60 hover:bg-surface-soft'
      )}
    >
      <span
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors',
          selected ? 'bg-ink text-blush' : 'bg-card text-accent-deep'
        )}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-bold text-ink">{title}</span>
        {description && (
          <span className="mt-0.5 block text-[12px] leading-snug text-muted">
            {description}
          </span>
        )}
      </span>

      {meta ? (
        <span className="shrink-0 text-[12px] font-bold text-accent-deep">{meta}</span>
      ) : null}

      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          selected ? 'border-ink bg-ink' : 'border-line-strong'
        )}
        aria-hidden
      >
        {selected && <Check className="h-3 w-3 text-blush" strokeWidth={3.5} />}
      </span>
    </button>
  );
}

/* ── Cart needs attention banner ───────────────────────────── */
export function CartIssues({
  issues,
  onOpenCart,
}: {
  issues: { itemId: string; productName: string; reason: string }[];
  onOpenCart: () => void;
}) {
  return (
    <div className="rounded-3xl border border-danger/25 bg-danger-soft p-5">
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface text-danger">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] font-bold text-ink">Your basket needs attention</h2>
          <p className="mt-1 text-[12.5px] text-muted">
            Remove unavailable or out-of-stock items before placing your order.
          </p>
          <ul className="mt-3 space-y-1 text-[12.5px] text-danger">
            {issues.map((issue) => (
              <li key={issue.itemId}>
                <span className="font-bold text-ink">{issue.productName}</span> · {issue.reason}
              </li>
            ))}
          </ul>
          <button type="button" onClick={onOpenCart} className="btn btn-outline mt-4">
            Open basket to fix
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Empty basket ──────────────────────────────────────────── */
export function EmptyCheckout() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-card text-accent">
        <ShoppingBag className="h-9 w-9" />
      </span>
      <h1 className="mt-6 font-display text-[28px] font-bold text-ink">
        Your basket is empty
      </h1>
      <p className="mt-2 max-w-sm text-[13.5px] text-muted">
        Add a few favourites and they will show up here, ready for checkout.
      </p>
      <Link href="/products" className="btn btn-primary btn-lg mt-7">
        Shop products
      </Link>
    </div>
  );
}

/* ── Loading ───────────────────────────────────────────────── */
export function CheckoutSkeleton({ label = 'Preparing your checkout…' }: { label?: string }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-card border-t-primary" />
        <p className="text-[13px] font-semibold text-muted">{label}</p>
      </div>
    </div>
  );
}

/* ── Secure badge ──────────────────────────────────────────── */
export function SecureBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-[11px] font-bold text-success">
      <Lock className="h-3.5 w-3.5" />
      Secure checkout
    </span>
  );
}
