import { AppModal, Button, FormField, Input } from '@/components/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import {
  ALIAS_REGEX,
  createUrlSchema,
  useCreateUrlModalStore,
  type CreateUrlFormType,
} from '@/features/urls';
import { useCreateUrl } from '../hooks/useCreateUrl';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks';
import { useAliasAvailability } from '../hooks/useAliasAvailability';
import { ArrowRight, Check, Globe, Link2, Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import { handleApiError } from '@/utils/handleApiError';

export function CreateUrlModal() {
  const { close, isOpen } = useCreateUrlModalStore();
  const { mutate: createUrl, isPending } = useCreateUrl();

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateUrlFormType>({
    resolver: zodResolver(createUrlSchema),
    mode: 'onChange',
    defaultValues: { originalUrl: '', customAlias: '' },
  });

  const alias = (useWatch({ control, name: 'customAlias' }) ?? '').trim();
  const debouncedAlias = useDebounce(alias, 450);
  const isValidAlias = ALIAS_REGEX.test(alias);
  const isSettled = alias === debouncedAlias;

  const {
    data: isAvailable,
    isFetching,
    isError,
  } = useAliasAvailability(debouncedAlias, isValidAlias && isSettled);
  const status = !isValidAlias
    ? 'idle'
    : !isSettled || isFetching
      ? 'checking'
      : isError
        ? 'error'
        : isAvailable
          ? 'available'
          : 'taken';

  const handleClose = () => {
    reset();
    close();
  };

  const onSubmit = handleSubmit(({ originalUrl, customAlias }) => {
    createUrl(
      { originalUrl, customAlias: customAlias?.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Short link created');
          handleClose();
        },
        onError: error => {
          const message = handleApiError(error, 'Failed to create short link');
          if (isAxiosError(error) && error.response?.status === 409) {
            setError('customAlias', { message });
          } else {
            toast.error(message);
          }
        },
      }
    );
  });

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create link"
      description="Create a short link for a destination URL."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Destination URL" required>
          <Input
            id="originalUrl"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://example.com/your-long-url"
            leftIcon={<Globe size={16} />}
            error={errors.originalUrl?.message}
            {...register('originalUrl')}
          />
        </FormField>

        <FormField
          label="Custom alias"
          helperText="Optional. Leave empty to generate a random alias."
        >
          <Input
            id="customAlias"
            placeholder="my-custom-link"
            autoComplete="off"
            leftIcon={<Link2 size={16} />}
            error={errors.customAlias?.message}
            {...register('customAlias')}
          />
          {status !== 'idle' && !errors.customAlias && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs">
              {status === 'checking' && (
                <>
                  <Loader2 className="size-3 animate-spin" /> Checking availability...
                </>
              )}
              {status === 'available' && (
                <span className="flex items-center gap-1.5 text-success">
                  <Check className="size-3.5" /> Alias is available
                </span>
              )}
              {status === 'taken' && (
                <span className="text-destructive">This alias is already taken.</span>
              )}
              {status === 'error' && (
                <span className="text-muted-foreground">Couldn't check availability.</span>
              )}
            </p>
          )}
        </FormField>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isFullWidth
          isLoading={isPending}
          disabled={isPending || status === 'taken'}
          rightIcon={<ArrowRight size={17} />}
        >
          Create short link
        </Button>
      </form>
    </AppModal>
  );
}
