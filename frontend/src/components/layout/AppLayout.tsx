import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AppLoader } from '@/components/common';
import { Sidebar } from '@/components/layout';
import { Logo } from '@/components/common/Logo';
import { APP_ROUTES } from '@/constants/app-routes';
import { UserMenu } from './UserMenu';

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground antialiased selection:bg-brand/20 selection:text-brand">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-60">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Logo to={APP_ROUTES.DASHBOARD} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserMenu variant="compact" />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Suspense fallback={<AppLoader label="Loading content" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
