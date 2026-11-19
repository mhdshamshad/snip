import type React from 'react';
import { AlertTriangle } from 'lucide-react';

import { AppModal } from './AppModal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
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
      title={
        <span className="flex items-center gap-2.5">
          {destructive && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-4" />
            </span>
          )}
          <span>{title}</span>
        </span>
      }
      description={description}
      showCloseButton={!isLoading}
      closeOnBackdropClick={!isLoading}
      className="rounded-xl"
    >
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
          className="h-9 px-4"
        >
          {cancelLabel}
        </Button>

        <Button
          type="button"
          variant={destructive ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
          className="h-9 px-4"
        >
          {confirmLabel}
        </Button>
      </div>
    </AppModal>
  );
}
