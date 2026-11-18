import { useAuthStore } from '@/features/auth';

import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { ChangeNameForm } from '../components/ChangeNameForm';

export default function AccountPage() {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-6">
          <ChangeNameForm user={user} />
          {/* <EmailForm user={user} /> */}
        </div>
        <div className="grid grid-cols-1 gap-6">
          <ChangePasswordForm />
          {/* <SessionPanel user={user} /> */}
        </div>
      </div>
    </div>
  );
}
