import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthInitializer } from '@/features/auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { queryClient } from '@/lib/queryClient';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <App />
          <Toaster richColors position="top-right" />
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
