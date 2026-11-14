import type React from 'react';
import { AppModal } from './AppModal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={title}
      description={description}
      showCloseButton={!isLoading}
      closeOnBackdropClick={!isLoading}
    >
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
          className="h-10 sm:h-9"
        >
          {cancelLabel}
        </Button>

        <Button
          type="button"
          variant={destructive ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
          className="h-10 sm:h-9"
        >
          {confirmLabel}
        </Button>
      </div>
    </AppModal>
  );
}
