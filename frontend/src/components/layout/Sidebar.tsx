import { LayoutGrid, Link2, Plus, Settings, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Logo } from '@/components/common/Logo';
import { APP_ROUTES } from '@/constants/app-routes';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';
import { Button } from '../common';
import { useCreateUrlModalStore } from '@/features/urls';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  end?: boolean;
}

const DASHBOARD_NAV_ITEMS: readonly NavItem[] = [
  { to: APP_ROUTES.DASHBOARD, label: 'Overview', icon: LayoutGrid, end: true },
  { to: APP_ROUTES.URLS, label: 'My URLs', icon: Link2 },
  { to: APP_ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ open = false, onClose, className }: SidebarProps) {
  const openCreateUrlModal = useCreateUrlModalStore(s => s.open);
  return (
    <aside
      className={cn(
        'fixed inset-y-0 right-0 z-40 flex w-60 flex-col border-l border-border bg-subtle shadow-xs transition-transform duration-200 ease-in-out select-none',
        'lg:left-0 lg:right-auto lg:border-r lg:border-l-0 lg:translate-x-0',
        open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
        className
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4">
        <Logo to={APP_ROUTES.DASHBOARD} />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Create Link */}
      <div className="px-3 pt-1">
        <Button
          isFullWidth
          size="md"
          leftIcon={<Plus className="size-4" />}
          className="h-9 justify-start gap-2 px-3 text-[13px]"
          onClick={openCreateUrlModal}
        >
          New link
        </Button>
      </div>

      {/* Navigation */}
      <div className="mt-5 flex-1 overflow-y-auto px-3">
        <p className="mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
          Workspace
        </p>

        <nav aria-label="Dashboard navigation" className="space-y-0.5">
          {DASHBOARD_NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium text-muted-foreground transition-[color,background-color,box-shadow] duration-120 hover:bg-accent hover:text-foreground active:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
                  isActive && 'bg-card text-foreground shadow-sm ring-1 ring-border hover:bg-card'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'size-4 transition-colors duration-120',
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                    strokeWidth={1.85}
                  />

                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-2 p-3">
        <UserMenu variant="sidebar" />
      </div>
    </aside>
  );
}
