import { APP_ROUTES } from '@/constants/app-routes';
import { Link } from 'react-router-dom';
import { AuthLayout, LoginForm, GoogleSignInButton } from '@/features/auth';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Log in to Snip"
      description="Welcome back. Pick up where you left off."
      footer={
        <>
          Don't have an account?{' '}
          <Link to={APP_ROUTES.REGISTER} className="link-hover font-medium text-foreground">
            Create one
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <GoogleSignInButton />
        <div className="flex items-center gap-3" role="separator" aria-label="or">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
