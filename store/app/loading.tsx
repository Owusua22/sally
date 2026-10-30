// app/loading.tsx — route-level fallback.
// Only the product grid is skeletonised; the page chrome around it is real
// chrome, so there is nothing above the grid to fake.
export default function Loading() {
  return (
    <div className="container-page py-12 sm:py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading products…</span>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
        aria-hidden="true"
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[18px] border border-line bg-card"
          >
            <div className="aspect-square animate-pulse bg-nav/60" />
            <div className="space-y-2 p-3.5">
              <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-nav" />
              <div className="h-3 w-full animate-pulse rounded-full bg-nav" />
              <div className="h-3.5 w-1/2 animate-pulse rounded-full bg-nav" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
