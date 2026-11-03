// components/checkout/LocationModal.tsx
// Three-step picker: region → town → street address.

'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Loader2, MapPin, Search, X } from 'lucide-react';
import { cn, formatCedis } from '@/lib/utils';
import type { CheckoutController } from '@/hooks/useCheckout';

const STEP_TITLES: Record<string, { title: string; hint: string }> = {
  region: { title: 'Which region?', hint: 'Pick the region we should deliver to.' },
  town: { title: 'Which town?', hint: 'Delivery fee and ETA depend on the town.' },
  address: { title: 'Where exactly?', hint: 'Add a street and a landmark so the rider finds you.' },
};

export function LocationModal({ c }: { c: CheckoutController }) {
  useEffect(() => {
    if (!c.isLocationModalOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') c.closeLocationModal();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [c]);

  if (!c.isLocationModalOpen) return null;

  const copy = STEP_TITLES[c.modalStep];
  const previewZone = c.getZoneForPreview();

  const back = () => {
    c.setSearchQuery('');
    if (c.modalStep === 'town') c.setModalStep('region');
    if (c.modalStep === 'address') c.setModalStep('town');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close location picker"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={c.closeLocationModal}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose delivery location"
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-2xl sm:max-w-lg sm:rounded-[28px]"
      >
        {/* header */}
        <div className="flex items-start gap-3 border-b border-line p-5">
          {c.modalStep !== 'region' && (
            <button
              type="button"
              onClick={back}
              aria-label="Back"
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-soft"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <p className="eyebrow">
              Step {c.modalStep === 'region' ? 1 : c.modalStep === 'town' ? 2 : 3} of 3
            </p>
            <h2 className="mt-1 font-display text-[20px] font-bold text-ink">{copy.title}</h2>
            <p className="mt-0.5 text-[12px] text-muted">{copy.hint}</p>
          </div>

          <button
            type="button"
            onClick={c.closeLocationModal}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-soft"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {c.modalStep !== 'address' && (
          <div className="border-b border-line p-4">
            <div className="flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 focus-within:border-primary">
              <Search className="h-4 w-4 shrink-0 text-accent" />
              <input
                value={c.searchQuery}
                onChange={(event) => c.setSearchQuery(event.target.value)}
                placeholder={c.modalStep === 'region' ? 'Search regions' : 'Search towns'}
                className="h-full w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-muted/70"
                aria-label={c.modalStep === 'region' ? 'Search regions' : 'Search towns'}
              />
            </div>
          </div>
        )}

        {/* body */}
        <div className="flex-1 overflow-y-auto p-4">
          {c.zonesLoading ? (
            <div className="flex min-h-56 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : c.modalStep === 'region' ? (
            <div className="space-y-2">
              {c.filteredRegions.length === 0 ? (
                <p className="rounded-2xl bg-surface-soft p-8 text-center text-[13px] text-muted">
                  No regions found.
                </p>
              ) : (
                c.filteredRegions.map((region) => {
                  const zoneCount = c.shippingZones.filter(
                    (zone) => zone.region.toLowerCase() === region.toLowerCase()
                  ).length;

                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => c.handleSelectRegion(region)}
                      className="flex w-full items-center gap-3.5 rounded-2xl border border-line bg-surface p-3.5 text-left transition-colors hover:border-primary hover:bg-primary-soft"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-accent-deep">
                        <MapPin className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-bold text-ink">{region}</span>
                        <span className="block text-[12px] text-muted">
                          {zoneCount} {zoneCount === 1 ? 'town' : 'towns'} available
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-accent" />
                    </button>
                  );
                })
              )}
            </div>
          ) : c.modalStep === 'town' ? (
            <div className="space-y-2">
              {c.filteredTowns.length === 0 ? (
                <p className="rounded-2xl bg-surface-soft p-8 text-center text-[13px] text-muted">
                  No towns found for this region.
                </p>
              ) : (
                c.filteredTowns.map((town) => {
                  const zone = c.shippingZones.find(
                    (z) =>
                      z.region.toLowerCase() === c.tempRegion.toLowerCase() &&
                      z.town.toLowerCase() === town.toLowerCase()
                  );

                  const qualifiesFree =
                    zone?.free_shipping_threshold != null &&
                    c.totalPrice >= zone.free_shipping_threshold;

                  return (
                    <button
                      key={town}
                      type="button"
                      onClick={() => c.handleSelectTown(town)}
                      className="flex w-full items-center gap-3.5 rounded-2xl border border-line bg-surface p-3.5 text-left transition-colors hover:border-primary hover:bg-primary-soft"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-accent-deep">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-bold text-ink">{town}</span>
                        {zone && (
                          <span className="mt-0.5 flex items-center gap-1 text-[12px] text-muted">
                            <Clock className="h-3.5 w-3.5" />
                            {zone.estimated_days_min}–{zone.estimated_days_max} days
                          </span>
                        )}
                      </span>
                      {zone && (
                        <span
                          className={cn(
                            'shrink-0 text-[13px] font-extrabold',
                            qualifiesFree ? 'text-success' : 'text-ink'
                          )}
                        >
                          {qualifiesFree ? 'Free' : formatCedis(zone.shipping_fee)}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-card p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-blush">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-bold text-ink">
                    {c.tempTown}, {c.tempRegion}
                  </p>
                  {previewZone && (
                    <p className="mt-0.5 text-[12px] font-semibold text-accent-deep">
                      {previewZone.estimated_days_min}–{previewZone.estimated_days_max} days ·{' '}
                      {previewZone.free_shipping_threshold != null &&
                      c.totalPrice >= previewZone.free_shipping_threshold
                        ? 'Free delivery'
                        : formatCedis(previewZone.shipping_fee)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="checkout-street">
                  Street address <span className="text-danger">*</span>
                </label>
                <input
                  id="checkout-street"
                  value={c.tempAddressLine1}
                  onChange={(event) => c.setTempAddressLine1(event.target.value)}
                  placeholder="House number, street name, area"
                  className="field-input"
                />
              </div>

              <div>
                <label className="field-label" htmlFor="checkout-landmark">
                  Landmark / additional info
                </label>
                <input
                  id="checkout-landmark"
                  value={c.tempAddressLine2}
                  onChange={(event) => c.setTempAddressLine2(event.target.value)}
                  placeholder="Near a landmark, apartment, suite…"
                  className="field-input"
                />
              </div>
            </div>
          )}
        </div>

        {c.modalStep === 'address' && (
          <div className="border-t border-line p-4">
            <button type="button" onClick={c.handleConfirmLocation} className="btn btn-primary btn-block btn-lg">
              Confirm address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
