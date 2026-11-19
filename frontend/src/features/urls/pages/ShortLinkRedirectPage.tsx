import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { AppLoader } from '@/components/common/AppLoader';
import { APP_ROUTES } from '@/constants/app-routes';
import { urlsApi } from '@/features/urls/api/urls.api';

export default function ShortLinkRedirectPage() {
  const { code } = useParams<{ code: string }>();
  const {
    data: originalUrl,
    isError,
    error,
  } = useQuery({
    queryKey: ['short-link-redirect', code],
    queryFn: () => {
      if (!code) {
        throw new Error('Short link code is missing.');
      }
      return urlsApi.resolve(code);
    },
    enabled: Boolean(code),
    retry: false,
  });

  useEffect(() => {
    if (originalUrl) {
      window.location.replace(originalUrl);
    }
  }, [originalUrl]);

  if (!code) {
    return <Navigate to={APP_ROUTES.NOT_FOUND} replace />;
  }

  if (isError) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    return (
      <Navigate to={status === 404 ? APP_ROUTES.NOT_FOUND : APP_ROUTES.SERVER_ERROR} replace />
    );
  }

  return <AppLoader label="Opening your link" />;
}
