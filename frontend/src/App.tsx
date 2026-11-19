import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { AppLoader } from '@/components/common/AppLoader';
import { APP_ROUTES } from '@/constants/app-routes';

const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const VerifyOtpPage = lazy(() => import('@/features/auth/pages/VerifyOtpPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const UrlListPage = lazy(() => import('@/features/urls/pages/UrlListPage'));
const UrlDetailsPage = lazy(() => import('@/features/urls/pages/UrlDetailsPage'));
const AccountPage = lazy(() => import('@/features/account/pages/AccountPage'));

export default function App() {
  return (
    <Suspense fallback={<AppLoader label="Loading page" />}>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<HomePage />} />

        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={APP_ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
        <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

        {/* 2. Authenticated */}
        <Route element={<ProtectedLayout />}>
          <Route path={APP_ROUTES.URLS} element={<UrlListPage />} />
          <Route path={APP_ROUTES.URL_DETAILS} element={<UrlDetailsPage />} />
          <Route path={APP_ROUTES.SETTINGS} element={<AccountPage />} />
        </Route>

        <Route path={APP_ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path={APP_ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
        <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
