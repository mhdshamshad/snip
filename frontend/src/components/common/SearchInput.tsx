import { useEffect, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  onClear?: () => void;
  debounce?: number;
  minLength?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  loading = false,
  className,
  disabled = false,
  onClear,
  debounce = 450,
  minLength = 2,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, debounce);

  useEffect(() => {
    const trimmedValue = debouncedValue.trim();

    if (
      (trimmedValue.length === 0 || trimmedValue.length >= minLength) &&
      trimmedValue !== value.trim()
    ) {
      onChange(trimmedValue);
    }
  }, [debouncedValue, value, onChange, minLength]);

  const handleClear = () => {
    setInputValue('');
    onChange('');
    onClear?.();
  };

  return (
    <div className={cn('relative w-full', className)}>
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Search"
        aria-busy={loading}
        className={cn(
          'h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 text-sm outline-none transition-colors',
          'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />

      {inputValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}

      {loading && (
        <Loader2
          size={16}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 animate-spin text-muted-foreground',
            inputValue && !disabled ? 'right-9' : 'right-3'
          )}
        />
      )}
    </div>
  );
}
