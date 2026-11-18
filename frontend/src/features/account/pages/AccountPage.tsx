import { useAuthStore, type AuthUser } from '@/features/auth';
import { useUpdateName } from '../hooks/useUpdateName';
import { nameSchema, type NameFormType } from '../validation/account.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Panel, PanelHeader } from '@/features/urls';
import { Button, FormField, Input } from '@/components/common';
import type { ReactNode } from 'react';

export default function AccountPage() {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-6">
          <NameForm user={user} />
        </div>
      </div>
    </div>
  );
}

function PanelFooter({ note, children }: { note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
      <p className="min-w-0 flex-1 text-xs text-muted-foreground">{note}</p>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

function NameForm({ user }: { user: AuthUser }) {
  const { mutateAsync: updateName, isPending } = useUpdateName();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<NameFormType>({
    resolver: zodResolver(nameSchema),
    mode: 'onChange',
    values: { name: user.name },
  });

  const onSubmit = handleSubmit(({ name }) =>
    updateName(name, {
      onSuccess: res => reset({ name: res.data.user.name }),
    })
  );

  return (
    <Panel>
      <PanelHeader title="Display name" />
      <form onSubmit={onSubmit} noValidate>
        <div className="p-4 sm:p-5">
          <FormField label="Full name">
            <Input
              id="profile-name"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
          </FormField>
        </div>
        {isDirty && (
          <PanelFooter>
            <Button type="button" variant="ghost" size="sm" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isPending}>
              Save name
            </Button>
          </PanelFooter>
        )}
      </form>
    </Panel>
  );
}
