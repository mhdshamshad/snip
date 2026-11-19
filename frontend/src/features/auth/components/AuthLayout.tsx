import { Logo } from '@/components/common';
import { APP_ROUTES } from '@/constants/app-routes';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

interface AuthLayoutProps {
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function AuthLayout({ title, description, footer, children }: AuthLayoutProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    const from = (location.state as { from?: Location } | null)?.from;
    const target =
      from?.pathname.startsWith(APP_ROUTES.URLS) || from?.pathname === APP_ROUTES.SETTINGS
        ? from.pathname + from.search + from.hash
        : APP_ROUTES.URLS;
    return <Navigate to={target} replace />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Logo />
        <Link
          to={APP_ROUTES.HOME}
          className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to home
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-12 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-100">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            <div className="mt-6">{children}</div>
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </main>
    </div>
  );
}
