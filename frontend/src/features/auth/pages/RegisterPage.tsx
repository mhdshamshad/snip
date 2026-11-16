import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/app-routes';
import { AuthLayout, RegisterForm } from '@/features/auth';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Register to start shortening links."
      footer={
        <>
          Already have an account?{' '}
          <Link to={APP_ROUTES.LOGIN} className="link-hover font-medium text-foreground">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
