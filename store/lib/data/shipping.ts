// lib/data/shipping.ts
// Read-only shipping zones for public pages (the /location delivery table).
// Falls back to the bundled Ghana zones when no Supabase project is set.

import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { mapShippingZones } from '@/lib/shipping/zones';
import { demoShippingZones } from '@/lib/demo/shipping';

export interface PublicShippingZone {
  id: string;
  name: string;
  country: string;
  region: string;
  town: string;
  shipping_fee: number;
  free_shipping_threshold: number | null;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
  sort_order: number;
}

function fallback(): PublicShippingZone[] {
  return mapShippingZones(demoShippingZones.filter((zone) => zone.is_active)).map(
    (zone) => ({
      ...zone,
      name: zone.name || zone.town,
      shipping_fee: Number(zone.shipping_fee ?? 0),
      free_shipping_threshold:
        zone.free_shipping_threshold == null
          ? null
          : Number(zone.free_shipping_threshold),
      estimated_days_min: Number(zone.estimated_days_min ?? 1),
      estimated_days_max: Number(zone.estimated_days_max ?? 3),
    })
  ) as PublicShippingZone[];
}

export async function getPublicShippingZones(): Promise<PublicShippingZone[]> {
  if (!isSupabaseConfigured) return fallback();

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('shipping_zones')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return fallback();

    return mapShippingZones(data).map((zone) => ({
      ...zone,
      name: zone.name || zone.town,
      shipping_fee: Number(zone.shipping_fee ?? 0),
      free_shipping_threshold:
        zone.free_shipping_threshold == null
          ? null
          : Number(zone.free_shipping_threshold),
      estimated_days_min: Number(zone.estimated_days_min ?? 1),
      estimated_days_max: Number(zone.estimated_days_max ?? 3),
    })) as PublicShippingZone[];
  } catch {
    return fallback();
  }
}
