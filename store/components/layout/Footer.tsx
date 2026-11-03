// components/layout/Footer.tsx
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { NAV_CATEGORIES, site, USEFUL_LINKS } from '@/lib/site';

const SERVICE_LINKS = [
  { label: 'My account', href: '/account' },
  { label: 'Track my order', href: '/orders' },
  { label: 'Delivery & pickup', href: '/location' },
  { label: 'Returns & exchanges', href: '/policies#returns' },
  { label: 'Help centre', href: '/contact' },
] as const;

export function Footer() {
  return (
    <footer className="mt-16 bg-nav" aria-label="Site footer">
      {/* Value props */}
      <div className="border-b border-white/60">
        <div className="container-page grid grid-cols-2 gap-x-4 gap-y-5 py-7 md:grid-cols-4">
          {[
            {
              icon: Truck,
              title: 'Nationwide delivery',
              copy: 'Accra, Kumasi, Takoradi & beyond',
            },
            {
              icon: Wallet,
              title: 'Pay on delivery',
              copy: 'Cash or MoMo when it arrives',
            },
            {
              icon: ShieldCheck,
              title: '100% authentic',
              copy: 'Sourced from trusted brands',
            },
            {
              icon: Clock,
              title: 'Fast support',
              copy: 'WhatsApp replies in minutes',
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface text-accent-deep">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div>
                <p className="text-[12.5px] font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-ink/65">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-9 py-10 md:grid-cols-12 md:gap-8">
        {/* Brand */}
        <div className="md:col-span-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-blush">
              <span className="font-display text-[20px] font-bold">G</span>
            </span>
            <span className="leading-none">
              <span className="block font-display text-[22px] font-bold tracking-tight text-ink">
                {site.name}
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.22em] text-accent-deep">
                Skincare · Mother Care
              </span>
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-ink/70">
            {site.tagline}. Shop online or visit us in {site.town}, Nsawam.
          </p>

          <div className="mt-5 space-y-2.5 text-[12.5px] text-ink/75">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <Link href="/location" className="hover:text-accent-deep">
                {site.address}
              </Link>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href={`tel:${site.phone}`} className="hover:text-accent-deep">
                {site.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${site.email}`} className="hover:text-accent-deep">
                {site.email}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-accent" />
              {site.hoursSummary}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2">
            {[
              { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
              { icon: FaTiktok, href: 'https://tiktok.com', label: 'TikTok' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-accent-deep transition-colors hover:bg-ink hover:text-blush"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <nav className="md:col-span-2" aria-label="Shop categories">
          <h3 className="mb-3.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-accent-deep">
            Shop
          </h3>
          <ul className="space-y-2.5">
            {NAV_CATEGORIES.slice(0, 6).map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-[12.5px] text-ink/75 transition-colors hover:text-accent-deep"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products"
                className="text-[12.5px] font-bold text-accent-deep hover:underline"
              >
                View all products
              </Link>
            </li>
          </ul>
        </nav>

        {/* Help */}
        <nav className="md:col-span-2" aria-label="Customer service">
          <h3 className="mb-3.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-accent-deep">
            Customer care
          </h3>
          <ul className="space-y-2.5">
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[12.5px] text-ink/75 transition-colors hover:text-accent-deep"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Company + newsletter */}
        <div className="md:col-span-4">
          <h3 className="mb-3.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-accent-deep">
            Company
          </h3>
          <ul className="mb-6 flex flex-wrap gap-x-5 gap-y-2.5">
            {USEFUL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[12.5px] text-ink/75 transition-colors hover:text-accent-deep"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mb-2.5 text-[13px] font-bold text-ink">Get deals in your inbox</p>
          <p className="mb-3.5 text-[11.5px] leading-relaxed text-ink/65">
            Restock alerts, skincare tips and up to 30% off your first bundle.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Payment strip */}
      <div className="border-t border-white/60">
        <div className="container-page flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-ink/60">We accept:</span>
            {['MTN MoMo', 'Telecel Cash', 'Visa', 'Mastercard', 'Cash on delivery'].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full bg-surface px-2.5 py-1 text-[10.5px] font-bold text-ink/75"
                >
                  {label}
                </span>
              )
            )}
          </div>
          <p className="text-[11px] font-semibold text-ink/60">{site.currencyNote}</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-ink">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-4 text-center md:flex-row md:text-left">
          <p className="text-[11.5px] text-blush/70">
            © {new Date().getFullYear()} {site.nameFull}. All rights reserved.
          </p>
          <nav className="flex items-center gap-5 text-[11.5px] text-blush/70" aria-label="Legal">
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
            <Link href="/policies" className="hover:text-primary">
              Policies
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/sitemap" className="hover:text-primary">
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
