import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, KeyRound, Lock, RotateCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, FormField, Input, PasswordInput } from '@/components/common';
import {
  resetPasswordSchema,
  useForgotPassword,
  useResetPassword,
  type ResetPasswordFormType,
} from '@/features/auth';
import { useTimer } from '@/hooks';

interface ResetPasswordFormProps {
  email: string;
  onChangeEmail: () => void;
}

export function ResetPasswordForm({ email, onChangeEmail }: ResetPasswordFormProps) {
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();
  const { mutate: resendCode, isPending: isResending } = useForgotPassword();
  const { remainingSeconds, start } = useTimer();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email,
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(({ confirmPassword: _confirmPassword, ...data }) => {
    resetPassword(data);
  });

  const handleResend = () => {
    if (isResetting || isResending || remainingSeconds > 0) {
      return;
    }

    resendCode(email, {
      onSuccess: () => start(),
    });
  };

  const cooldownLabel = `${Math.floor(remainingSeconds / 60)}:${String(
    remainingSeconds % 60
  ).padStart(2, '0')}`;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...register('email')} />
      <div className="space-y-1.5">
        <p id="reset-email-label" className="text-[13px] font-medium text-foreground">
          Reset code sent to
        </p>
        <div
          role="status"
          aria-labelledby="reset-email-label"
          className="flex min-h-10 items-center justify-between gap-3 rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
        >
          <span className="truncate">{email}</span>
          <button
            type="button"
            disabled={isResetting || isResending}
            onClick={onChangeEmail}
            className="shrink-0 font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Change
          </button>
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
          leftIcon={<KeyRound size={16} />}
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
      <FormField
        label="New Password"
        required
        helperText="Use 8–25 characters with uppercase, lowercase, a number, and a special character."
      >
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          placeholder="Create a new password"
          leftIcon={<Lock size={16} />}
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
      </FormField>
      <FormField label="Confirm New Password" required>
        <PasswordInput
          id="confirm-new-password"
          autoComplete="new-password"
          placeholder="Enter your new password again"
          leftIcon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </FormField>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">Didn’t receive the code?</span>
        <Button
          type="button"
          variant="link"
          size="sm"
          isLoading={isResending}
          disabled={isResetting || isResending || remainingSeconds > 0}
          leftIcon={<RotateCcw size={14} />}
          onClick={handleResend}
        >
          {isResending
            ? 'Sending code…'
            : remainingSeconds > 0
              ? `Resend in ${cooldownLabel}`
              : 'Resend code'}
        </Button>
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isFullWidth
        isLoading={isResetting}
        disabled={isResending}
        rightIcon={<ArrowRight size={17} />}
      >
        Reset password
      </Button>
    </form>
  );
}
