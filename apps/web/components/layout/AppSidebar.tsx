'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Map,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Sócios',
    href: '/members',
    icon: Users,
  },
  {
    label: 'Treinadores',
    href: '/coaches',
    icon: Dumbbell,
  },
  {
    label: 'Campos',
    href: '/courts',
    icon: Map,
  },
  {
    label: 'Reservas',
    href: '/reservations',
    icon: CalendarDays,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b px-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground shadow-sm">
          APCM
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">
            Atlantica Padel
          </p>

          <p className="truncate text-xs text-muted-foreground">
            Club Manager
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'size-5 shrink-0',
                  !isActive &&
                    'transition-colors group-hover:text-foreground',
                )}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="mb-4 rounded-lg bg-muted/50 px-3 py-3">
          <p className="truncate text-sm font-medium">{fullName}</p>

          <p className="truncate text-xs text-muted-foreground">
            {user.email}
          </p>

          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {user.role}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="size-4" />
          Terminar sessão
        </Button>
      </div>
    </aside>
  );
}