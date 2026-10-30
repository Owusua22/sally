// components/home/HeroBanner.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { formatCedis } from '@/lib/utils';
import { site } from '@/lib/site';

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  link_url: string | null;
  link_text: string | null;
}

interface HeroBannerProps {
  banners: Banner[];
}

const FALLBACK: Banner[] = [
  {
    id: 'fallback-1',
    title: 'Gentle care for every mother',
    subtitle: 'Skincare · Body care · Mother & baby',
    description:
      'Authentic lotions, serums, hair care and baby essentials — picked for Ghanaian skin, delivered to your door.',
    image_url: '/images/hero-skincare.jpg',
    link_url: '/products',
    link_text: 'Shop skincare',
  },
];

export function HeroBanner({ banners }: HeroBannerProps) {
  const slides = banners.length > 0 ? banners : FALLBACK;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(0);
  const total = slides.length;

  const go = useCallback(
    (direction: 1 | -1) => {
      setIndex((current) => (current + direction + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(() => go(1), 7000);
    return () => clearInterval(timer);
  }, [go, paused, total]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  return (
    <section className="relative overflow-hidden bg-blush pb-8 pt-6 sm:pb-12 sm:pt-9" aria-label="Featured offers">
      {/* soft decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-nav blur-3xl" />
      </div>

      <div
        className="container-page relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(event) => {
          const delta = touchStart.current - event.changedTouches[0].clientX;
          if (Math.abs(delta) > 40) go(delta > 0 ? 1 : -1);
          setPaused(false);
        }}
      >
        <div className="relative overflow-hidden rounded-[28px] bg-nav shadow-[0_24px_60px_-30px_rgba(73,56,61,0.35)]">
          <div className="relative min-h-[420px] sm:min-h-[440px] lg:min-h-[520px]">
            {slides.map((slide, slideIndex) => (
              <div
                key={slide.id}
                aria-hidden={slideIndex !== index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  slideIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <div className="grid h-full items-center gap-6 p-6 sm:p-9 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-14">
                  {/* copy */}
                  <div className="relative z-10 order-2 lg:order-1">
                    <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-deep shadow-sm sm:text-[11px]">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      {slide.subtitle ?? 'New season essentials'}
                    </span>

                    {slideIndex === index ? (
                      <h1 className="mt-4 max-w-[16ch] font-display text-[34px] font-bold leading-[1.06] tracking-tight text-ink sm:text-[44px] lg:max-w-[15ch] lg:text-[56px]">
                        {slide.title ?? 'Skin care you can trust'}
                      </h1>
                    ) : (
                      <p className="mt-4 max-w-[16ch] font-display text-[34px] font-bold leading-[1.06] tracking-tight text-ink sm:text-[44px] lg:max-w-[15ch] lg:text-[56px]">
                        {slide.title ?? 'Skin care you can trust'}
                      </p>
                    )}

                    <p className="mt-4 max-w-[46ch] text-[13.5px] leading-relaxed text-ink/75 sm:text-[15px]">
                      {slide.description ??
                        'Shop authentic skincare essentials with nationwide delivery.'}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Link href={slide.link_url || '/products'} className="btn btn-primary btn-lg">
                        {slide.link_text || 'Shop now'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/categories/mothercare-pregnancy"
                        className="btn btn-outline btn-lg bg-surface/60"
                      >
                        Mother &amp; baby
                      </Link>
                    </div>

                    <dl className="mt-7 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-5">
                      {[
                        { value: '100%', label: 'Authentic brands' },
                        { value: '2–4', label: 'Day delivery' },
                        { value: formatCedis(site.freeDeliveryThreshold), label: 'Free delivery over' },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <dt className="font-display text-[19px] font-bold text-ink sm:text-[22px]">
                            {stat.value}
                          </dt>
                          <dd className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-accent-deep">
                            {stat.label}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* image */}
                  <div className="relative order-1 lg:order-2">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-surface shadow-lg lg:aspect-[5/5]">
                      <Image
                        src={slide.image_url || '/images/hero-skincare.jpg'}
                        alt={slide.title ?? 'Skincare offer'}
                        fill
                        priority={slideIndex === 0}
                        loading={slideIndex === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        className="object-cover"
                        style={{ objectPosition: '60% center' }}
                      />
                    </div>

                    <div className="absolute -bottom-4 left-4 hidden items-center gap-2.5 rounded-2xl bg-surface px-4 py-3 shadow-lg sm:flex">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base">
                        ★
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[12.5px] font-bold text-ink">4.9 out of 5</span>
                        <span className="block text-[10.5px] text-muted">2,100+ happy mums</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md transition-colors hover:bg-surface sm:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md transition-colors hover:bg-surface sm:flex"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
                  {slides.map((slide, dotIndex) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setIndex(dotIndex)}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        dotIndex === index ? 'w-7 bg-ink' : 'w-1.5 bg-ink/25'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
