import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/app-routes';
import { AuthLayout, VerifyOtpForm } from '@/features/auth';

export default function VerifyOtpPage() {
  return (
    <AuthLayout
      title="Verify your email"
      description="Enter the verification code sent to your email address."
      footer={
        <span>
          Need to start over?{' '}
          <Link to={APP_ROUTES.REGISTER} className="link-hover font-medium text-foreground">
            Register again
          </Link>
        </span>
      }
    >
      <VerifyOtpForm />
    </AuthLayout>
  );
}
