'use client';

import { CircleUserRound } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';

function formatRole(role: string): string {
  const roleNames: Record<string, string> = {
    ADMIN: 'Administrador',
    MANAGER: 'Gestor',
    STAFF: 'Colaborador',
    COACH: 'Treinador',
    MEMBER: 'Sócio',
  };

  return roleNames[role] ?? role;
}

export function AppHeader() {
  const { user } = useAuth();

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : '';

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            Atlantica Padel Club Manager
          </p>

          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            Plataforma de gestão do clube
          </p>
        </div>

        {user && (
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">
                {fullName}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {formatRole(user.role)}
              </p>
            </div>

            <div className="flex size-9 items-center justify-center rounded-full border bg-muted/50">
              <CircleUserRound className="size-5 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}