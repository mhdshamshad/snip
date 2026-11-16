import { useState } from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/app-routes';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { ForgotPasswordForm, ResetPasswordForm } from '@/features/auth';

type ForgotPasswordStep = 'request-code' | 'reset-password';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>('request-code');
  const [email, setEmail] = useState('');
  const isRequestingCode = step === 'request-code';

  return (
    <AuthLayout
      title={isRequestingCode ? 'Forgot password?' : 'Reset your password'}
      description={
        isRequestingCode
          ? 'Enter your email address and we’ll send a password reset code.'
          : 'Enter the code from your email and choose a new password.'
      }
      footer={
        <Link to={APP_ROUTES.LOGIN} className="link-hover font-medium text-foreground">
          Back to login
        </Link>
      }
    >
      {isRequestingCode ? (
        <ForgotPasswordForm
          defaultEmail={email}
          onCodeSent={sentEmail => {
            setEmail(sentEmail);
            setStep('reset-password');
          }}
        />
      ) : (
        <ResetPasswordForm email={email} onChangeEmail={() => setStep('request-code')} />
      )}
    </AuthLayout>
  );
}
