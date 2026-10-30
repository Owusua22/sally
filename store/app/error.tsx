// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow">Something broke</p>
      <h1 className="mt-3 font-display text-[30px] font-bold leading-tight text-ink sm:text-[38px]">
        That page hit a snag
      </h1>
      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">
        Nothing you did — it is on our side. Try again, or come back to the shop and
        pick up where you left off.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary btn-lg">
          Try again
        </button>
        <Link href="/" className="btn btn-outline btn-lg">
          Back to home
        </Link>
      </div>
    </div>
  );
}
