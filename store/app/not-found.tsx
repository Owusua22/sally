// app/not-found.tsx
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { POPULAR_SEARCHES, site } from '@/lib/site';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-display text-[34px] font-bold leading-tight text-ink sm:text-[44px]">
        We could not find that page
      </h1>
      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">
        The link may be old or the product may have sold out. Try a search, or head
        back to the shop floor.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {POPULAR_SEARCHES.slice(0, 5).map((term) => (
          <Link
            key={term}
            href={`/products?q=${encodeURIComponent(term)}`}
            className="chip"
          >
            <Search className="h-3.5 w-3.5 text-accent" />
            {term}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn btn-primary btn-lg">
          Shop all products <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn btn-outline btn-lg">
          Back to home
        </Link>
      </div>

      <p className="mt-8 text-[12px] text-muted">
        Need a hand? WhatsApp us on {site.whatsappDisplay} — we answer quickly.
      </p>
    </div>
  );
}
