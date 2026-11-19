import { useEffect, useMemo, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button, Panel, PanelHeader } from '@/components/common';
import { cn } from '@/lib/utils';
import { stripUrlProtocol } from '@/utils/format';

const COLORS = [
  { name: 'Ink', value: '#18181b' },
  { name: 'Brand', value: '#ea580c' },
  { name: 'Ocean', value: '#1d4ed8' },
  { name: 'Forest', value: '#15803d' },
] as const;

const SIZES = [512, 1024, 2048] as const;

type QrModule = typeof import('qrcode');

function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export function QrCodePanel({ value, code }: { value: string; code: string }) {
  const [qr, setQr] = useState<QrModule | null>(null);
  const [color, setColor] = useState<string>(COLORS[0].value);
  const [size, setSize] = useState<(typeof SIZES)[number]>(1024);
  const [previewSvg, setPreviewSvg] = useState('');

  useEffect(() => {
    let active = true;
    import('qrcode').then(mod => {
      if (active) {
        setQr(mod);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const options = useMemo(
    () => ({
      margin: 2,
      errorCorrectionLevel: 'M' as const,
      color: { dark: color, light: '#ffffff' },
    }),
    [color]
  );

  useEffect(() => {
    if (!qr) {
      return;
    }
    qr.toString(value, { ...options, type: 'svg' })
      .then(setPreviewSvg)
      .catch(() => setPreviewSvg(''));
  }, [qr, value, options]);

  const downloadSvg = async () => {
    if (!qr) {
      return;
    }
    try {
      const svg = await qr.toString(value, { ...options, type: 'svg', width: size });
      downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `snip-${code}.svg`);
      toast.success('QR code downloaded', { description: `snip-${code}.svg · ${size}×${size}px` });
    } catch {
      toast.error("Couldn't generate SVG");
    }
  };

  const downloadPng = async () => {
    if (!qr) {
      return;
    }
    try {
      const dataUrl = await qr.toDataURL(value, { ...options, width: size });
      const blob = await (await fetch(dataUrl)).blob();
      downloadBlob(blob, `snip-${code}.png`);
      toast.success('QR code downloaded', { description: `snip-${code}.png · ${size}×${size}px` });
    } catch {
      toast.error("Couldn't generate PNG");
    }
  };

  return (
    <Panel>
      <PanelHeader
        title="QR code"
        description="Scanning opens the short link and records a click."
      />

      <div className="space-y-5 p-4 sm:p-5">
        <div className="mx-auto flex aspect-square w-full max-w-60 items-center justify-center rounded-lg border border-border bg-white p-3 shadow-xs">
          {previewSvg ? (
            <div
              role="img"
              aria-label={`QR code for ${stripUrlProtocol(value)}`}
              className="size-full [&>svg]:size-full"
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          ) : (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          )}
        </div>

        <p className="truncate text-center font-mono text-xs text-muted-foreground">
          {stripUrlProtocol(value)}
        </p>

        {/* Color */}
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-foreground">Color</p>
          <div className="flex gap-2" role="radiogroup" aria-label="QR color">
            {COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={color === c.value}
                aria-label={c.name}
                title={c.name}
                onClick={() => setColor(c.value)}
                className={cn(
                  'size-8 cursor-pointer rounded-full border-2 border-card ring-1 ring-border transition-all',
                  'hover:ring-foreground/40 active:scale-95',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  color === c.value && 'ring-2 ring-foreground'
                )}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[13px] font-medium text-foreground">Download size</p>
          <div
            className="grid grid-cols-3 gap-1 rounded-md border border-border bg-muted p-1"
            role="radiogroup"
            aria-label="Download size"
          >
            {SIZES.map(s => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(s)}
                className={cn(
                  'h-8 cursor-pointer rounded text-xs font-medium tabular-nums text-muted-foreground transition-colors',
                  'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  size === s && 'bg-card text-foreground shadow-xs'
                )}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* Downloads */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="primary"
            onClick={downloadPng}
            disabled={!qr}
            leftIcon={<Download size={16} />}
          >
            PNG
          </Button>
          <Button
            variant="outline"
            onClick={downloadSvg}
            disabled={!qr}
            leftIcon={<Download size={16} />}
          >
            SVG
          </Button>
        </div>
      </div>
    </Panel>
  );
}
