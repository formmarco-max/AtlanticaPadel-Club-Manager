'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { LucideIcon } from 'lucide-react';
import {
  Banknote,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarX,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Dumbbell,
  Map as MapIcon,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  WalletCards,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/lib/api';

type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

type PaymentStatus = 'PAID' | 'PENDING';

interface DashboardReservation {
  id: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
  court: {
    id: string;
    name: string;
    location: string | null;
  };
}

interface DashboardSummary {
  members: {
    total: number;
    active: number;
  };
  coaches: {
    total: number;
    active: number;
  };
  courts: {
    total: number;
    active: number;
  };
  reservations: {
    today: number;
    upcoming: number;
    cancelledToday: number;
  };
  finance: {
    billedToday: number;
    paidToday: number;
    pendingToday: number;
    collectionRate: number;
    averageTicket: number;
  };
  operational: {
    mostUsedCourt: {
      id: string;
      name: string;
      reservations: number;
    } | null;
    highestRevenueCourt: {
      id: string;
      name: string;
      revenue: number;
    } | null;
    peakHour: {
      hour: number;
      label: string;
      reservations: number;
    } | null;
  };
  todaySchedule: DashboardReservation[];
  upcomingReservations: DashboardReservation[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  accent?: 'default' | 'success' | 'warning' | 'info';
}

interface InsightCardProps {
  eyebrow: string;
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  accent?: 'default' | 'success' | 'warning' | 'info';
}

interface ReservationGroup {
  key: string;
  label: string;
  reservations: DashboardReservation[];
}

const currencyFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
});

const longDateFormatter = new Intl.DateTimeFormat('pt-PT', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const upcomingDateFormatter = new Intl.DateTimeFormat('pt-PT', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

const timeFormatter = new Intl.DateTimeFormat('pt-PT', {
  hour: '2-digit',
  minute: '2-digit',
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function formatTime(value: string): string {
  return timeFormatter.format(new Date(value));
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatReservationStatus(
  status: ReservationStatus,
): string {
  const labels: Record<ReservationStatus, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    COMPLETED: 'Concluída',
    NO_SHOW: 'Falta',
  };

  return labels[status];
}

function getReservationStatusClasses(
  status: ReservationStatus,
): string {
  const classes: Record<ReservationStatus, string> = {
    PENDING:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
    CONFIRMED:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
    CANCELLED:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
    COMPLETED:
      'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
    NO_SHOW:
      'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300',
  };

  return classes[status];
}

function getAccentClasses(
  accent: KpiCardProps['accent'],
): string {
  const classes = {
    default:
      'bg-muted text-muted-foreground ring-muted-foreground/10',
    success:
      'bg-emerald-100 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-950 dark:text-emerald-300',
    warning:
      'bg-amber-100 text-amber-700 ring-amber-600/10 dark:bg-amber-950 dark:text-amber-300',
    info:
      'bg-blue-100 text-blue-700 ring-blue-600/10 dark:bg-blue-950 dark:text-blue-300',
  };

  return classes[accent ?? 'default'];
}

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  accent = 'default',
}: KpiCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border bg-background/95 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary/70" />

      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight">
              {value}
            </p>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${getAccentClasses(accent)}`}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({
  eyebrow,
  title,
  value,
  description,
  icon: Icon,
  accent = 'default',
}: InsightCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>

            <h3 className="mt-2 text-sm font-medium text-muted-foreground">
              {title}
            </h3>

            <p className="mt-3 text-2xl font-bold tracking-tight">
              {value}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${getAccentClasses(accent)}`}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  if (status === 'PAID') {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
        <CheckCircle2 className="size-3" />
        Pago
      </Badge>
    );
  }

  return (
    <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
      <Clock3 className="size-3" />
      Por pagar
    </Badge>
  );
}

function TodayReservationCard({
  reservation,
}: {
  reservation: DashboardReservation;
}) {
  return (
    <div className="group relative grid gap-4 border-b py-5 last:border-b-0 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center">
      <div>
        <p className="text-xl font-bold text-primary">
          {formatTime(reservation.startTime)}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          até {formatTime(reservation.endTime)}
        </p>
      </div>

      <div className="relative border-l-2 border-primary/20 pl-5">
        <span className="absolute -left-[6px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />

        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">
            {reservation.court.name}
          </h3>

          <Badge
            variant="outline"
            className={getReservationStatusClasses(
              reservation.status,
            )}
          >
            {formatReservationStatus(reservation.status)}
          </Badge>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <UserRound className="size-4" />
          <span>{reservation.member.fullName}</span>
        </div>

        {reservation.court.location && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <MapIcon className="size-3.5" />
            <span>{reservation.court.location}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <span className="text-lg font-bold">
          {formatCurrency(reservation.totalPrice)}
        </span>

        <PaymentBadge status={reservation.paymentStatus} />
      </div>
    </div>
  );
}

function groupUpcomingReservations(
  reservations: DashboardReservation[],
): ReservationGroup[] {
  const groups = new Map<string, ReservationGroup>();

  reservations.forEach((reservation) => {
    const reservationDate = new Date(reservation.startTime);

    const key = [
      reservationDate.getFullYear(),
      reservationDate.getMonth(),
      reservationDate.getDate(),
    ].join('-');

    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.reservations.push(reservation);
      return;
    }

    groups.set(key, {
      key,
      label: capitalize(
        upcomingDateFormatter.format(reservationDate),
      ),
      reservations: [reservation],
    });
  });

  return Array.from(groups.values());
}

function LoadingDashboard() {
  return (
    <div className="space-y-8">
      <div className="h-64 animate-pulse rounded-3xl bg-muted" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-40 animate-pulse bg-muted/40" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.8fr)]">
        <Card className="h-[520px] animate-pulse bg-muted/40" />
        <Card className="h-[520px] animate-pulse bg-muted/40" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadSummary(
    silent = false,
  ): Promise<void> {
    const isInitialLoad = summary === null;

    if (!silent) {
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
    }

    try {
      const response = await api.get<
        ApiResponse<DashboardSummary>
      >('/dashboard/summary');

      setSummary(response.data.data);
      setErrorMessage('');
    } catch (error: unknown) {
      if (silent && summary) {
        console.error(
          'Falha na atualização automática do dashboard:',
          error,
        );
        return;
      }

      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;

        if (typeof apiMessage === 'string') {
          setErrorMessage(apiMessage);
        } else {
          setErrorMessage(
            'Não foi possível carregar os dados do dashboard.',
          );
        }
      } else {
        setErrorMessage(
          'Ocorreu um erro inesperado ao carregar o dashboard.',
        );
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }

  useEffect(() => {
    void loadSummary();

    const interval = window.setInterval(() => {
      void loadSummary(true);
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upcomingGroups = useMemo(
    () =>
      summary
        ? groupUpcomingReservations(
            summary.upcomingReservations,
          )
        : [],
    [summary],
  );

  if (isLoading) {
    return <LoadingDashboard />;
  }

  if (errorMessage || !summary) {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl border-destructive/50">
          <CardHeader>
            <CardTitle>
              Não foi possível carregar o dashboard
            </CardTitle>

            <CardDescription>
              {errorMessage ||
                'Os dados do dashboard não estão disponíveis.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadSummary()}
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-primary/[0.05] to-background shadow-sm">
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
              <Sparkles className="size-3.5" />
              Resumo diário
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Visão operacional do Atlantica Padel Club
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Acompanha num único local as reservas, a faturação e os principais indicadores da atividade do clube.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="rounded-full bg-background/70 px-3 py-1.5"
              >
                <CalendarCheck className="size-3.5" />
                {summary.reservations.today} reservas hoje
              </Badge>

              <Badge
                variant="outline"
                className="rounded-full bg-background/70 px-3 py-1.5"
              >
                <CircleDollarSign className="size-3.5" />
                {formatCurrency(summary.finance.billedToday)} faturados
              </Badge>

              <Badge
                variant="outline"
                className="rounded-full bg-background/70 px-3 py-1.5"
              >
                <Users className="size-3.5" />
                {summary.members.active} sócios ativos
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              <div className="rounded-2xl border bg-background/75 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-medium text-muted-foreground">
                  Faturação
                </p>
                <p className="mt-2 text-xl font-bold">
                  {formatCurrency(summary.finance.billedToday)}
                </p>
              </div>

              <div className="rounded-2xl border bg-background/75 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-medium text-muted-foreground">
                  Reservas
                </p>
                <p className="mt-2 text-xl font-bold">
                  {summary.reservations.today}
                </p>
              </div>

              <div className="rounded-2xl border bg-background/75 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-medium text-muted-foreground">
                  Cobrança
                </p>
                <p className="mt-2 text-xl font-bold">
                  {summary.finance.collectionRate.toLocaleString(
                    'pt-PT',
                  )}
                  %
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Atualização automática
                </p>
                <p className="text-xs text-muted-foreground">
                  A cada 60 segundos, sem interromper a página.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isRefreshing}
                onClick={() => void loadSummary()}
              >
                <RefreshCw
                  className={`size-4 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                {isRefreshing
                  ? 'A atualizar...'
                  : 'Atualizar agora'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Visão geral
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Indicadores principais da operação do clube.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Sócios"
            value={summary.members.total}
            description={`${summary.members.active} sócios ativos`}
            icon={Users}
            accent="info"
          />

          <KpiCard
            title="Treinadores"
            value={summary.coaches.total}
            description={`${summary.coaches.active} treinadores ativos`}
            icon={Dumbbell}
          />

          <KpiCard
            title="Campos"
            value={summary.courts.total}
            description={`${summary.courts.active} campos disponíveis`}
            icon={MapIcon}
            accent="success"
          />

          <KpiCard
            title="Reservas futuras"
            value={summary.reservations.upcoming}
            description={`${summary.reservations.cancelledToday} canceladas hoje`}
            icon={CalendarClock}
            accent="warning"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.8fr)]">
        <Card className="overflow-hidden rounded-2xl">
          <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="size-5 text-primary" />
                  Agenda de hoje
                </CardTitle>
                <CardDescription className="mt-1">
                  {capitalize(
                    longDateFormatter.format(new Date()),
                  )}
                </CardDescription>
              </div>

              <Badge variant="outline" className="w-fit rounded-full">
                {summary.todaySchedule.length}{' '}
                {summary.todaySchedule.length === 1
                  ? 'reserva'
                  : 'reservas'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-5 py-1 sm:px-6">
            {summary.todaySchedule.length > 0 ? (
              summary.todaySchedule.map((reservation) => (
                <TodayReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <CalendarCheck className="size-7 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">
                  Sem reservas para hoje
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Não existem reservas ativas agendadas para o dia de hoje.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl">
          <CardHeader className="border-b bg-muted/20 px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarClock className="size-5 text-primary" />
                  Próximas reservas
                </CardTitle>
                <CardDescription className="mt-1">
                  {summary.reservations.upcoming} reservas futuras
                </CardDescription>
              </div>

              <Link
                href="/reservations"
                className="text-xs font-medium text-primary hover:underline"
              >
                Ver calendário
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {upcomingGroups.length > 0 ? (
              <div className="max-h-[650px] overflow-y-auto">
                {upcomingGroups.map((group) => (
                  <div key={group.key}>
                    <div className="sticky top-0 z-10 border-b bg-background/95 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
                      {group.label}
                    </div>

                    <div className="space-y-3 p-4">
                      {group.reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="rounded-xl border bg-background p-4 transition-all duration-200 hover:border-primary/30 hover:bg-muted/20 hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-primary">
                                  {formatTime(
                                    reservation.startTime,
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  até {formatTime(reservation.endTime)}
                                </span>
                              </div>

                              <p className="mt-2 truncate font-medium">
                                {reservation.court.name}
                              </p>
                              <p className="mt-1 truncate text-sm text-muted-foreground">
                                {reservation.member.fullName}
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="font-semibold">
                                {formatCurrency(
                                  reservation.totalPrice,
                                )}
                              </p>
                              <div className="mt-2">
                                <PaymentBadge
                                  status={
                                    reservation.paymentStatus
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <CalendarClock className="size-8 text-muted-foreground" />
                <h3 className="mt-3 font-semibold">
                  Sem reservas futuras
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Não existem reservas futuras disponíveis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Indicadores financeiros
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estado dos pagamentos e desempenho de cobrança do dia.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            eyebrow="Hoje"
            title="Total faturado"
            value={formatCurrency(summary.finance.billedToday)}
            description={`Ticket médio de ${formatCurrency(summary.finance.averageTicket)}`}
            icon={CircleDollarSign}
            accent="info"
          />

          <InsightCard
            eyebrow="Recebimentos"
            title="Valor recebido"
            value={formatCurrency(summary.finance.paidToday)}
            description="Pagamentos já confirmados"
            icon={Banknote}
            accent="success"
          />

          <InsightCard
            eyebrow="Pendentes"
            title="Por receber"
            value={formatCurrency(summary.finance.pendingToday)}
            description="Pagamentos ainda em falta"
            icon={WalletCards}
            accent="warning"
          />

          <InsightCard
            eyebrow="Eficiência"
            title="Taxa de cobrança"
            value={`${summary.finance.collectionRate.toLocaleString(
              'pt-PT',
            )}%`}
            description="Percentagem já recebida"
            icon={TrendingUp}
            accent={
              summary.finance.collectionRate >= 75
                ? 'success'
                : 'warning'
            }
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Indicadores operacionais
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Destaques calculados a partir da atividade de hoje.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <InsightCard
            eyebrow="Utilização"
            title="Campo mais utilizado"
            value={
              summary.operational.mostUsedCourt?.name ??
              'Sem dados'
            }
            description={
              summary.operational.mostUsedCourt
                ? `${summary.operational.mostUsedCourt.reservations} reservas hoje`
                : 'Ainda não existem reservas hoje'
            }
            icon={Trophy}
            accent="success"
          />

          <InsightCard
            eyebrow="Receita"
            title="Campo com maior faturação"
            value={
              summary.operational.highestRevenueCourt?.name ??
              'Sem dados'
            }
            description={
              summary.operational.highestRevenueCourt
                ? formatCurrency(
                    summary.operational.highestRevenueCourt
                      .revenue,
                  )
                : 'Ainda não existem valores faturados'
            }
            icon={CreditCard}
            accent="info"
          />

          <InsightCard
            eyebrow="Procura"
            title="Hora de maior procura"
            value={
              summary.operational.peakHour?.label ??
              'Sem dados'
            }
            description={
              summary.operational.peakHour
                ? `${summary.operational.peakHour.reservations} reservas iniciadas`
                : 'Ainda não existem reservas hoje'
            }
            icon={Target}
            accent="warning"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <InsightCard
          eyebrow="Agenda"
          title="Próximas reservas"
          value={String(summary.reservations.upcoming)}
          description="Reservas futuras ainda ativas"
          icon={CalendarClock}
          accent="info"
        />

        <InsightCard
          eyebrow="Cancelamentos"
          title="Canceladas hoje"
          value={String(summary.reservations.cancelledToday)}
          description="Cancelamentos registados durante o dia"
          icon={CalendarX}
          accent={
            summary.reservations.cancelledToday > 0
              ? 'warning'
              : 'default'
          }
        />
      </section>
    </div>
  );
}