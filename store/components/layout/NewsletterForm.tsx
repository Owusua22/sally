// components/layout/NewsletterForm.tsx
'use client';

import { useState } from 'react';
import { Check, Loader2, Mail } from 'lucide-react';

interface NewsletterFormProps {
  /** `inline` (footer) or `stacked` (homepage band). */
  variant?: 'inline' | 'stacked';
}

export function NewsletterForm({ variant = 'inline' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const list = JSON.parse(
        window.localStorage.getItem('glowmom-newsletter') ?? '[]'
      ) as string[];
      if (!list.includes(value)) list.push(value);
      window.localStorage.setItem('glowmom-newsletter', JSON.stringify(list));
    } catch {
      /* ignore storage errors */
    }

    setTimeout(() => {
      setStatus('done');
      setMessage('You are on the list! Watch out for our next drop.');
      setEmail('');
    }, 450);
  };

  const stacked = variant === 'stacked';

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={
          stacked
            ? 'flex flex-col gap-2.5 sm:flex-row'
            : 'flex h-11 items-center overflow-hidden rounded-full border border-line-strong bg-surface focus-within:border-primary'
        }
      >
        <div
          className={
            stacked
              ? 'flex h-12 flex-1 items-center gap-2 overflow-hidden rounded-full border border-line-strong bg-surface px-4 focus-within:border-primary'
              : 'flex h-full flex-1 items-center gap-2 px-3'
          }
        >
          <Mail className={stacked ? 'h-4 w-4 shrink-0 text-accent' : 'h-4 w-4 shrink-0 text-accent'} />
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== 'idle') {
                setStatus('idle');
                setMessage('');
              }
            }}
            type="email"
            required
            placeholder="Your email address"
            aria-label="Email address"
            className="h-full w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-muted/70"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={
            stacked
              ? 'btn btn-primary h-12 shrink-0 px-7'
              : 'm-1 flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-[12.5px] font-bold text-blush transition-colors hover:bg-accent disabled:opacity-60'
          }
        >
          {status === 'loading' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : status === 'done' ? (
            <Check className="h-3.5 w-3.5" />
          ) : null}
          Subscribe
        </button>
      </div>

      {message && (
        <p
          className={`mt-2 text-[11.5px] font-semibold ${
            status === 'error' ? 'text-danger' : 'text-success'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
