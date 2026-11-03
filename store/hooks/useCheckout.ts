// hooks/useCheckout.ts
// Every piece of checkout state and logic, lifted out of the page so the
// markup in app/checkout/page.tsx stays readable.

'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { clearDemoLines } from '@/lib/demo/cart';

export type PaymentMethod = 'cod' | 'card' | 'mpesa';
export type DeliveryMethod = 'delivery' | 'pickup';
export type LocationStep = 'region' | 'town' | 'address';

export interface ShippingAddress {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  region: string;
  town: string;
}

export interface ShippingZone {
  id: string;
  country: string;
  region: string;
  town: string;
  shipping_fee: number;
  estimated_days_min: number;
  estimated_days_max: number;
  free_shipping_threshold: number | null;
  is_active: boolean;
  sort_order: number;
}

export interface DiscountCode {
  code_id: string;
  code: string;
  discount_type: 'free_shipping' | 'fixed_amount' | 'percentage';
  discount_value: number;
  description: string | null;
  regions?: string[];
}

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type FieldErrors = Partial<Record<keyof ShippingAddress | 'location', string>>;

export const SHIPPING_ZONE_ENDPOINTS = ['/api/shipping/zones', '/api/admin/shipping/zones'];

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function getUniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function useCheckout() {
  const router = useRouter();

  const {
    items,
    totalItems,
    totalPrice,
    checkoutIssues,
    isSyncing,
    fetchCart,
    setCart,
  } = useCart();

  const { isAuthenticated, profile, isLoading: authLoading } = useAuth();

  const initialized = useRef(false);
  const contactRef = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);

  const [bootstrapped, setBootstrapped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');

  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [shipping, setShipping] = useState<ShippingAddress>({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    region: '',
    town: '',
  });

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [zonesLoading, setZonesLoading] = useState(true);

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<LocationStep>('region');
  const [tempRegion, setTempRegion] = useState('');
  const [tempTown, setTempTown] = useState('');
  const [tempAddressLine1, setTempAddressLine1] = useState('');
  const [tempAddressLine2, setTempAddressLine2] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const effectiveShipping = useMemo<ShippingAddress>(
    () => ({
      ...shipping,
      full_name: shipping.full_name || profile?.full_name || '',
      email: shipping.email || profile?.email || '',
      phone: shipping.phone || profile?.phone || '',
    }),
    [profile?.email, profile?.full_name, profile?.phone, shipping]
  );

  const hasCheckoutIssues = checkoutIssues.length > 0;
  const placeOrderDisabled =
    isSubmitting || isSyncing || items.length === 0 || hasCheckoutIssues;

  const loadShippingZones = useCallback(async () => {
    setZonesLoading(true);

    let lastError = 'Failed to load shipping zones';

    try {
      for (const endpoint of SHIPPING_ZONE_ENDPOINTS) {
        try {
          const response = await fetch(endpoint, { method: 'GET', cache: 'no-store' });

          if (!response.ok) {
            lastError = `Failed to load zones from ${endpoint}`;
            continue;
          }

          const json = (await response.json()) as ApiResponse<ShippingZone[]>;

          if (!json.success) {
            lastError = json.error || lastError;
            continue;
          }

          const activeZones = (json.data ?? [])
            .filter((zone) => zone.is_active !== false)
            .sort((a, b) => {
              if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
              return `${a.region}${a.town}`.localeCompare(`${b.region}${b.town}`);
            });

          setShippingZones(activeZones);
          return;
        } catch {
          continue;
        }
      }

      toast.error(lastError);
    } finally {
      setZonesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated && isSupabaseConfigured) {
      toast.error('Please sign in to continue checkout.');
      router.replace('/');
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    void (async () => {
      await Promise.allSettled([fetchCart(), loadShippingZones()]);
      setBootstrapped(true);
    })();
  }, [authLoading, isAuthenticated, router, fetchCart, loadShippingZones]);

  const availableRegions = useMemo(
    () => getUniqueSorted(shippingZones.map((zone) => zone.region)),
    [shippingZones]
  );

  const townsForRegion = useMemo(() => {
    if (!tempRegion) return [];
    return getUniqueSorted(
      shippingZones
        .filter((zone) => zone.region.toLowerCase() === tempRegion.toLowerCase())
        .map((zone) => zone.town)
    );
  }, [tempRegion, shippingZones]);

  const filteredRegions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return availableRegions;
    return availableRegions.filter((region) => region.toLowerCase().includes(query));
  }, [availableRegions, searchQuery]);

  const filteredTowns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return townsForRegion;
    return townsForRegion.filter((town) => town.toLowerCase().includes(query));
  }, [townsForRegion, searchQuery]);

  const activeShippingZone = useMemo(() => {
    if (deliveryMethod === 'pickup') return null;

    const region = shipping.region.trim();
    const town = shipping.town.trim();
    if (!region || !town) return null;

    const exactZone = shippingZones.find(
      (zone) =>
        zone.region.toLowerCase() === region.toLowerCase() &&
        zone.town.toLowerCase() === town.toLowerCase()
    );

    if (exactZone) return exactZone;

    return (
      shippingZones.find((zone) => zone.region.toLowerCase() === region.toLowerCase()) ??
      null
    );
  }, [deliveryMethod, shipping.region, shipping.town, shippingZones]);

  const activeDiscount = useMemo(() => {
    if (!appliedDiscount) return null;

    if (
      appliedDiscount.regions?.length &&
      deliveryMethod === 'delivery' &&
      shipping.region
    ) {
      const allowed = appliedDiscount.regions.some(
        (region) => region.toLowerCase() === shipping.region.toLowerCase()
      );
      if (!allowed) return null;
    }

    return appliedDiscount;
  }, [appliedDiscount, deliveryMethod, shipping.region]);

  const shippingCost = useMemo(() => {
    if (deliveryMethod === 'pickup') return 0;
    if (activeDiscount?.discount_type === 'free_shipping') return 0;
    if (!activeShippingZone) return 0;

    const threshold = activeShippingZone.free_shipping_threshold;
    if (threshold !== null && totalPrice >= threshold) return 0;

    return Number(activeShippingZone.shipping_fee || 0);
  }, [deliveryMethod, activeDiscount, activeShippingZone, totalPrice]);

  const discountAmount = useMemo(() => {
    if (!activeDiscount) return 0;
    if (activeDiscount.discount_type === 'free_shipping') return 0;

    if (activeDiscount.discount_type === 'fixed_amount') {
      return Math.min(totalPrice, Number(activeDiscount.discount_value || 0));
    }

    if (activeDiscount.discount_type === 'percentage') {
      const value = Number(activeDiscount.discount_value || 0);
      return Math.min(totalPrice, (totalPrice * value) / 100);
    }

    return 0;
  }, [activeDiscount, totalPrice]);

  const orderTotal = Math.max(0, totalPrice + shippingCost - discountAmount);

  const paymentCopy = useMemo(() => {
    if (paymentMethod === 'cod') {
      return { title: 'Cash on Delivery', subtitle: 'Pay when your order arrives.' };
    }
    if (paymentMethod === 'mpesa') {
      return {
        title: 'Mobile Money',
        subtitle: 'We will contact you with payment instructions.',
      };
    }
    return {
      title: 'Card Payment',
      subtitle: 'Card payment instructions will be provided after placing order.',
    };
  }, [paymentMethod]);

  const handleShippingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setShipping((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const getZoneForPreview = useCallback(() => {
    if (!tempRegion || !tempTown) return null;

    const exactZone = shippingZones.find(
      (zone) =>
        zone.region.toLowerCase() === tempRegion.toLowerCase() &&
        zone.town.toLowerCase() === tempTown.toLowerCase()
    );

    if (exactZone) return exactZone;

    return (
      shippingZones.find(
        (zone) => zone.region.toLowerCase() === tempRegion.toLowerCase()
      ) ?? null
    );
  }, [shippingZones, tempRegion, tempTown]);

  const openLocationModal = useCallback(() => {
    setTempRegion(shipping.region);
    setTempTown(shipping.town);
    setTempAddressLine1(shipping.address_line1);
    setTempAddressLine2(shipping.address_line2);
    setSearchQuery('');

    if (!shipping.region) setModalStep('region');
    else if (!shipping.town) setModalStep('town');
    else setModalStep('address');

    setIsLocationModalOpen(true);
  }, [shipping]);

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
    setSearchQuery('');
  };

  const handleSelectRegion = (region: string) => {
    setTempRegion(region);
    setTempTown('');
    setSearchQuery('');
    setModalStep('town');
  };

  const handleSelectTown = (town: string) => {
    setTempTown(town);
    setSearchQuery('');
    setModalStep('address');
  };

  const handleConfirmLocation = () => {
    if (!tempRegion) {
      toast.error('Please select a delivery region.');
      setModalStep('region');
      return;
    }

    if (!tempTown) {
      toast.error('Please select a delivery town.');
      setModalStep('town');
      return;
    }

    if (!tempAddressLine1.trim()) {
      toast.error('Please enter your street address.');
      return;
    }

    setShipping((prev) => ({
      ...prev,
      region: tempRegion,
      town: tempTown,
      address_line1: tempAddressLine1.trim(),
      address_line2: tempAddressLine2.trim(),
    }));

    setFieldErrors((prev) => ({
      ...prev,
      location: undefined,
      region: undefined,
      town: undefined,
      address_line1: undefined,
    }));

    setIsLocationModalOpen(false);
    toast.success('Delivery location updated.');
  };

  const handleApplyCode = async () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) return;

    setIsValidatingCode(true);

    try {
      const response = await fetch('/api/shipping/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          order_total: totalPrice,
          region:
            deliveryMethod === 'delivery' && shipping.region
              ? shipping.region
              : undefined,
        }),
      });

      const json = (await response.json()) as ApiResponse<DiscountCode>;

      if (!response.ok || !json.success || !json.data) {
        toast.error(json.error || 'Invalid discount code.');
        return;
      }

      const discount = json.data;

      if (discount.regions?.length && shipping.region) {
        const allowed = discount.regions.some(
          (region) => region.toLowerCase() === shipping.region.toLowerCase()
        );
        if (!allowed) {
          toast.error(`This code is not valid for ${shipping.region}.`);
          return;
        }
      }

      setAppliedDiscount(discount);
      setDiscountCode('');
      toast.success(`Code "${discount.code}" applied.`);
    } catch {
      toast.error('Failed to validate discount code.');
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleRemoveCode = () => {
    setAppliedDiscount(null);
    toast.success('Discount code removed.');
  };

  const validateCheckoutInputs = () => {
    const errors: FieldErrors = {};

    if (!effectiveShipping.full_name.trim()) errors.full_name = 'Enter your full name.';

    if (!effectiveShipping.email.trim()) {
      errors.email = 'Enter your email address.';
    } else if (!isValidEmail(effectiveShipping.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!effectiveShipping.phone.trim()) errors.phone = 'Enter your phone number.';

    if (deliveryMethod === 'delivery') {
      if (!shipping.region || !shipping.town) {
        errors.location = 'Select your delivery region and town.';
      } else if (!shipping.address_line1.trim()) {
        errors.location = 'Enter your street address.';
      } else if (!activeShippingZone) {
        errors.location = 'No delivery option is available for this location.';
      }
    }

    setFieldErrors(errors);

    const firstError = Object.values(errors)[0];

    if (firstError) {
      toast.error(firstError);

      if (errors.location) {
        deliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        openLocationModal();
      } else {
        contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return false;
    }

    if (!termsAccepted) {
      setTermsError(true);
      termsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please accept the terms and conditions.');
      return false;
    }

    setTermsError(false);
    return true;
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    if (!validateCheckoutInputs()) return;

    await fetchCart();

    const latestCart = useCart.getState();

    if (latestCart.items.length === 0) {
      toast.error('Your basket is empty.');
      return;
    }

    if (!latestCart.canCheckout) {
      toast.error(
        latestCart.checkoutIssues[0]?.reason || 'Remove unavailable items before checkout.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        shipping_address: {
          full_name: effectiveShipping.full_name.trim(),
          email: effectiveShipping.email.trim(),
          phone: effectiveShipping.phone.trim(),
          address_line1: shipping.address_line1.trim(),
          address_line2: shipping.address_line2.trim() || undefined,
          region: deliveryMethod === 'delivery' ? shipping.region.trim() : undefined,
          town: deliveryMethod === 'delivery' ? shipping.town.trim() : undefined,
        },
        payment_method: paymentMethod,
        notes: notes.trim() || undefined,
        shipping_zone_id:
          deliveryMethod === 'delivery' ? activeShippingZone?.id : undefined,
        shipping_amount: shippingCost,
        discount_code_id: activeDiscount?.code_id || undefined,
        delivery_method: deliveryMethod,
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as ApiResponse<{ order_number: string }>;

      if (!response.ok || !json.success || !json.data) {
        toast.error(json.error || 'Failed to place order.');
        return;
      }

      setOrderNumber(json.data.order_number);
      setOrderSuccess(true);

      if (isSupabaseConfigured) {
        setCart(null);
      } else {
        clearDemoLines();
        setCart({ id: 'demo-cart', user_id: 'demo-user', items: [] });
      }

      toast.success('Order placed successfully.');
    } catch {
      toast.error('Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // data
    items,
    totalItems,
    totalPrice,
    checkoutIssues,
    hasCheckoutIssues,
    isSyncing,
    isSubmitting,
    placeOrderDisabled,
    shippingZones,
    zonesLoading,
    orderSuccess,
    orderNumber,
    // auth / boot
    authLoading,
    isAuthenticated,
    bootstrapped,
    // form
    shipping,
    setShipping,
    effectiveShipping,
    handleShippingChange,
    fieldErrors,
    notes,
    setNotes,
    termsAccepted,
    setTermsAccepted,
    termsError,
    setTermsError,
    paymentMethod,
    setPaymentMethod,
    paymentCopy,
    deliveryMethod,
    setDeliveryMethod,
    setFieldErrors,
    // location modal
    isLocationModalOpen,
    modalStep,
    setModalStep,
    tempRegion,
    tempTown,
    tempAddressLine1,
    setTempAddressLine1,
    tempAddressLine2,
    setTempAddressLine2,
    searchQuery,
    setSearchQuery,
    filteredRegions,
    filteredTowns,
    openLocationModal,
    closeLocationModal,
    handleSelectRegion,
    handleSelectTown,
    handleConfirmLocation,
    getZoneForPreview,
    // money
    activeShippingZone,
    activeDiscount,
    shippingCost,
    discountAmount,
    orderTotal,
    // discount code
    discountCode,
    setDiscountCode,
    appliedDiscount,
    isValidatingCode,
    handleApplyCode,
    handleRemoveCode,
    // actions
    handlePlaceOrder,
    // refs
    contactRef,
    deliveryRef,
    termsRef,
  };
}

export type CheckoutController = ReturnType<typeof useCheckout>;
