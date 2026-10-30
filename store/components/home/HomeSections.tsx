// components/home/HomeSections.tsx
// Supporting homepage sections: brand promise, customer reviews, journal
// preview and the newsletter band.

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Flower2,
  Leaf,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { site } from '@/lib/site';
import type { BlogPost } from '@/types';

/* ── Why shop with us ──────────────────────────────────────── */
export function PromiseBand() {
  const promises = [
    {
      icon: BadgeCheck,
      title: 'Genuine, always',
      copy: 'Every item is sourced from the brand or its authorised distributor. No fakes, no repackaging.',
    },
    {
      icon: Leaf,
      title: 'Mum & baby safe',
      copy: 'We read the label so you do not have to — no harsh bleach, no unlisted hydroquinone.',
    },
    {
      icon: Clock,
      title: 'Fast, honest delivery',
      copy: `Order before ${site.policy.sameDayCutoff} for same-day dispatch around Nsawam, 2–4 days nationwide.`,
    },
    {
      icon: ShieldCheck,
      title: 'Help after the sale',
      copy: 'WhatsApp a real person about a reaction, a swap or a delivery — we answer within minutes.',
    },
  ];

  return (
    <section className="bg-surface-soft py-12 sm:py-16" aria-label="Why shop with us">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <p className="eyebrow">Why {site.name}</p>
            <h2 className="section-title mt-2">
              Skincare advice, not just skincare shelves
            </h2>
            <p className="mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-ink/70">
              We are a mother-and-baby shop in East Doboro, Nsawam. Every product on
              this site is one we stock on our own shelf and would use on our own
              family — and we will tell you when something is not right for your skin.
            </p>
            <Link href="/about" className="btn btn-outline mt-6">
              Our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {promises.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-3xl border border-line bg-surface p-5 transition-shadow hover:shadow-[0_14px_32px_-24px_rgba(73,56,61,0.5)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-accent-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3.5 font-display text-[17px] font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Reviews ───────────────────────────────────────────────── */
const REVIEWS = [
  {
    name: 'Ama D.',
    location: 'East Legon, Accra',
    quote:
      'The shea body lotion is everything. My skin stayed soft through harmattan and delivery took one day.',
    stars: 5,
  },
  {
    name: 'Kwame A.',
    location: 'Kumasi',
    quote:
      'Ordered diapers and baby lotion on Friday, received them Saturday morning. Genuine products, fair prices.',
    stars: 5,
  },
  {
    name: 'Nana A.',
    location: 'Takoradi',
    quote:
      'The vitamin C serum cleared my dark spots in three weeks. Customer support on WhatsApp was super helpful.',
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="pt-12 sm:pt-16" aria-label="Customer reviews">
      <div className="container-page">
        <div className="section-head">
          <div>
            <p className="eyebrow">Loved by mums</p>
            <h2 className="section-title mt-1.5">Reviews from our shelves</h2>
            <p className="section-subtitle">4.9 out of 5 from 2,100+ verified orders.</p>
          </div>
          <Link href="/products?sort=popular" className="section-link">
            Shop best sellers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col rounded-3xl border border-line bg-surface p-6"
            >
              <div
                className="flex gap-0.5 text-primary"
                aria-label={`${review.stars} star review`}
              >
                {Array.from({ length: review.stars }).map((_, index) => (
                  <span key={index} aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink/80">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-4 border-t border-line pt-3 text-[12px] font-bold text-ink">
                {review.name}
                <span className="ml-1 font-medium text-muted">· {review.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Journal preview ───────────────────────────────────────── */
export function JournalPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="pt-12 sm:pt-16" aria-label="From the journal">
      <div className="container-page">
        <div className="section-head">
          <div>
            <p className="eyebrow">The {site.name} journal</p>
            <h2 className="section-title mt-1.5">Skincare notes that actually help</h2>
            <p className="section-subtitle">
              Routines, ingredient guides and mother-care tips from our counter.
            </p>
          </div>
          <Link href="/blog" className="section-link">
            Read the journal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(73,56,61,0.55)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-card">
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-accent/40">
                    <Flower2 className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wide text-accent-deep">
                  {post.category ?? 'Skincare'}
                  <span className="text-accent/50">·</span>
                  <span className="text-muted">{post.read_minutes} min read</span>
                </div>
                <h3 className="mt-2 font-display text-[18px] font-bold leading-snug text-ink">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Newsletter / WhatsApp band ────────────────────────────── */
export function NewsletterBand() {
  return (
    <section className="pt-12 sm:pt-16" aria-label="Newsletter">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[28px] bg-card p-7 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/40 blur-3xl"
          />
          <div className="relative grid gap-7 md:grid-cols-[1fr_0.9fr] md:items-center md:gap-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-deep">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Members only
              </span>
              <h2 className="mt-4 max-w-[20ch] font-display text-[26px] font-bold leading-tight text-ink sm:text-[32px]">
                Restock alerts and 30% off drops
              </h2>
              <p className="mt-2.5 max-w-[46ch] text-[13px] text-ink/70">
                Join our list for skincare tips, mother-care guides and first access to
                our weekly markdowns. No spam, unsubscribe any time.
              </p>
            </div>

            <div className="md:justify-self-end md:pl-4">
              <NewsletterForm variant="stacked" />
              <p className="mt-3 text-[11.5px] text-muted">
                Prefer to talk to us?{' '}
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  className="font-bold text-accent-deep underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp {site.whatsappDisplay}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
