import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, FormField, Input } from '@/components/common';
import {
  forgotPasswordSchema,
  useForgotPassword,
  type ForgotPasswordFormType,
} from '@/features/auth';

interface ForgotPasswordFormProps {
  defaultEmail?: string;
  onCodeSent: (email: string) => void;
}

export function ForgotPasswordForm({ defaultEmail = '', onCodeSent }: ForgotPasswordFormProps) {
  const { mutate: sendResetCode, isPending } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = handleSubmit(values => {
    sendResetCode(values.email, {
      onSuccess: () => onCodeSent(values.email),
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Email Address" required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
      </FormField>
      <p className="text-xs leading-relaxed text-muted-foreground">
        If an account exists for this email, we’ll send a 6-digit password reset code.
      </p>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isFullWidth
        isLoading={isPending}
        rightIcon={<ArrowRight size={17} />}
      >
        Send reset code
      </Button>
    </form>
  );
}
