// app/profile/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Profile & saved items',
  description: 'Update your details and revisit the items you saved for later.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/profile' },
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
