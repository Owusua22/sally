// app/loading.tsx — route-level skeleton used while a page streams in.
export default function Loading() {
  return (
    <div className="container-page py-10" aria-busy="true" aria-label="Loading page">
      <div className="h-3 w-24 animate-pulse rounded-full bg-card" />
      <div className="mt-4 h-8 w-2/3 max-w-lg animate-pulse rounded-2xl bg-card" />
      <div className="mt-3 h-4 w-1/2 max-w-sm animate-pulse rounded-full bg-card" />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[18px] border border-line bg-card">
            <div className="aspect-square animate-pulse bg-surface" />
            <div className="space-y-2 p-3.5">
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-surface" />
              <div className="h-3 w-full animate-pulse rounded-full bg-surface" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-surface" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
