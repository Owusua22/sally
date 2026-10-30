// app/policies/page.tsx
// One page for the practical questions: delivery, payment, returns and privacy.

import type { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, PackageCheck, RefreshCcw, ShieldCheck, Truck } from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/jsonld';
import { HOME_FAQS } from '@/lib/seo/content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Delivery, payment, returns & privacy policies',
  description: `How delivery, payment, exchanges and refunds work at ${site.nameFull} in East Doboro, Nsawam — plus how we handle your personal data.`,
  alternates: { canonical: '/policies' },
  openGraph: {
    title: 'Delivery, payment, returns & privacy policies',
    description:
      'Delivery times, payment options, exchange window and privacy commitments.',
    url: '/policies',
    type: 'website',
  },
};

const SECTIONS = [
  {
    id: 'delivery',
    icon: Truck,
    title: 'Delivery & pickup',
    body: [
      `Orders confirmed before ${site.policy.sameDayCutoff} are dispatched the same working day from ${site.town}, Nsawam.`,
      'Greater Accra and Nsawam usually arrive within 24 hours. Kumasi, Takoradi, Tamale and other regional capitals take 2–4 business days. Outlying towns may take an extra day.',
      'Choose "Pick up" at checkout to collect from the shop for free. We message you as soon as your parcel is packed and ready.',
    ],
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Payment methods',
    body: [
      'Cash on Delivery — hand the exact amount to the rider when your parcel arrives.',
      `Mobile Money — pay to ${site.momo.network} ${site.momo.number} (${site.momo.name}) and send us the reference on WhatsApp.`,
      'Card — request a payment link and pay securely by Visa or Mastercard before dispatch.',
      'We never ask for your PIN, OTP or full card details over the phone or WhatsApp.',
    ],
  },
  {
    id: 'returns',
    icon: RefreshCcw,
    title: 'Returns & exchanges',
    body: [
      `Tell us about a damaged, wrong or unsealed item within ${site.policy.exchangeWindowHours} hours of delivery and we will exchange it or refund you.`,
      'For hygiene and safety, opened skincare, cosmetics and baby products can only be returned if they are faulty, expired or not what you ordered.',
      'Refunds go back to the way you paid — cash, MoMo or card — within 3 working days of the item being collected.',
    ],
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: 'Your data',
    body: [
      'We only collect what we need to deliver your order: name, phone, email and delivery address.',
      'We never sell your details. Payment card data is handled by our payment provider, not stored by us.',
      'Read the full detail in our privacy policy, or ask us to delete your data at any time.',
    ],
  },
];

export default function PoliciesPage() {
  return (
    <>
      <JsonLd
        id="policies"
        data={[
          faqSchema(HOME_FAQS),
          breadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Policies', href: '/policies' },
          ]),
        ]}
      />

      <div className="container-page py-8 sm:py-12">
        <header className="max-w-3xl">
          <p className="eyebrow">Good to know</p>
          <h1 className="mt-2 font-display text-[30px] font-bold leading-tight text-ink sm:text-[40px]">
            Shop policies
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Plain answers about delivery, payment, exchanges and privacy. If something is
            not covered here, WhatsApp us and we will sort it out.
          </p>
        </header>

        <nav
          className="mt-7 flex flex-wrap gap-2"
          aria-label="Policy sections"
        >
          {SECTIONS.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="chip">
              {section.title}
            </a>
          ))}
        </nav>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {SECTIONS.map(({ id, icon: Icon, title, body }) => (
            <section
              key={id}
              id={id}
              className="scroll-mt-28 rounded-[26px] border border-line bg-surface p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-accent-deep">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-[19px] font-bold text-ink">{title}</h2>
              <ul className="mt-3 space-y-2.5">
                {body.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 text-[12.5px] leading-relaxed text-muted"
                  >
                    <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-8 text-[12.5px] text-muted">
          These policies sit alongside our{' '}
          <Link href="/terms" className="font-bold text-accent-deep hover:underline">
            terms and conditions
          </Link>
          . Last updated 2026.
        </p>
      </div>
    </>
  );
}
