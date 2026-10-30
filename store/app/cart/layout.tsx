// app/cart/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Your basket',
  description:
    'Review the skincare, body care, haircare and baby items in your basket before checking out.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/cart' },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
