# GlowMom — Skincare & Mother Care

A Next.js 16 storefront and admin for GlowMom, a skincare, body care, haircare,
mothercare and baby shop in **East Doboro, Nsawam** (beside St. George's Height),
with delivery across Ghana.

Everything runs from this one folder. `npm install && npm run dev` gives you a
working shop with 19 demo products — no database, no keys, no signup required.

---

## Start here

```bash
cd store
npm install
npm run dev          # http://localhost:3000
```

Three commands you will use all the time:

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build && npm start` | Production build, then serve it |
| `npx tsc --noEmit` | Check types before you push |

That is it. The shop, the basket, checkout, the admin at `/admin/dashboard` and
the journal at `/blog` all work immediately in demo mode.

---

## The look: brand palette

Seven colours, defined once in `app/globals.css`. Change them there and the whole
site follows.

| Where it is used | Colour | Token |
| --- | --- | --- |
| Page background | `#FFF8F5` | `--blush` |
| Navigation bar | `#FBDCE2` | `--nav` |
| Buttons (Add to basket, Checkout, Place order) | `#FF9FB2` | `--primary` |
| Product cards, chips, soft panels | `#FBDCE2` | `--card` |
| Headings | `#49383D` | `--ink` |
| Body text | `#49383D` | `--ink` |
| Accents — icons, links, eyebrows, badges | `#A66B78` | `--accent` |

Two shades are derived from those seven so small text stays readable:

- `--accent-deep: #8A5561` — accent colour for body-size text on light
  backgrounds (5.5:1 on white).
- `--primary-strong: #FF8BA5` — button hover.

A few rules keep contrast honest, and they are enforced in CSS rather than by
memory:

- Anything painted pink (`bg-primary`, `bg-card`, `bg-nav`, `bg-blush`) gets
  `#49383D` text, even if a `text-white` class is present.
- Anything painted dark (`bg-ink`, `bg-accent`) gets `#FFF8F5` text.
- `text-brand` and `text-gold` resolve to `--accent-deep`, because `#FF9FB2` is
  unreadable at 13px on a light background.

Reusable classes live next to the tokens: `.btn`, `.btn-primary`, `.btn-dark`,
`.btn-outline`, `.btn-soft`, `.chip`, `.field-input`, `.field-label`,
`.field-error`, `.panel`, `.section-title`, `.eyebrow`, `.container-page`,
`.product-card`. Use them instead of re-inventing padding and radii.

Headings use a serif display stack (`--font-display`) and body copy uses
`--font-sans`. Both are system fonts, so nothing is downloaded at build time.

---

## How shopping works

A shopper cannot add anything to the basket until they sign in or create an
account. That is deliberate: the cart API rejects anonymous writes with `401`,
so asking up front avoids a dead end at checkout.

1. **Add to basket** while signed out → a toast explains why, and the sign-in
   dialog opens with "Create an account" one tap away. After signing in the
   shopper lands back on the page they started from.
2. **Basket** (`/cart`) shows a sign-in card for guests and the real basket for
   members, with a free-delivery progress bar.
3. **Checkout** (`/checkout`) is four steps: contact details → delivery method →
   payment method → terms. The order summary sits in a sticky column on desktop
   and shows the fee for the chosen town before anything is submitted.
4. **Payment** is never taken online. Cash on delivery, Mobile Money, or a card
   link sent after the order is confirmed.

The gate lives in `hooks/useGuardedCart.ts`. Every add-to-basket button
(`ProductCard`, `ProductDetails`, `AddtoCartButton`, showroom grids) calls it,
so there is one place to change the behaviour.

---

## Demo mode (no backend)

Without `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, the app
serves a bundled catalogue:

| Area | What you get |
| --- | --- |
| Catalogue | 19 products across 11 categories (`lib/demo/catalog.ts`) |
| Images | Local photos in `public/images/` |
| Basket | Saved in `localStorage` (`lib/demo/cart.ts`) |
| Sign in / sign up | The auth dialog, stored locally — any email + 6+ character password works |
| Checkout | Validates the form and returns a demo order number |
| Delivery | 12 Ghana towns in `lib/demo/shipping.ts` |
| Admin | Every page renders; writes show a demo notice |
| Journal | 4 articles in `lib/demo/blog.ts` |

A dismissible banner says demo mode is on. Add real keys to `.env.local` (copy
`.env.example`) and the same code paths switch to Supabase — no demo products
appear once the keys are set.

---

## Going live

The full walkthrough is in **[docs/backend-setup.md](docs/backend-setup.md)**.
The short version:

1. Create a Supabase project and run `supabase/schema.sql`, then
   `supabase/seed.sql`. Both are safe to re-run.
2. Create a user under **Authentication → Users**, then promote them:
   `update public.profiles set role = 'admin' where id = '<user-uuid>';`
3. Create a Cloudflare R2 bucket for product photos, issue an R2 API token with
   Object Read & Write, enable public access, and set
   `CLOUDFLARE_R2_PUBLIC_URL`.
4. Copy `.env.example` to `.env.local`, fill it in, restart the dev server.
5. Click **Sign in** in the navbar and open `/admin/dashboard`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin image uploads through Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=glow-up
CLOUDFLARE_R2_PUBLIC_URL=

# Public origin — canonical URLs, JSON-LD, auth redirects
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional: Search Console verification + GA4 measurement ID
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### Health check

`GET /api/health` reports which tables exist and whether R2 is configured. If
you see `Could not find the table 'public.x' in the schema cache`, your keys are
fine and `supabase/schema.sql` has not been run. Sign in and open
**`/admin/setup`** — it lists what is missing and copies the SQL for you.

### Database at a glance

| Tables | What they hold |
| --- | --- |
| `profiles` | Accounts and `role` (`customer` / `admin`), created on signup |
| `categories`, `brands`, `skin_types`, `products`, `product_variants` | The catalogue |
| `inventory_movements`, `low_stock_products`, `adjust_stock()` | Stock audit trail and alerts |
| `carts`, `cart_items`, `orders`, `order_items` | Shopping and checkout |
| `shipping_zones`, `shipping_discount_codes` | Delivery fees, ETAs, free-over amounts, promo codes |
| `blog_posts`, `newsletter_subscribers` | Journal and email list |

Row-level security is on for every table. The storefront reads active rows only,
customers see only their own basket and orders, and catalogue writes require
`role = 'admin'`. Admin API routes also verify the session server-side.

---

## Search engine setup

Most of this is already wired — you mainly need to set your real domain.

**Already in the code**

- `/sitemap.xml` — every product, category and journal post, with
  `lastModified` dates (`app/sitemap.ts`).
- `/robots.txt` — allows shop content, blocks `/admin`, `/api`, `/cart`,
  `/checkout` and account pages, plus `?sort=` style parameters that duplicate
  pages (`app/robots.ts`).
- JSON-LD on every page type: `OnlineStore` + `Store` + `HealthAndBeautyBusiness`
  and `WebSite` with `SearchAction` site-wide; `Product` with `Offer`,
  `shippingDetails` and `AggregateRating` on product pages; `CollectionPage` +
  `ItemList` on shop and category pages; `BlogPosting` on articles;
  `FAQPage` on the homepage, `/location` and product pages; `HowTo` on products
  that list how-to-use steps; `BreadcrumbList` throughout. Builders live in
  `lib/seo/jsonld.ts`, copy in `lib/seo/content.ts`.
- Titles, descriptions, canonical URLs, OpenGraph and Twitter cards on every
  public page. Filtered listings canonicalise back to `/products` and ask
  crawlers not to index them.
- `/opengraph-image` — a 1200×630 share card generated from the brand palette.
- `/manifest.webmanifest`, `/feed.xml` (journal RSS), `/sitemap` (a readable
  sitemap that also links every product), and a 404 page with search shortcuts.
- Skip link, labelled form fields, focus rings, and `prefers-reduced-motion`
  support.

**You need to do**

1. Set `NEXT_PUBLIC_SITE_URL` to your real domain. Canonical URLs, sitemap
   entries and JSON-LD all read it; leaving the default points them at the
   wrong site.
2. Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` after you add the property in
   Search Console.
3. Submit `https://your-domain.com/sitemap.xml` in Search Console.
4. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` if you want analytics. It loads after
   hydration and stays inert when unset.

Local business details (address, hours, phone, geo coordinates) come from
`lib/site.ts`. Update that file once and the footer, contact page, `/location`
and the store schema all change together.

---

## What is where

```
app/
  page.tsx                  homepage — hero, categories, shop-by-stage,
                            hot arrivals, mega deals, top picks, hot sellers,
                            promises, reviews, journal, newsletter
  products/                 shop listing + product detail
  categories/[slug]/        category listing
  cart/ checkout/           basket and the four-step checkout
  location/ policies/       local-SEO landing page and shop policies
  account/ profile/ orders/ customer area
  about/ contact/ terms/ privacy/
  blog/                     journal index + articles
  sitemap.ts robots.ts      /sitemap.xml and /robots.txt
  manifest.ts feed.xml/     web app manifest and journal RSS
  opengraph-image.tsx       generated share card
  (admin)/admin/…           dashboard, products, categories, brands, skin types,
                            stock, orders, shipping, showrooms, banners, users
  api/…                     cart, checkout, orders, search, shipping, admin
components/
  layout/                   Navbar, Footer, AppShell, newsletter
  home/                     Hero, category strip, product sections, promos
  products/                 ProductCard, ProductDetails, filters
  cart/                     CartSidebar, CartItem
  checkout/                 checkout sections, location picker, summary
  auth/                     the single sign-in / create-account dialog
  seo/                      JsonLd renderer + analytics
hooks/
  useCart.ts                basket state (Supabase or localStorage)
  useAuth.ts                session, sign in, sign up, sign out
  useGuardedCart.ts         the "sign in before adding" gate
lib/
  site.ts                   brand, contact and location content — edit this first
  seo/jsonld.ts             structured-data builders
  seo/content.ts            FAQ + policy copy shared by page and schema
  data/store.ts             product queries (Supabase → demo fallback)
  demo/                     bundled catalogue, blog, basket, shipping zones
supabase/
  schema.sql                tables, RLS policies, triggers, stock RPC
  seed.sql                  categories, products, zones, posts
docs/backend-setup.md       step-by-step Supabase + Cloudflare R2 guide
```

---

## Content you will want to edit first

| Change it | Go to |
| --- | --- |
| Shop name, phone, address, hours, domain | `lib/site.ts` |
| Colours | `:root` in `app/globals.css` |
| Homepage section order and headings | `app/page.tsx` |
| FAQ text (page + schema at once) | `lib/seo/content.ts` |
| Delivery fees and towns | `/admin/shipping` (or `lib/demo/shipping.ts` in demo) |
| Journal articles | `/admin/blog` (or `lib/demo/blog.ts` in demo) |

---

## Troubleshooting

**`Turbopack is not supported on this platform` / `dlopen … next-swc.darwin-arm64.node`**

That is a corrupted native binary, not an app bug — usually a download that got
cut short. Reinstall:

```bash
npm run reset          # deletes node_modules + .next
npm cache verify
npm install
npm run dev
```

While you wait for that, the Webpack fallback needs no native binaries:

```bash
npm run dev:webpack     # or: npm run build:webpack
```

**Other fixes**

- Run scripts from the folder that contains `package.json`, not the repo root.
- Node 20 or newer (`node -v`).
- On macOS, keep the project out of iCloud/Dropbox-synced folders and
  `~/Downloads` — move it to `~/Developer/store` if `.next` warns about the
  filesystem.
- Prices show as `GH₵` (see `formatCedis` in `lib/utils.ts`).
- `npm run build` succeeds with no environment variables set; all Supabase and
  R2 access is lazy and guarded.
