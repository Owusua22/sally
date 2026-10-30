import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCedis } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Order details',
  description: 'Delivery status, items and payment state for your GlowMom order.',
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-warning-soft text-warning',
  confirmed: 'bg-card text-ink',
  processing: 'bg-danger-soft text-danger',
  shipped: 'bg-danger-soft text-warning',
  delivered: 'bg-success-soft text-success',
  cancelled: 'bg-danger-soft text-danger',
  refunded: 'bg-surface-soft text-ink',
};

const PAYMENT_STYLES: Record<string, string> = {
  pending: 'bg-warning-soft text-warning',
  paid: 'bg-success-soft text-success',
  failed: 'bg-danger-soft text-danger',
  refunded: 'bg-surface-soft text-ink',
};

// ✅ Added selected_size and selected_color
interface OrderItemRow {
  id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_size: string | null;
  selected_color: string | null;
  created_at: string;
}

interface OrderRow {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_method?: string | null;
  subtotal: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  notes?: string | null;
  shipping_address: {
    full_name?: string;
    email?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  items?: OrderItemRow[];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?auth=login&redirect=/orders');
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const safeOrder = order as OrderRow;
  const shipping = safeOrder.shipping_address;

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-danger uppercase tracking-wide mb-2">
              Order Details
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink">
              #{safeOrder.order_number}
            </h1>
            <p className="text-muted mt-2">
              Placed on {new Date(safeOrder.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                STATUS_STYLES[safeOrder.status] || 'bg-surface-soft text-ink/80'
              }`}
            >
              {safeOrder.status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                PAYMENT_STYLES[safeOrder.payment_status] || 'bg-surface-soft text-ink/80'
              }`}
            >
              Payment: {safeOrder.payment_status}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
              <h2 className="text-xl font-semibold text-ink mb-5">
                Ordered Items
              </h2>

              <div className="divide-y divide-line">
                {(safeOrder.items ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-soft border flex-shrink-0">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-line-strong">
                            📷
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">
                          {item.product_name}
                        </p>

                        {/* ✅ Display size and color */}
                        {(item.selected_size || item.selected_color) && (
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.selected_size && (
                              <span className="text-xs px-2 py-0.5 bg-surface-soft text-muted rounded-md">
                                Size: {item.selected_size}
                              </span>
                            )}
                            {item.selected_color && (
                              <span className="flex items-center gap-1 text-xs text-muted">
                                <span
                                  className="w-3 h-3 rounded-full border border-line"
                                  style={{ backgroundColor: item.selected_color.toLowerCase() }}
                                />
                                {item.selected_color}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-sm text-muted mt-0.5">
                          Qty: {item.quantity} × {formatCedis(item.unit_price)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-semibold text-ink">
                      {formatCedis(item.total_price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
              <h2 className="text-xl font-semibold text-ink mb-5">
                Shipping Information
              </h2>

              <div className="space-y-2 text-sm text-muted">
                <p className="font-medium text-ink">
                  {shipping?.full_name || 'Unknown'}
                </p>
                <p>{shipping?.email}</p>
                <p>{shipping?.phone}</p>
                <p>{shipping?.address_line1}</p>
                {shipping?.address_line2 && <p>{shipping.address_line2}</p>}
                <p>
                  {shipping?.city}, {shipping?.state} {shipping?.postal_code}
                </p>
                <p>{shipping?.country}</p>
              </div>

              {safeOrder.notes && (
                <div className="mt-5 pt-5 border-t border-line">
                  <p className="text-sm font-medium text-ink mb-1">Notes</p>
                  <p className="text-sm text-muted">{safeOrder.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div>
            <div className="bg-white rounded-2xl border border-line shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-ink mb-5">Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatCedis(safeOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className={safeOrder.shipping_amount === 0 ? 'text-success font-medium' : ''}>
                    {safeOrder.shipping_amount === 0 ? 'Free' : formatCedis(safeOrder.shipping_amount)}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Tax</span>
                  <span>{formatCedis(safeOrder.tax_amount)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-ink pt-3 border-t border-line">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-primary via-accent to-accent-deep bg-clip-text text-transparent">
                    {formatCedis(safeOrder.total_amount)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line text-sm text-muted space-y-2">
                <p>
                  <span className="font-medium text-ink/80">Status:</span>{' '}
                  <span className="capitalize">{safeOrder.status}</span>
                </p>
                <p>
                  <span className="font-medium text-ink/80">Payment:</span>{' '}
                  <span className="capitalize">{safeOrder.payment_status}</span>
                </p>
                {safeOrder.payment_method && (
                  <p>
                    <span className="font-medium text-ink/80">Method:</span>{' '}
                    <span className="capitalize">{safeOrder.payment_method}</span>
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  href="/contact"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-danger border border-danger/25 rounded-xl hover:bg-danger-soft transition-colors"
                >
                  Need Help? Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}