import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, FormField, Input } from '@/components/common';
import type { AuthUser } from '@/features/auth';
import { Panel, PanelHeader } from '@/features/urls';
import { emailSchema, type EmailFormType } from '../validation/account.schema';
import { useRequestEmailOtp } from '../hooks/useRequestEmailOtp';
import { useUpdateEmail } from '../hooks/useUpdateEmail';
import { useTimer } from '@/hooks';
import { RotateCcw } from 'lucide-react';

export function ChangeEmailForm({ user }: { user: AuthUser }) {
  const [step, setStep] = useState<'edit' | 'verify'>('edit');
  const [code, setCode] = useState('');
  const { remainingSeconds, start } = useTimer(30);
  const requestOtp = useRequestEmailOtp();
  const updateEmail = useUpdateEmail();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<EmailFormType>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    values: { email: user.email },
  });

  const email = useWatch({ control, name: 'email' }) ?? user.email;
  const isVerifying = step === 'verify';
  const isPending = requestOtp.isPending || updateEmail.isPending;

  const sendCode = (targetEmail: string) =>
    requestOtp.mutate(targetEmail, {
      onSuccess: () => {
        setStep('verify');
        setCode('');
        start();
      },
    });

  const onSubmit = handleSubmit(({ email: targetEmail }) => {
    if (!isVerifying) {
      sendCode(targetEmail);
      return;
    }

    updateEmail.mutate(
      { email: targetEmail, otp: code },
      {
        onSuccess: () => {
          setStep('edit');
          setCode('');
          reset({ email: targetEmail });
        },
      }
    );
  });

  const cancel = () => {
    reset();
    setStep('edit');
    setCode('');
  };
  const cooldownLabel = `${Math.floor(remainingSeconds / 60)}:${String(
    remainingSeconds % 60
  ).padStart(2, '0')}`;

  return (
    <Panel>
      <PanelHeader title="Email address" />
      <form onSubmit={onSubmit} noValidate>
        <div className="space-y-4 p-4 sm:p-5">
          <FormField label="Email">
            <Input
              id="profile-email"
              type="email"
              autoComplete="email"
              readOnly={isVerifying}
              error={errors.email?.message}
              {...register('email')}
            />
          </FormField>
          <p className="text-xs text-muted-foreground">
            You can change your email up to 2 times within a 7-day period.
          </p>
          {isVerifying && (
            <FormField label="Verification code">
              <Input
                id="email-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6-digit code"
                autoFocus
                value={code}
                onChange={event => setCode(event.target.value.replace(/\D/g, ''))}
              />
            </FormField>
          )}
        </div>
        {(isDirty || isVerifying) && (
          <div className="flex flex-wrap items-end justify-between gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
            <p className="min-w-0 flex-1 text-xs text-muted-foreground">
              {isVerifying && (
                <>
                  Code sent to <span className="font-medium text-foreground">{email}</span>.{' '}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    isLoading={requestOtp.isPending}
                    disabled={isPending || remainingSeconds > 0}
                    leftIcon={<RotateCcw size={14} />}
                    onClick={() => {
                      if (remainingSeconds > 0) {return;}
                      sendCode(email);
                    }}
                  >
                    {requestOtp.isPending
                      ? 'Sending code…'
                      : remainingSeconds > 0
                        ? `Resend in ${cooldownLabel}`
                        : 'Resend code'}
                  </Button>
                </>
              )}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Button type="button" variant="ghost" size="sm" disabled={isPending} onClick={cancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={updateEmail.isPending}
                disabled={isVerifying && code.length !== 6}
              >
                {isVerifying ? 'Verify & update' : 'Send code'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Panel>
  );
}
