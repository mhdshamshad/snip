import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { APP_ROUTES } from '@/constants/app-routes';

export default function ServerErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-4 text-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-destructive/25 bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-destructive">
          500 &bull; Server error
        </p>

        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred while processing your request. You can try refreshing the
          page or head back home.
        </p>

        <div className="mt-6 flex flex-col-reverse justify-center gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate(APP_ROUTES.HOME)}
            leftIcon={<Home className="size-4" />}
          >
            Go home
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw className="size-4" />}
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
