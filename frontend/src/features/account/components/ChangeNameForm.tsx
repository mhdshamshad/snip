import type { AuthUser } from '@/features/auth';
import { useUpdateName } from '../hooks/useUpdateName';
import { nameSchema, type NameFormType } from '../validation/account.schema';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormField, Input, Panel, PanelHeader } from '@/components/common';
import { cn } from '@/lib/utils';

export function ChangeNameForm({ user }: { user: AuthUser }) {
  const { mutateAsync: updateName, isPending } = useUpdateName();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NameFormType>({
    resolver: zodResolver(nameSchema),
    mode: 'onChange',
    values: { name: user.name },
  });

  const currentName = useWatch({ control, name: 'name' }) ?? '';
  const hasRealChange = currentName.trim() !== user.name.trim();

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
        <div
          className={cn(
            'flex flex-wrap items-center justify-end gap-2 px-4 pb-4 sm:px-5 sm:pb-5',
            !hasRealChange && 'invisible'
          )}
        >
          <Button type="button" variant="ghost" size="sm" onClick={() => reset()}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isPending}>
            Save name
          </Button>
        </div>
      </form>
    </Panel>
  );
}
