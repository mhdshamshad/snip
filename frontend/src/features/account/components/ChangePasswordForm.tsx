import { useForm } from 'react-hook-form';
import {
  changePasswordSchema,
  type ChangePasswordFormType,
} from '../validation/password-change.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Panel, PanelHeader } from '@/features/urls';
import { Button, FormField, PasswordInput } from '@/components/common';
import { useChangePassword } from '../hooks/useChangePassword';
import { cn } from '@/lib/utils';

export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  return (
    <Panel>
      <PanelHeader title="Change password" />
      <form
        onSubmit={handleSubmit(({ currentPassword, newPassword }) =>
          changePassword({ currentPassword, newPassword }, { onSuccess: () => reset() })
        )}
        noValidate
      >
        <div className="space-y-4 p-4 sm:p-5">
          <FormField label="Current password">
            <PasswordInput
              id="pw-current"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
          </FormField>
          <FormField label="New password">
            <PasswordInput
              id="pw-new"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
          </FormField>
          <FormField label="Confirm new password">
            <PasswordInput
              id="pw-confirm"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </FormField>
        </div>
        <div
          className={cn(
            'flex flex-wrap items-center justify-end gap-2 px-4 pb-4 sm:px-5 sm:pb-5',
            !isDirty && 'invisible'
          )}
        >
          <Button type="submit" size="sm" isLoading={isPending}>
            Update password
          </Button>
        </div>
      </form>
    </Panel>
  );
}
