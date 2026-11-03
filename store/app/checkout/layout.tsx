// app/checkout/layout.tsx
// The checkout page is a client component, so its metadata lives here.

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    'Complete your skincare, mother care and baby order. Choose delivery or store pickup, pay on delivery or with Mobile Money.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/checkout' },
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
