import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Package, ShoppingBag, Clock, CheckCircle2, XCircle, Truck, RefreshCcw, Loader2 } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { checkDatabaseHealth, logDatabaseError } from '@/lib/supabase/health';
import { formatCedis } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My orders',
  description: 'Track every order you have placed with GlowMom Skincare & Mother Care.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/orders' },
};

/* ─── Status config ──────────────────────────────────────────────── */
const ORDER_STATUS: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:    { label: 'Pending',    color: 'text-warning',   bg: 'bg-warning-soft border-warning/30',   icon: <Clock className="w-3 h-3" /> },
  confirmed:  { label: 'Confirmed',  color: 'text-ink',     bg: 'bg-card border-line',       icon: <CheckCircle2 className="w-3 h-3" /> },
  processing: { label: 'Processing', color: 'text-danger',    bg: 'bg-danger-soft border-danger/30', icon: <Loader2 className="w-3 h-3" /> },
  shipped:    { label: 'Shipped',    color: 'text-ink',    bg: 'bg-card border-line',     icon: <Truck className="w-3 h-3" /> },
  delivered:  { label: 'Delivered',  color: 'text-success', bg: 'bg-success-soft border-success/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled:  { label: 'Cancelled',  color: 'text-danger',    bg: 'bg-danger-soft border-danger/30',     icon: <XCircle className="w-3 h-3" /> },
  refunded:   { label: 'Refunded',   color: 'text-muted',   bg: 'bg-surface-soft border-line',   icon: <RefreshCcw className="w-3 h-3" /> },
};

const PAYMENT_STATUS: Record<string, { label: string; dot: string }> = {
  pending:  { label: 'Payment pending', dot: 'bg-warning' },
  paid:     { label: 'Paid',            dot: 'bg-success' },
  failed:   { label: 'Payment failed',  dot: 'bg-danger' },
  refunded: { label: 'Refunded',        dot: 'bg-line-strong' },
};

/* ─── Types ──────────────────────────────────────────────────────── */
interface OrderListItem {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_amount: number;
  items?: { id: string }[];
}

/* ─── Helpers ────────────────────────────────────────────────────── */
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

/* ─── Sub-components ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS[status] ?? { label: status, color: 'text-muted', bg: 'bg-surface-soft border-line', icon: null };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${cfg.bg} ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function PaymentDot({ status }: { status: string }) {
  const cfg = PAYMENT_STATUS[status] ?? { label: status, dot: 'bg-line-strong' };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function OrderCard({ order }: { order: OrderListItem }) {
  const { date, time } = formatDate(order.created_at);
  const itemCount = order.items?.length ?? 0;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group block bg-white rounded-2xl border border-line hover:border-line-strong hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
    >
      {/* Top accent bar — thin gradient line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-primary-strong to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 sm:p-6">
        {/* Row 1 – order number + status */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted/70 mb-0.5">
              Order
            </p>
            <h2 className="text-base sm:text-lg font-bold text-ink font-mono tracking-tight">
              #{order.order_number}
            </h2>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-dashed border-slate-100" />

        {/* Row 2 – meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4">
          {/* Date */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted/70 mb-0.5">Date</p>
            <p className="text-sm font-medium text-muted">{date}</p>
            <p className="text-xs text-muted/70">{time}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted/70 mb-0.5">Items</p>
            <p className="text-sm font-medium text-muted">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <PaymentDot status={order.payment_status} />
          </div>

          {/* Total – spans full width on xs, right-aligned on sm+ */}
          <div className="col-span-2 sm:col-span-1 sm:text-right">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted/70 mb-0.5">Total</p>
            <p className="text-lg font-extrabold text-ink tabular-nums">
              {formatCedis(order.total_amount)}
            </p>
          </div>
        </div>

        {/* Row 3 – CTA */}
        <div className="mt-5 flex items-center justify-end">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:text-brand-dark transition-colors">
            View details
            <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default async function OrdersPage() {
  // Demo mode: no backend, so show the empty state instead of redirect loops.
  if (!isSupabaseConfigured) {
    return <OrdersShell orders={[]} />;
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?auth=login&redirect=/orders');
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_number, created_at, status, payment_status, total_amount, items:order_items(id)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    logDatabaseError('orders page', error);
    const database = await checkDatabaseHealth();
    if (!database.initialized) {
      return <OrdersShell orders={[]} setupRequired />;
    }
  }

  return <OrdersShell orders={(orders ?? []) as OrderListItem[]} />;
}

function OrdersShell({
  orders,
  setupRequired = false,
}: {
  orders: OrderListItem[];
  setupRequired?: boolean;
}) {
  const safeOrders = orders;

  /* ── Quick stats ── */
  const totalSpent = safeOrders.reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
  const activeCount = safeOrders.filter(o =>
    ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
  ).length;

  return (
    <main className="min-h-screen bg-blush">
      {/* ── Hero / header strip ── */}
      <div className="border-b border-line bg-white">
        <div className="container-page is-reading section-y">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-soft text-brand shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">My Account</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Order History
          </h1>
          <p className="text-sm text-muted mt-1">
            All your purchases in one place.
          </p>

          {/* Stats row – only show when there are orders */}
          {safeOrders.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: 'Orders placed', value: safeOrders.length },
                { label: 'Active orders', value: activeCount },
                { label: 'Total spent', value: formatCedis(totalSpent) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-surface-soft border border-line rounded-xl px-3 py-3 sm:px-4"
                >
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-muted/70 mb-0.5 leading-tight">
                    {label}
                  </p>
                  <p className="text-base sm:text-lg font-extrabold text-ink tabular-nums truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container-page is-reading section-y">
        {safeOrders.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-line p-10 sm:p-14 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-card flex items-center justify-center mb-5 text-3xl">
              <Package className="w-8 h-8 text-muted/70" />
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">
              {setupRequired ? 'Orders are almost ready' : 'No orders yet'}
            </h2>
            <p className="text-sm text-muted mb-8 max-w-sm mx-auto leading-relaxed">
              {setupRequired
                ? 'The store database is being set up, so order history is not available yet. Please check back shortly.'
                : "Looks like you haven't placed any orders. Discover products you'll love."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-ink hover:bg-accent transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {safeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}