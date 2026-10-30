// components/home/HeroBanner.tsx
// The homepage hero is the banner artwork only — no card, no overlay, no copy.
// Anything the shopper needs to read lives in the sections underneath it.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    title: 'GlowMom skincare and mother care',
    subtitle: null,
    description: null,
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
    [total],
  );

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(() => go(1), 6000);
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
    <section className="container-page pt-5 sm:pt-7" aria-label="Featured offers">
      <div
        className="relative"
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
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-nav sm:aspect-[16/10] sm:rounded-[26px] lg:aspect-[2/1]">
          {slides.map((slide, slideIndex) => {
            const image = (
              <Image
                src={slide.image_url || '/images/hero-skincare.jpg'}
                alt={slide.title ?? 'GlowMom skincare and mother care'}
                fill
                priority={slideIndex === 0}
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
                sizes="(max-width: 1280px) 100vw, 1240px"
                className="object-cover"
              />
            );

            return (
              <div
                key={slide.id}
                aria-hidden={slideIndex !== index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  slideIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {slide.link_url && slideIndex === index ? (
                  <Link
                    href={slide.link_url}
                    aria-label={slide.link_text || slide.title || 'Shop now'}
                    className="block h-full w-full"
                  >
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </div>
            );
          })}

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md backdrop-blur transition-colors hover:bg-surface sm:flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md backdrop-blur transition-colors hover:bg-surface sm:flex"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
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
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
