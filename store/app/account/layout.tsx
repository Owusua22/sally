// app/account/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'My account',
  description:
    'Manage your orders, delivery details and saved items at GlowMom Skincare & Mother Care.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/account' },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
