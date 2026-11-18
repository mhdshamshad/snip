import { Suspense, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { AppLoader } from '@/components/common/AppLoader';
import { useAuthStore } from '@/features/auth';
import { APP_ROUTES } from '@/constants/app-routes';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CreateUrlModal } from '@/features/urls/components/CreateUrlModal';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-brand/20 selection:text-brand">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col transition-all lg:pl-60">
        <Header onMenuClick={() => setMobileOpen(prev => !prev)} />

        <main className="w-full flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Suspense fallback={<AppLoader label="Loading content" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <CreateUrlModal />
    </div>
  );
}
