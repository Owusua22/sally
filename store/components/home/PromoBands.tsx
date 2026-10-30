// components/home/PromoBands.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, ShieldCheck, Sparkles, Truck, Wallet } from 'lucide-react';
import { site } from '@/lib/site';

/* ── Trust strip ───────────────────────────────────────────── */
export function ValueStrip() {
  const items = [
    { icon: Truck, title: 'Nationwide delivery', copy: '2–4 business days' },
    { icon: Wallet, title: 'Pay on delivery', copy: 'Cash or MoMo' },
    { icon: ShieldCheck, title: '100% authentic', copy: 'Verified brands' },
    { icon: Sparkles, title: `Free over GH₵${site.freeDeliveryThreshold}`, copy: 'Selected areas' },
  ];

  return (
    <section className="container-page section-y">
      <div className="grid grid-cols-2 gap-3 rounded-3xl border border-line bg-surface p-4 sm:grid-cols-4 sm:gap-4 sm:p-5">
        {items.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-accent-deep">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-bold text-ink">{title}</p>
              <p className="truncate text-[11px] text-muted">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Two editorial promo cards ─────────────────────────────── */
export function PromoBands() {
  const bands = [
    {
      href: '/categories/bath-body-care',
      image: '/images/products/body-lotion.jpg',
      eyebrow: 'Save up to 35%',
      title: 'Body care for soft, glowing skin',
      copy: 'Shea lotions, body oils and shower creams.',
      cta: 'Shop body care',
      tint: 'from-ink/85 via-ink/55 to-transparent',
    },
    {
      href: '/categories/baby-care-essentials',
      image: '/images/products/baby-diapers.jpg',
      eyebrow: 'Mum favourites',
      title: 'Gentle care for little ones',
      copy: 'Jumbo diapers, lotions and tear-free washes.',
      cta: 'Shop baby care',
      tint: 'from-accent/90 via-accent/55 to-transparent',
    },
  ];

  return (
    <section className="container-page section-y grid gap-4 sm:grid-cols-2" aria-label="Promotions">
      {bands.map((band) => (
        <Link
          key={band.href}
          href={band.href}
          className="group relative flex min-h-[210px] overflow-hidden rounded-[26px] bg-ink sm:min-h-[260px]"
        >
          <Image
            src={band.image}
            alt={band.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ objectPosition: '70% center' }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${band.tint}`} />
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8">
            <span className="w-fit rounded-full bg-surface/20 px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.18em] text-blush backdrop-blur-sm">
              {band.eyebrow}
            </span>
            <h3 className="mt-3 max-w-[16ch] font-display text-[24px] font-bold leading-tight text-blush sm:text-[30px]">
              {band.title}
            </h3>
            <p className="mt-2 max-w-[32ch] text-[12.5px] text-blush/75">{band.copy}</p>
            <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-surface px-4 py-2.5 text-[12px] font-bold text-ink transition-colors group-hover:bg-primary">
              {band.cta} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

/* ── Full-width deal banner ────────────────────────────────── */
export function DealBanner() {
  return (
    <section className="container-page section-y">
      <div className="relative overflow-hidden rounded-[26px] bg-card">
        <Image
          src="/images/hero-skincare.jpg"
          alt="Weekly skincare deals"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          style={{ objectPosition: 'center 55%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blush via-blush/80 to-transparent" />
        <div className="relative z-10 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <p className="eyebrow">Mega deals · this week only</p>
            <h2 className="mt-2 max-w-[20ch] font-display text-[26px] font-bold leading-tight text-ink sm:text-[34px]">
              Up to 40% off skincare &amp; mother care
            </h2>
          </div>
          <Link href="/products?deals=1" className="btn btn-primary btn-lg shrink-0">
            Shop the deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Shop by life stage ────────────────────────────────────── */
export function ShopByStage() {
  const stages = [
    {
      href: '/categories/mothercare-pregnancy',
      title: 'Mum-to-be',
      copy: 'Stretch-mark care, nipple balm, safe pregnancy skincare.',
      icon: Heart,
    },
    {
      href: '/categories/baby-care-essentials',
      title: 'Newborn & toddler',
      copy: 'Tear-free washes, lotions, rash creams and diapers.',
      icon: Sparkles,
    },
    {
      href: '/categories/facial-skincare',
      title: 'Face & glow',
      copy: 'Cleansers, serums, day creams and daily sunscreen.',
      icon: ShieldCheck,
    },
    {
      href: '/categories/haircare',
      title: 'Hair & scalp',
      copy: 'Shampoos, conditioners and treatments for every texture.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="container-page section-y" aria-label="Shop by life stage">
      <div className="section-head">
        <div>
          <p className="eyebrow">Shop by stage</p>
          <h2 className="section-title mt-1.5">Care that changes with you</h2>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map(({ href, title, copy, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 rounded-3xl border border-line bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_16px_36px_-20px_rgba(166,107,120,0.6)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-accent-deep transition-colors group-hover:bg-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-[18px] font-bold text-ink">{title}</h3>
            <p className="text-[12.5px] leading-relaxed text-muted">{copy}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[12px] font-bold text-accent-deep">
              Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
