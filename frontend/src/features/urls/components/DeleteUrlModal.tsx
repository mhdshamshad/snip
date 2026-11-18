import { ConfirmDialog } from '@/components/common';
import { useDeleteUrl, type ShortUrl } from '@/features/urls';
import { stripUrlProtocol } from '@/utils/format';

interface DeleteUrlModalProps {
  url: ShortUrl | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export function DeleteUrlModal({ url, onClose, onDeleted }: DeleteUrlModalProps) {
  const { mutate: deleteUrl, isPending } = useDeleteUrl();

  const handleConfirm = () => {
    if (!url) {
      return;
    }
    deleteUrl(url.id, {
      onSuccess: () => {
        onClose();
        onDeleted?.();
      },
    });
  };

  return (
    <ConfirmDialog
      isOpen={Boolean(url)}
      onClose={onClose}
      isLoading={isPending}
      onConfirm={handleConfirm}
      title="Delete this link?"
      description={
        <span>
          <span className="mt-1 block break-all rounded-md bg-muted px-2.5 py-2 font-mono text-xs font-medium text-foreground">
            {stripUrlProtocol(url?.shortUrl ?? '')}
          </span>

          <span className="mt-2 block leading-relaxed">
            This link will stop redirecting immediately. Its{' '}
            <span className="font-medium text-foreground">
              {url?.clicks ?? 0} recorded {(url?.clicks ?? 0) === 1 ? 'click' : 'clicks'}
            </span>{' '}
            will also be permanently removed.
          </span>

          <span className="mt-1 block text-muted-foreground">This action cannot be undone.</span>
        </span>
      }
      confirmLabel="Delete link"
      cancelLabel="Cancel"
      destructive
    />
  );
}
