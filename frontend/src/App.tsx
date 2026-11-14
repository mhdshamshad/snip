import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';
import { AppLoader } from '@/components/common/AppLoader';
import { APP_ROUTES } from '@/constants/app-routes';

const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));

export default function App() {
  return (
    <Suspense fallback={<AppLoader label="Loading page" />}>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<HomePage />} />

        {/* 2. Authenticated */}
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<> Hello </>} />
        </Route>

        <Route path={APP_ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
        <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
