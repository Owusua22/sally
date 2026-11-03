'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/stores/authModalStore';
import { describeAuthError } from '@/lib/auth-errors';
import { toast } from 'react-toastify';
import { Loader2, Sparkles } from 'lucide-react';

// Simple eye icons (inline SVG) for accessibility
const EyeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M6.53 6.53C4.06 8.36 2.25 12 2.25 12s3.75 7.5 9.75 7.5c1.61 0 3.14-.29 4.53-.81M17.47 17.47C19.94 15.64 21.75 12 21.75 12S18 4.5 12 4.5c-1.61 0-3.14.29-4.53.81" />
  </svg>
);

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    // Contact number is required: we call/WhatsApp customers about deliveries.
    phone: z
      .string()
      .min(1, 'Contact number is required')
      .refine((val) => /^[+]?[\d\s().-]{7,20}$/.test(val.trim()), {
        message: 'Enter a valid phone number (e.g., 054 945 5367)',
      })
      .refine((val) => val.replace(/\D/g, '').length >= 9, {
        message: 'Enter a valid phone number (e.g., 054 945 5367)',
      }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain one uppercase letter')
      .regex(/[0-9]/, 'Must contain one number'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { signUp } = useAuth();
  const { openAuth } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setFormError(null);

      const email = data.email.toLowerCase().trim();
      const { needsEmailConfirmation } = await signUp(
        email,
        data.password,
        data.full_name,
        data.phone
      );

      toast.success(
        needsEmailConfirmation
          ? 'Account created! Confirm your email, then sign in.'
          : 'Account created successfully! Please sign in.'
      );

      onSuccess?.();

      // Never auto-signed-in: swap this dialog to the sign-in view, with the email
      // already filled in and a note about confirming the address when required.
      openAuth({
        view: 'login',
        notice: needsEmailConfirmation ? 'confirm' : 'registered',
        email,
      });
    } catch (err: unknown) {
      const info = describeAuthError(err);
      setFormError(info.message);
      toast.error(info.message, { autoClose: 8000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {onSwitchToLogin ? (
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-accent-deep">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="mt-3 font-display text-[24px] font-bold text-ink">
            Create your account
          </h2>
          <p className="mt-1.5 text-[13px] text-muted">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-accent-deep underline underline-offset-2"
            >
              Sign in
            </button>
          </p>
        </div>
      ) : null}

      {formError ? (
        <p
          role="alert"
          className="rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-[12.5px] leading-relaxed text-danger"
        >
          {formError}
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="field-label">
            Full Name
          </label>
          <input
            {...register('full_name')}
            id="full_name"
            type="text"
            autoComplete="name"
            className="field-input"
            placeholder="Jane Doe"
          />
          {errors.full_name && (
            <p className="field-error">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="email"
            className="field-input"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="field-error">{errors.email.message}</p>
          )}
        </div>

        {/* Contact number */}
        <div>
          <label htmlFor="phone" className="field-label">
            Contact number
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-describedby="phone-hint"
            className="field-input"
            placeholder="054 945 5367"
          />
          {errors.phone ? (
            <p className="field-error">{errors.phone.message}</p>
          ) : (
            <p id="phone-hint" className="mt-1.5 text-[11.5px] text-muted">
              We&apos;ll call or WhatsApp you about delivery.
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="field-input pr-11"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-2 flex items-center text-muted hover:text-ink/80"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.password && (
            <p className="field-error">{errors.password.message}</p>
          )}
          <p className="mt-1.5 text-[11.5px] text-muted">
            At least 8 characters, with an uppercase letter and a number.
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm_password" className="field-label">
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register('confirm_password')}
              id="confirm_password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="field-input pr-11"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-2 flex items-center text-muted hover:text-ink/80"
            >
              {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="field-error">{errors.confirm_password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-lg btn-block"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

    </div>
  );
}