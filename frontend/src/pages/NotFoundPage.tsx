import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { APP_ROUTES } from '@/constants/app-routes';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-4 text-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <span
          aria-hidden="true"
          className="select-none font-mono text-7xl font-bold tracking-tight text-muted-foreground/30 sm:text-8xl"
        >
          404
        </span>

        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          The link you followed may be broken, or the page may have been removed or renamed.
        </p>

        <div className="mt-6 flex flex-col-reverse justify-center gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="size-4" />}
          >
            Go back
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => navigate(APP_ROUTES.HOME)}
            leftIcon={<Home className="size-4" />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
