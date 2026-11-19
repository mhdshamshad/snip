import { useEffect, useCallback, useId } from 'react';
import type React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export function AppModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className,
}: AppModalProps) {
  const id = useId();
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (closeOnBackdropClick) {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative z-10 flex w-full flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3.5rem)] rounded-xl border border-border bg-card p-5 sm:p-6 text-foreground shadow-lg transition-all duration-200',
          maxWidthMap[maxWidth],
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border pb-3">
            <div>
              {title && (
                <h3 id={`${id}-title`} className="text-base font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p
                  id={`${id}-description`}
                  className="mt-1 text-xs text-muted-foreground leading-relaxed"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}

        <div className="mt-4 flex-1 overflow-y-auto overscroll-contain pr-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}
