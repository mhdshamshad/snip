import { useState } from 'react';
import { LogOut, MonitorSmartphone } from 'lucide-react';

import { Button, ConfirmDialog, Panel, PanelHeader } from '@/components/common';
import { useLogout, useLogoutAll, useAuthStore, type AuthUser } from '@/features/auth';

import { ChangeEmailForm } from '../components/ChangeEmailForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { ChangeNameForm } from '../components/ChangeNameForm';

function SessionPanel({ user }: { user: AuthUser }) {
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Panel>
      <PanelHeader title="Session" />
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-subtle p-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
            <MonitorSmartphone className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">This browser</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <span className="shrink-0 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            Current
          </span>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 px-4 pb-4 sm:flex-row sm:justify-end sm:px-5 sm:pb-5">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<LogOut className="size-4" />}
          isLoading={logout.isPending}
          onClick={() => logout.mutate()}
          className="h-10 sm:h-8"
        >
          Log out
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirmOpen(true)}
          className="h-10 text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-8"
        >
          Log out of all devices
        </Button>
      </div>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          logoutAll.mutate();
        }}
        title="Log out of all devices?"
        description="You'll be signed out everywhere, including this browser. Your links stay saved."
        confirmLabel="Log out everywhere"
        cancelLabel="Cancel"
        destructive
        isLoading={logoutAll.isPending}
      />
    </Panel>
  );
}

export default function AccountPage() {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account.</p>
      </div>

      <div className="@container">
        <div className="grid grid-cols-1 items-start gap-6 @2xl:grid-cols-2">
          <div className="grid min-w-0 grid-cols-1 gap-6">
            <ChangeNameForm user={user} />
            <ChangeEmailForm user={user} />
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-6">
            <ChangePasswordForm />
            <SessionPanel user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
