import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { Button, FormField, Input } from '@/components/common';
import {
  useResendOtp,
  useVerifyOtp,
  verifyOtpSchema,
  type VerifyOtpFormType,
} from '@/features/auth';
import { useTimer } from '@/hooks';

interface VerifyOtpLocationState {
  email?: string;
}

export function VerifyOtpForm() {
  const location = useLocation();
  const email = (location.state as VerifyOtpLocationState | null)?.email?.trim() ?? '';
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();
  const { remainingSeconds, start } = useTimer();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOtpFormType>({
    resolver: zodResolver(verifyOtpSchema),
    mode: 'onChange',
    defaultValues: {
      email,
      otp: '',
    },
  });

  const onSubmit = handleSubmit(values => {
    verifyOtp(values);
  });

  const cooldownLabel = `${Math.floor(remainingSeconds / 60)}:${String(
    remainingSeconds % 60
  ).padStart(2, '0')}`;

  const handleResend = () => {
    if (isVerifying || isResending || remainingSeconds > 0) {
      return;
    }

    resendOtp(
      { email },
      {
        onSuccess: () => {
          start();
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" {...register('email')} />
        <div className="space-y-1.5">
          <p id="verification-email-label" className="text-[13px] font-medium text-foreground">
            Email Address
          </p>
          <div
            role="status"
            aria-labelledby="verification-email-label"
            className="flex h-10 w-full items-center gap-3 rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
          >
            <Mail size={16} aria-hidden="true" />
            <span className="truncate">{email}</span>
          </div>
        </div>
        <FormField
          label="Verification Code"
          required
          helperText="Enter the 6-digit code sent to your email."
        >
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            error={errors.otp?.message}
            {...register('otp')}
            onChange={event => {
              const digits = event.currentTarget.value.replace(/\D/g, '').slice(0, 6);
              event.currentTarget.value = digits;
              setValue('otp', digits, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
        </FormField>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isFullWidth
          isLoading={isVerifying}
          disabled={isResending}
          rightIcon={<ArrowRight size={17} />}
        >
          Verify email
        </Button>
      </form>
      <Button
        type="button"
        variant="link"
        isFullWidth
        isLoading={isResending}
        disabled={isVerifying || isResending || remainingSeconds > 0}
        onClick={handleResend}
      >
        {isResending
          ? 'Sending code…'
          : remainingSeconds > 0
            ? `Resend available in ${cooldownLabel}`
            : 'Resend code'}
      </Button>
    </div>
  );
}
