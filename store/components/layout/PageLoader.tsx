// components/layout/PageLoader.tsx
// The one loading state used across the storefront.
//
// A route-level skeleton can only ever guess at the page it is standing in for,
// and a wrong guess looks worse than no guess at all — so every route shows a
// centred spinner instead. It keeps the page container, so nothing jumps
// sideways when the real content arrives.

interface PageLoaderProps {
  label?: string;
}

export function PageLoader({ label = 'Loading' }: PageLoaderProps) {
  return (
    <div
      className="container-page flex min-h-[55vh] items-center justify-center py-16"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{label}…</span>
      <span
        aria-hidden="true"
        className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-primary"
      />
    </div>
  );
}

export default PageLoader;
