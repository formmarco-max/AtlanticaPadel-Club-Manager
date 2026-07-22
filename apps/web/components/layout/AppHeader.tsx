'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Search,
  Settings,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

interface HeaderNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'reservation' | 'payment' | 'system';
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  members: 'Sócios',
  courts: 'Campos',
  reservations: 'Reservas',
  coaches: 'Treinadores',
  lessons: 'Aulas',
  memberships: 'Mensalidades',
  events: 'Eventos',
  reports: 'Relatórios',
  settings: 'Definições',
  new: 'Novo',
  edit: 'Editar',
};

const initialNotifications: HeaderNotification[] = [
  {
    id: 1,
    title: 'Nova reserva confirmada',
    description:
      'Foi registada uma nova reserva para o campo Atlântico 1.',
    time: 'Há 5 min.',
    isRead: false,
    type: 'reservation',
  },
  {
    id: 2,
    title: 'Pagamento pendente',
    description:
      'Existe uma mensalidade cujo pagamento ainda não foi confirmado.',
    time: 'Há 25 min.',
    isRead: false,
    type: 'payment',
  },
  {
    id: 3,
    title: 'Resumo diário disponível',
    description:
      'O resumo operacional do clube já está disponível.',
    time: 'Há 1 hora',
    isRead: true,
    type: 'system',
  },
];

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

function getGreeting(hour: number): string {
  if (hour >= 6 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 20) return 'Boa tarde';
  return 'Boa noite';
}

function capitalize(value: string): string {
  return value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : value;
}

function getInitials(
  firstName?: string,
  lastName?: string,
): string {
  const firstInitial = firstName?.trim().charAt(0) ?? '';
  const lastInitial = lastName?.trim().charAt(0) ?? '';

  return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
}

function formatRouteSegment(segment: string): string {
  if (routeLabels[segment]) return routeLabels[segment];

  const decodedSegment = decodeURIComponent(segment);

  if (
    decodedSegment.length > 20 ||
    decodedSegment.includes('-')
  ) {
    return 'Detalhes';
  }

  return capitalize(decodedSegment.replaceAll('-', ' '));
}

function getNotificationIcon(
  type: HeaderNotification['type'],
) {
  if (type === 'reservation') return CalendarDays;
  if (type === 'payment') return Clock3;
  return Bell;
}

export function AppHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const [currentDate, setCurrentDate] = useState<Date | null>(
    null,
  );
  const [notifications, setNotifications] = useState<
    HeaderNotification[]
  >(initialNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentDate(new Date());

    const interval = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      const target = event.target as Node;

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);

    return segments.map((segment, index) => ({
      label: formatRouteSegment(segment),
      href: `/${segments.slice(0, index + 1).join('/')}`,
      isLast: index === segments.length - 1,
    }));
  }, [pathname]);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : '';

  const greeting = currentDate
    ? getGreeting(currentDate.getHours())
    : 'Olá';

  const formattedDate = currentDate
    ? capitalize(
        new Intl.DateTimeFormat('pt-PT', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(currentDate),
      )
    : '';

  function markAllNotificationsAsRead(): void {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  }

  function markNotificationAsRead(id: number): void {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              {greeting}
              {user?.firstName ? `, ${user.firstName}` : ''}
              <span aria-hidden="true" className="ml-1">
                👋
              </span>
            </h1>

            <p className="mt-1 hidden truncate text-sm text-muted-foreground sm:block">
              {formattedDate}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="relative hidden xl:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
                placeholder="Pesquisar..."
                aria-label="Pesquisar na aplicação"
                className="h-10 w-64 rounded-xl border bg-muted/30 pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15"
              />

              {searchValue && (
                <button
                  type="button"
                  aria-label="Limpar pesquisa"
                  onClick={() => setSearchValue('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div ref={notificationsRef} className="relative">
              <button
                type="button"
                aria-label="Abrir notificações"
                aria-expanded={isNotificationsOpen}
                onClick={() => {
                  setIsNotificationsOpen((current) => !current);
                  setIsProfileOpen(false);
                }}
                className="relative flex size-10 items-center justify-center rounded-xl border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="size-5" />

                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 text-[10px] font-bold leading-4 text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border bg-background shadow-xl">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                      <p className="font-semibold">Notificações</p>
                      <p className="text-xs text-muted-foreground">
                        {unreadNotifications}{' '}
                        {unreadNotifications === 1
                          ? 'notificação não lida'
                          : 'notificações não lidas'}
                      </p>
                    </div>

                    {unreadNotifications > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Marcar como lidas
                      </button>
                    )}
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {notifications.map((notification) => {
                      const NotificationIcon =
                        getNotificationIcon(notification.type);

                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            markNotificationAsRead(notification.id)
                          }
                          className={`flex w-full gap-3 border-b p-4 text-left transition-colors last:border-b-0 hover:bg-muted/50 ${
                            notification.isRead
                              ? ''
                              : 'bg-primary/[0.04]'
                          }`}
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <NotificationIcon className="size-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-medium">
                                {notification.title}
                              </p>

                              {!notification.isRead && (
                                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {notification.description}
                            </p>

                            <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t bg-muted/20 p-3">
                    <button
                      type="button"
                      className="flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            {user && (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  aria-label="Abrir menu do utilizador"
                  aria-expanded={isProfileOpen}
                  onClick={() => {
                    setIsProfileOpen((current) => !current);
                    setIsNotificationsOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-xl border bg-background p-1.5 pr-2 transition-colors hover:bg-muted"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/20">
                    {getInitials(
                      user.firstName,
                      user.lastName,
                    )}
                  </div>

                  <div className="hidden min-w-0 text-left md:block">
                    <p className="max-w-36 truncate text-sm font-medium leading-none">
                      {fullName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatRole(user.role)}
                    </p>
                  </div>

                  <ChevronDown
                    className={`hidden size-4 text-muted-foreground transition-transform md:block ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border bg-background shadow-xl">
                    <div className="border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/20">
                          {getInitials(
                            user.firstName,
                            user.lastName,
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {fullName}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatRole(user.role)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        <UserRound className="size-4 text-muted-foreground" />
                        O meu perfil
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        <Settings className="size-4 text-muted-foreground" />
                        Definições
                      </Link>
                    </div>

                    <div className="border-t px-4 py-3 text-xs text-muted-foreground">
                      Atlantica Padel Club Manager
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hidden h-9 items-center border-t sm:flex">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground"
          >
            {pathname !== '/dashboard' && (
              <>
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-foreground"
                >
                  Início
                </Link>
                <ChevronRight className="size-3 shrink-0" />
              </>
            )}

            {breadcrumbs.map((breadcrumb, index) => (
              <div
                key={breadcrumb.href}
                className="flex min-w-0 items-center gap-1"
              >
                {index > 0 && (
                  <ChevronRight className="size-3 shrink-0" />
                )}

                {breadcrumb.isLast ? (
                  <span className="truncate font-medium text-foreground">
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="truncate transition-colors hover:text-foreground"
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}