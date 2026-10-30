'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Loader2, MailCheck, Sparkles } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { describeAuthError } from '@/lib/auth-errors';
import { site } from '@/lib/site';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  /** Pre-filled from a registration or an auth redirect. */
  defaultEmail?: string;
}

export function LoginForm({ onSuccess, onSwitchToRegister, defaultEmail = '' }: LoginFormProps) {
  const { signIn, resendConfirmation } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail, password: '' },
  });

  useEffect(() => {
    if (defaultEmail) setValue('email', defaultEmail);
  }, [defaultEmail, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setNeedsConfirmation(false);
      setFormError(null);
      await signIn(data.email.toLowerCase().trim(), data.password);
      toast.success('Welcome back!');
      onSuccess?.();
    } catch (err: unknown) {
      const info = describeAuthError(err);
      setNeedsConfirmation(Boolean(info.needsConfirmation));
      // Inline as well as a toast: the dialog is the only place a shopper can
      // find out why a sign-in failed.
      setFormError(info.message);
      toast.error(info.message, { autoClose: 8000 });
    } finally {
      setIsLoading(false);
    }
  };

  const resend = async () => {
    const target = (getValues('email') || defaultEmail).toLowerCase().trim();
    if (!target) {
      toast.error('Enter your email address first.');
      return;
    }
    setResending(true);
    try {
      await resendConfirmation(target);
      toast.success(`Confirmation email sent to ${target}.`, { autoClose: 8000 });
    } catch (err: unknown) {
      toast.error(describeAuthError(err).message, { autoClose: 8000 });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-accent-deep">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="mt-3 font-display text-[24px] font-bold text-ink">Welcome back</h2>
        <p className="mt-1.5 text-[13px] text-muted">
          New to {site.name}?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-accent-deep underline underline-offset-2"
          >
            Create an account
          </button>
        </p>
      </div>

      {formError ? (
        <p
          role="alert"
          className="rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-[12.5px] leading-relaxed text-danger"
        >
          {formError}
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="auth-email" className="field-label">
            Email address
          </label>
          <input
            {...register('email')}
            id="auth-email"
            type="email"
            autoComplete="email"
            autoFocus
            className="field-input"
            placeholder="you@example.com"
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="auth-password" className="field-label">
            Password
          </label>
          <input
            {...register('password')}
            id="auth-password"
            type="password"
            autoComplete="current-password"
            className="field-input"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="field-error">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-lg btn-block"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {needsConfirmation ? (
        <button
          type="button"
          onClick={resend}
          disabled={resending}
          className="btn btn-outline btn-block"
        >
          {resending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MailCheck className="h-4 w-4" />
          )}
          Resend confirmation email
        </button>
      ) : null}
    </div>
  );
}

export default LoginForm;
