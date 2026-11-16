import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Lock, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, FormField, Input, PasswordInput } from '@/components/common';
import { registerSchema, useRegister, type RegisterFormType } from '@/features/auth';

export function RegisterForm() {
  const { mutate: registerAccount, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(({ confirmPassword: _confirmPassword, ...data }) => {
    registerAccount(data);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Name" required>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          leftIcon={<UserRound size={16} />}
          error={errors.name?.message}
          {...register('name')}
        />
      </FormField>
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
      <FormField
        label="Password"
        required
        helperText="8–25 characters with uppercase, lowercase, number, and symbol."
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a password"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />
      </FormField>
      <FormField label="Confirm Password" required>
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          placeholder="Enter your password again"
          leftIcon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </FormField>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isFullWidth
        isLoading={isPending}
        rightIcon={<ArrowRight size={17} />}
        className="h-11 cursor-pointer rounded-xl text-sm font-semibold shadow-md transition-all sm:h-12 sm:text-base"
      >
        Create account
      </Button>
    </form>
  );
}
