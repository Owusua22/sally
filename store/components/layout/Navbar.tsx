// components/layout/Navbar.tsx
'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Grid2X2,
  Heart,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { cn, formatCedis } from '@/lib/utils';
import { useAuthModal } from '@/stores/authModalStore';
import { NAV_CATEGORIES, POPULAR_SEARCHES, site } from '@/lib/site';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: number | null;
  compare_at_price: number | null;
}

const PRIMARY_LINKS = [
  { href: '/products?sort=newest', label: 'New Arrivals' },
  { href: '/products?sort=popular', label: 'Best Sellers' },
  { href: '/categories/bath-body-care', label: 'Body Care' },
  { href: '/categories/facial-skincare', label: 'Face Care' },
  { href: '/categories/baby-care-essentials', label: 'Baby Care' },
  { href: '/categories/mothercare-pregnancy', label: 'Mother Care' },
  { href: '/blog', label: 'Journal' },
] as const;

function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${site.name} home`}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-blush shadow-sm sm:h-11 sm:w-11">
        <Sparkles className="h-5 w-5" strokeWidth={2.2} />
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-nav bg-primary" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            'block font-display text-[24px] font-bold tracking-tight sm:text-[27px]',
            onDark ? 'text-blush' : 'text-ink'
          )}
        >
          {site.name}
        </span>
        <span
          className={cn(
            'mt-1 block text-[9px] font-semibold uppercase tracking-[0.24em] sm:text-[10px]',
            onDark ? 'text-blush/60' : 'text-accent-deep'
          )}
        >
          Skincare · Mother Care
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname() ?? '';

  const { isAuthenticated, profile, signOut, isLoading: authLoading } = useAuth();
  const { totalItems, totalPrice, toggleCart } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openAuthModal = useAuthModal((state) => state.openAuth);

  const accountRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Track the previous pathname so client-side navigation closes every menu.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setSearchOpen(false);
    setCategoriesOpen(false);
    setAccountOpen(false);
  }

  // Hydration-safe "mounted" flag: false while server-rendering and during the
  // first client render, true afterwards. Avoids auth/cart hydration mismatches.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const openAuth = useCallback(
    (mode: 'login' | 'register') => {
      openAuthModal({ view: mode, redirectTo: pathname || '/' });
      setMobileOpen(false);
    },
    [openAuthModal, pathname]
  );

  const handleSignOut = async () => {
    setAccountOpen(false);
    setMobileOpen(false);
    await signOut();
  };

  const displayName =
    profile?.full_name?.split(' ')[0] ||
    profile?.email?.split('@')[0] ||
    'Account';
  const initial = (profile?.full_name || profile?.email || 'U')
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* ── Utility strip ─────────────────────────────────────── */}
      <div className="hidden bg-ink text-[11.5px] text-blush/75 md:block">
        <div className="container-page flex h-9 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-primary" />
              Delivering across Ghana · Free over {formatCedis(site.freeDeliveryThreshold)}
            </span>
            <span className="h-3 w-px bg-blush/25" />
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
              {site.phoneDisplay}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/orders" className="transition-colors hover:text-primary">
              Track order
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Help centre
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              About us
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-line-strong bg-nav">
        <div className="container-page">
          <div className="flex h-16 items-center gap-3 sm:h-[76px] sm:gap-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/70 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Logo />

            {/* Desktop search */}
            <form action="/products" className="hidden flex-1 items-center md:flex" role="search">
              <div className="flex h-11 w-full items-center rounded-full border border-white/80 bg-white/80 pl-4 shadow-sm transition-all focus-within:border-primary focus-within:bg-white focus-within:shadow-md">
                <Search className="h-4 w-4 shrink-0 text-accent" />
                <input
                  name="q"
                  type="search"
                  placeholder="Search lotions, serums, shampoo, diapers…"
                  className="h-full w-full bg-transparent px-3 text-[13.5px] text-ink outline-none placeholder:text-muted/70"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="m-1 flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 text-[13px] font-bold text-ink transition-colors hover:bg-primary-strong"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search
                </button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/70 md:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Account */}
              <div ref={accountRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex h-10 items-center gap-2 rounded-full px-2 text-left transition-colors hover:bg-white/70"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-sm">
                    {mounted && isAuthenticated ? (
                      <span className="text-xs font-extrabold text-accent-deep">{initial}</span>
                    ) : (
                      <User className="h-[18px] w-[18px]" />
                    )}
                  </span>
                  <span className="hidden leading-tight lg:block">
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {mounted && isAuthenticated ? 'Welcome back' : 'Account'}
                    </span>
                    <span className="flex items-center gap-1 text-[13px] font-bold text-ink">
                      {mounted && isAuthenticated ? displayName : 'Sign in'}
                      <ChevronDown className="h-3.5 w-3.5 text-accent" />
                    </span>
                  </span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
                    {!authLoading && isAuthenticated ? (
                      <>
                        <div className="border-b border-line bg-surface-soft px-4 py-3">
                          <p className="truncate text-[13px] font-bold text-ink">
                            {profile?.full_name || displayName}
                          </p>
                          <p className="truncate text-[11px] text-muted">{profile?.email}</p>
                        </div>
                        <div className="p-1.5">
                          {[
                            { href: '/account', label: 'My account', icon: User },
                            { href: '/orders', label: 'My orders', icon: Package },
                            { href: '/profile', label: 'Saved items', icon: Heart },
                            { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                          ].map(({ href, label, icon: Icon }) => (
                            <Link
                              key={href}
                              href={href}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-surface-soft"
                            >
                              <Icon className="h-4 w-4 text-accent" /> {label}
                            </Link>
                          ))}
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                          >
                            <LogOut className="h-4 w-4" /> Sign out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4">
                        <p className="mb-3 text-[12px] leading-relaxed text-muted">
                          Sign in for faster checkout, order tracking and members-only prices.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountOpen(false);
                            openAuth('login');
                          }}
                          className="btn btn-primary btn-block mb-2"
                        >
                          Sign in
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountOpen(false);
                            openAuth('register');
                          }}
                          className="btn btn-outline btn-block"
                        >
                          Create account
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                type="button"
                onClick={toggleCart}
                className="flex h-10 items-center gap-2 rounded-full px-2 text-ink transition-colors hover:bg-white/70"
                aria-label={`Open cart, ${totalItems} items`}
              >
                <span className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1 text-[10px] font-extrabold text-blush">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                </span>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted">
                    My cart
                  </span>
                  <span className="block text-[13px] font-bold text-ink">
                    {formatCedis(totalPrice)}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Mobile search row */}
          <form action="/products" className="pb-3 md:hidden" role="search">
            <div className="flex h-10 items-center rounded-full border border-white/80 bg-white/80 pl-4">
              <Search className="h-4 w-4 text-accent" />
              <input
                name="q"
                type="search"
                placeholder="Search skincare, baby care…"
                className="h-full w-full bg-transparent px-3 text-[13px] text-ink outline-none placeholder:text-muted/70"
                aria-label="Search products"
              />
            </div>
          </form>
        </div>

        {/* ── Category navigation ───────────────────────────── */}
        <div className="hidden border-t border-white/60 lg:block">
          <div className="container-page flex h-12 items-center gap-1">
            <div ref={categoryRef} className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen((v) => !v)}
                className="flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[12px] font-bold uppercase tracking-wide text-blush transition-colors hover:bg-accent"
              >
                <Grid2X2 className="h-4 w-4" />
                All Categories
                <ChevronDown
                  className={cn('h-3.5 w-3.5 transition-transform', categoriesOpen && 'rotate-180')}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 top-[calc(100%+10px)] z-50 grid w-[560px] grid-cols-2 gap-1 rounded-2xl border border-line bg-surface p-3 shadow-2xl">
                  {NAV_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-card"
                    >
                      <span className="text-base">{category.icon}</span>
                      {category.name}
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-line-strong" />
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="col-span-2 mt-1 flex items-center justify-between rounded-xl bg-surface-soft px-3 py-2.5 text-[12.5px] font-bold text-accent-deep transition-colors hover:bg-card"
                  >
                    Shop all products
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            <nav className="ml-2 flex items-center gap-0.5">
              {PRIMARY_LINKS.map((link) => {
                const active = pathname === link.href.split('?')[0] && link.href !== '/blog';
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors',
                      active ? 'bg-white text-ink' : 'text-ink/80 hover:bg-white/70 hover:text-ink'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/products?deals=1"
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-2 text-[12px] font-bold text-ink transition-colors hover:bg-primary-strong"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Deals
              </Link>
            </nav>

            <div className="ml-auto hidden items-center gap-1.5 text-[11.5px] font-semibold text-muted xl:flex">
              <Truck className="h-4 w-4 text-accent" />
              Pay on delivery available in Accra &amp; Kumasi
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ───────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-blush shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-card"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <p className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.18em] text-accent-deep">
                Shop by category
              </p>
              <div className="mb-6 grid grid-cols-2 gap-2">
                {NAV_CATEGORIES.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5 text-[12.5px] font-semibold text-ink"
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </Link>
                ))}
              </div>

              <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-accent-deep">
                Quick links
              </p>
              <div className="mb-6 flex flex-col">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/products', label: 'Shop all products' },
                  { href: '/orders', label: 'Track my order' },
                  { href: '/about', label: 'About us' },
                  { href: '/contact', label: 'Contact' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between border-b border-line py-3 text-[13.5px] font-semibold text-ink"
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-accent" />
                  </Link>
                ))}
              </div>

              {mounted && isAuthenticated ? (
                <div className="space-y-2">
                  <Link href="/account" className="btn btn-primary btn-block">
                    My account
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn btn-outline btn-block"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => openAuth('login')}
                    className="btn btn-primary btn-block"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuth('register')}
                    className="btn btn-outline btn-block"
                  >
                    Create account
                  </button>
                </div>
              )}

              <a
                href={`tel:${site.phone}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-card py-3 text-[12.5px] font-bold text-ink"
              >
                <Phone className="h-4 w-4 text-accent" />
                Call us: {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Search overlay ────────────────────────────────────── */}
      {searchOpen && <SearchOverlay key="search" open onClose={() => setSearchOpen(false)} />}

      {/* ── Mobile bottom nav ─────────────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-nav/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-4">
          {[
            { href: '/', label: 'Home', icon: Home },
            { href: '/products', label: 'Shop', icon: Search },
            { href: '/categories/bath-body-care', label: 'Categories', icon: Grid2X2 },
          ].map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2 text-[10.5px] font-semibold',
                  active ? 'text-accent-deep' : 'text-ink/70'
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={toggleCart}
            className="relative flex flex-col items-center gap-0.5 py-2 text-[10.5px] font-semibold text-ink/70"
          >
            <ShoppingBag className="h-5 w-5" />
            Cart
            {totalItems > 0 && (
              <span className="absolute right-5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-blush">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   Search overlay with live results
   ──────────────────────────────────────────────────────────── */

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Debounced live search.
  useEffect(() => {
    if (!open) return;

    const query = term.trim();
    if (query.length < 2) return;

    let active = true;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}&limit=6`,
          { cache: 'no-store' }
        );
        const json = await response.json();
        if (active) setResults((json.data ?? []) as SearchResult[]);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 220);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [term, open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = term.trim();
    onClose();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : '/products');
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-[8vh] w-[94%] max-w-2xl overflow-hidden rounded-3xl bg-surface shadow-2xl">
        <form onSubmit={submit} className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search className="h-5 w-5 text-accent" />
          <input
            ref={inputRef}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search for body lotion, serum, baby diapers…"
            className="h-10 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-muted/70"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-soft"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {term.trim().length < 2 ? (
            <div>
              <p className="mb-2 px-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-accent-deep">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCHES.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => setTerm(keyword)}
                    className="chip"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <p className="px-2 py-6 text-center text-[12.5px] text-muted">Searching…</p>
          ) : results.length === 0 ? (
            <div className="px-2 py-6 text-center">
              <p className="text-[13px] font-semibold text-ink">No matches for “{term}”</p>
              <p className="mt-1 text-[12px] text-muted">
                Try a different product name or browse all products.
              </p>
              <Link href="/products" onClick={onClose} className="btn btn-primary mt-4">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/products/${result.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-surface-soft"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-soft">
                    {result.thumbnail && (
                      <Image
                        src={result.thumbnail}
                        alt={result.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">{result.name}</p>
                    <p className="text-[12px] font-bold text-accent-deep">
                      {formatCedis(result.price ?? 0)}
                      {result.compare_at_price ? (
                        <span className="ml-2 font-medium text-muted line-through">
                          {formatCedis(result.compare_at_price)}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-accent" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
