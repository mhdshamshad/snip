import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Logo } from '@/components/common/Logo';
import { APP_ROUTES } from '@/constants/app-routes';

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (window.location.pathname === '/') {
      const targetId = href.replace('/#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => handleNavClick(l.href)}
              className="rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => navigate(APP_ROUTES.LOGIN)}
          >
            Log in
          </Button>
          <Button size="sm" className="h-8" onClick={() => navigate(APP_ROUTES.REGISTER)}>
            Get started
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-9 md:hidden"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-b border-border bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => handleNavClick(l.href)}
                className="rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Button
                variant="outline"
                size="sm"
                isFullWidth
                onClick={() => {
                  setOpen(false);
                  navigate(APP_ROUTES.LOGIN);
                }}
              >
                Log in
              </Button>
              <Button
                size="sm"
                isFullWidth
                onClick={() => {
                  setOpen(false);
                  navigate(APP_ROUTES.REGISTER);
                }}
              >
                Get started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
