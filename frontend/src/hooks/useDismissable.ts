import { useCallback, useEffect, useRef, useState } from 'react';

export function useDismissable<T extends HTMLElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<T>(null);

  const toggle = useCallback(() => {
    setIsOpen(previous => !previous);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        close();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        ref.current?.querySelector('button')?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return { ref, isOpen, toggle, close };
}
