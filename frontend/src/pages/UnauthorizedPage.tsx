import { ArrowLeft, Home, LogIn, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/components/common/Button';
import { APP_ROUTES } from '@/constants/app-routes';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-4 text-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-600">
          <ShieldAlert className="size-6" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-amber-600">
          403 &bull; Access restricted
        </p>

        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Access denied
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          You do not have permission to view or manage this resource. If you believe this is a
          mistake, please sign in with an authorized account.
        </p>

        {isAuthenticated && user && (
          <div className="mt-5 rounded-lg border border-border bg-subtle p-3 text-left">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Current account
            </p>
            <p className="mt-0.5 text-xs font-medium text-foreground truncate">
              {user.name || user.email}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
          </div>
        )}

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

          {isAuthenticated ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => navigate(APP_ROUTES.HOME)}
              leftIcon={<Home className="size-4" />}
            >
              Back to Home
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => navigate(APP_ROUTES.LOGIN)}
              leftIcon={<LogIn className="size-4" />}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
