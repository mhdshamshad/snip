import { useEffect, useState } from 'react';
import type React from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button, type ButtonProps } from './Button';
import { cn } from '@/lib/utils';

async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fallback to execCommand if clipboard API is unavailable or fails
    }
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(area);
  if (!ok) {
    throw new Error('Copy failed');
  }
}

interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  value: string;
  label?: string;
  showLabel?: boolean;
}

export function CopyButton({
  value,
  label = 'Copy',
  showLabel = false,
  className,
  variant = 'outline',
  size,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await writeClipboard(value);
      setCopied(true);
      toast.success('Copied to clipboard', { description: value });
    } catch {
      toast.error("Couldn't copy", {
        description: 'Please select the link and copy manually.',
      });
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (showLabel ? 'sm' : 'icon')}
      onClick={onCopy}
      aria-label={copied ? 'Copied' : `${label} ${value}`}
      className={cn(
        !showLabel && 'size-8 p-0',
        copied && 'text-success border-success/30',
        className
      )}
      {...props}
    >
      {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      {showLabel && <span>{copied ? 'Copied' : label}</span>}
    </Button>
  );
}
