import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, Input, PasswordInput, FormField } from '@/components/common';
import { useLogin, loginSchema, type LoginFormType } from '@/features/auth';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/app-routes';

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(values => {
    login(values);
  });

  return (
    <div className="space-y-5">
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
        <FormField
          label="Password"
          required
          labelAction={
            <Link
              to={APP_ROUTES.FORGOT_PASSWORD}
              className="link-hover text-xs text-muted-foreground underline-offset-4 hover:text-foreground"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            leftIcon={<Lock size={16} />}
            error={errors.password?.message}
            {...register('password')}
          />
        </FormField>
        <div className="flex items-center gap-2">
          <input id="remember" type="checkbox" />
          <label htmlFor="remember" className="text-[13px] font-normal text-muted-foreground">
            Keep me signed in on this device
          </label>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isFullWidth
          isLoading={isPending}
          rightIcon={<ArrowRight size={17} />}
          className="h-11 sm:h-12 rounded-xl text-sm sm:text-base font-semibold shadow-md transition-all cursor-pointer"
        >
          Log In
        </Button>
      </form>
    </div>
  );
}
