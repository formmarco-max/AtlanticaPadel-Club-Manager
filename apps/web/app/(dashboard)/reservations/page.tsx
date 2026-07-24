'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AlertCircle,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CircleOff,
  Clock3,
  Euro,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteReservationDialog } from '@/features/reservations/components/DeleteReservationDialog';
import { ReservationFormDialog } from '@/features/reservations/components/ReservationFormDialog';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type {
  Reservation,
  ReservationStatus,
} from '@/types/reservation';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

type StatusFilter = 'ALL' | ReservationStatus;
type DateFilter = 'ALL' | 'TODAY' | 'UPCOMING' | 'PAST';

type ReservationDialogState =
  | { mode: 'create'; reservation: null }
  | { mode: 'edit'; reservation: Reservation }
  | null;

const currencyFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
});

const dateFormatter = new Intl.DateTimeFormat('pt-PT', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('pt-PT', {
  hour: '2-digit',
  minute: '2-digit',
});

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilter>('ALL');
  const [reservationDialog, setReservationDialog] =
    useState<ReservationDialogState>(null);
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);

  const fetchReservations = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) setIsRefreshing(true);
        else setIsLoading(true);

        setErrorMessage(null);

        const response = await api.get<ApiResponse<Reservation[]>>(
          '/reservations',
        );

        setReservations(response.data.data);
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        setErrorMessage(
          'Não foi possível carregar as reservas do clube.',
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchReservations();
  }, [fetchReservations]);

  const statistics = useMemo(() => {
    const now = new Date();

    return {
      total: reservations.length,
      today: reservations.filter((reservation) =>
        isSameLocalDay(new Date(reservation.startTime), now),
      ).length,
      confirmed: reservations.filter(
        (reservation) => reservation.status === 'CONFIRMED',
      ).length,
      pending: reservations.filter(
        (reservation) => reservation.status === 'PENDING',
      ).length,
    };
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const now = new Date();

    return reservations
      .filter((reservation) => {
        const searchableText = [
          reservation.member.firstName,
          reservation.member.lastName,
          `${reservation.member.firstName} ${reservation.member.lastName}`,
          reservation.member.membershipNumber,
          reservation.member.email,
          reservation.court.name,
          reservation.court.location ?? '',
          reservation.notes ?? '',
          getStatusLabel(reservation.status),
        ]
          .join(' ')
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableText.includes(normalizedSearch);

        const matchesStatus =
          statusFilter === 'ALL' || reservation.status === statusFilter;

        const reservationDate = new Date(reservation.startTime);
        const matchesDate =
          dateFilter === 'ALL' ||
          (dateFilter === 'TODAY' &&
            isSameLocalDay(reservationDate, now)) ||
          (dateFilter === 'UPCOMING' && reservationDate >= now) ||
          (dateFilter === 'PAST' && reservationDate < now);

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort(
        (reservationA, reservationB) =>
          new Date(reservationA.startTime).getTime() -
          new Date(reservationB.startTime).getTime(),
      );
  }, [dateFilter, reservations, searchTerm, statusFilter]);

  function handleReservationSaved(savedReservation: Reservation) {
    setReservations((currentReservations) => {
      const exists = currentReservations.some(
        (reservation) => reservation.id === savedReservation.id,
      );

      return exists
        ? currentReservations.map((reservation) =>
            reservation.id === savedReservation.id
              ? savedReservation
              : reservation,
          )
        : [...currentReservations, savedReservation];
    });
  }

  function handleReservationDeleted(reservationId: string) {
    setReservations((currentReservations) =>
      currentReservations.filter(
        (reservation) => reservation.id !== reservationId,
      ),
    );
  }

  const hasFilters =
    searchTerm.length > 0 ||
    statusFilter !== 'ALL' ||
    dateFilter !== 'ALL';

  function clearFilters() {
    setSearchTerm('');
    setStatusFilter('ALL');
    setDateFilter('ALL');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservas"
        description="Consulta a agenda e gere as reservas dos campos do clube."
        action={
          <Button
            type="button"
            onClick={() =>
              setReservationDialog({
                mode: 'create',
                reservation: null,
              })
            }
          >
            <Plus className="size-4" />
            Nova reserva
          </Button>
        }
      />

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Erro ao carregar reservas</AlertTitle>
          <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span>{errorMessage}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void fetchReservations()}
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <ReservationsPageSkeleton />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatisticCard
              title="Total de reservas"
              value={statistics.total}
              description="Reservas registadas"
              icon={CalendarDays}
            />
            <StatisticCard
              title="Reservas hoje"
              value={statistics.today}
              description="Agenda do dia"
              icon={CalendarClock}
              accent="info"
            />
            <StatisticCard
              title="Confirmadas"
              value={statistics.confirmed}
              description="Reservas confirmadas"
              icon={CheckCircle2}
              accent="success"
            />
            <StatisticCard
              title="Pendentes"
              value={statistics.pending}
              description="A aguardar confirmação"
              icon={Clock3}
              accent="warning"
            />
          </section>

          <section className="rounded-2xl border bg-background p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  placeholder="Pesquisar sócio, campo ou notas..."
                  className="pl-9"
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <FilterGroup>
                  <FilterButton
                    active={dateFilter === 'ALL'}
                    onClick={() => setDateFilter('ALL')}
                  >
                    Todas as datas
                  </FilterButton>
                  <FilterButton
                    active={dateFilter === 'TODAY'}
                    onClick={() => setDateFilter('TODAY')}
                  >
                    Hoje
                  </FilterButton>
                  <FilterButton
                    active={dateFilter === 'UPCOMING'}
                    onClick={() => setDateFilter('UPCOMING')}
                  >
                    Futuras
                  </FilterButton>
                  <FilterButton
                    active={dateFilter === 'PAST'}
                    onClick={() => setDateFilter('PAST')}
                  >
                    Passadas
                  </FilterButton>
                </FilterGroup>

                <select
                  value={statusFilter}
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                >
                  <option value="ALL">Todos os estados</option>
                  <option value="CONFIRMED">Confirmadas</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="COMPLETED">Concluídas</option>
                  <option value="CANCELLED">Canceladas</option>
                  <option value="NO_SHOW">Faltas</option>
                </select>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  onClick={() => void fetchReservations(true)}
                >
                  <RefreshCw
                    className={cn(
                      'size-4',
                      isRefreshing && 'animate-spin',
                    )}
                  />
                  {isRefreshing ? 'A atualizar...' : 'Atualizar'}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
              <span>
                {filteredReservations.length}{' '}
                {filteredReservations.length === 1
                  ? 'reserva apresentada'
                  : 'reservas apresentadas'}
              </span>

              {hasFilters ? (
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </button>
              ) : null}
            </div>
          </section>

          {filteredReservations.length > 0 ? (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onEdit={() =>
                    setReservationDialog({
                      mode: 'edit',
                      reservation,
                    })
                  }
                  onDelete={() => setReservationToDelete(reservation)}
                />
              ))}
            </section>
          ) : (
            <EmptyReservationsState
              hasFilters={hasFilters}
              onCreate={() =>
                setReservationDialog({
                  mode: 'create',
                  reservation: null,
                })
              }
              onClearFilters={clearFilters}
            />
          )}
        </>
      )}

      <ReservationFormDialog
        open={reservationDialog !== null}
        mode={reservationDialog?.mode ?? 'create'}
        reservation={reservationDialog?.reservation ?? null}
        onOpenChange={(open) => {
          if (!open) setReservationDialog(null);
        }}
        onSaved={handleReservationSaved}
      />

      <DeleteReservationDialog
        open={reservationToDelete !== null}
        reservation={reservationToDelete}
        onOpenChange={(open) => {
          if (!open) setReservationToDelete(null);
        }}
        onDeleted={handleReservationDeleted}
      />
    </div>
  );
}

function ReservationCard({
  reservation,
  onEdit,
  onDelete,
}: {
  reservation: Reservation;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const status = getReservationStatus(reservation.status);
  const startDate = new Date(reservation.startTime);
  const endDate = new Date(reservation.endTime);

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className={cn('absolute inset-x-0 top-0 h-1', status.barClassName)} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarCheck2 className="size-5" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label="Ações da reserva"
                />
              }
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 className="size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {dateFormatter.format(startDate)}
          </p>
          <h2 className="mt-1 truncate text-lg font-bold tracking-tight">
            {reservation.member.firstName} {reservation.member.lastName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sócio {reservation.member.membershipNumber}
          </p>
        </div>

        <div className="mt-4 rounded-xl bg-muted/35 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock3 className="size-4 text-primary" />
            {timeFormatter.format(startDate)} — {timeFormatter.format(endDate)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">
              {reservation.court.name}
              {reservation.court.location
                ? ` · ${reservation.court.location}`
                : ''}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Badge className={status.badgeClassName}>{status.label}</Badge>
          <div className="flex items-center gap-1.5 font-semibold">
            <Euro className="size-4 text-emerald-600" />
            {formatPrice(reservation.totalPrice)}
          </div>
        </div>

        {reservation.notes ? (
          <p className="mt-4 line-clamp-2 border-t pt-4 text-sm leading-relaxed text-muted-foreground">
            {reservation.notes}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function StatisticCard({
  title,
  value,
  description,
  icon: Icon,
  accent = 'default',
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof CalendarDays;
  accent?: 'default' | 'success' | 'info' | 'warning';
}) {
  const accents = {
    default: 'bg-primary/10 text-primary',
    success:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    warning:
      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-2xl',
            accents[accent],
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
      {children}
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function EmptyReservationsState({
  hasFilters,
  onCreate,
  onClearFilters,
}: {
  hasFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}) {
  return (
    <section className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/15 px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {hasFilters ? (
          <Search className="size-6" />
        ) : (
          <CalendarDays className="size-6" />
        )}
      </div>
      <h2 className="mt-5 text-lg font-semibold">
        {hasFilters
          ? 'Nenhuma reserva encontrada'
          : 'Ainda não existem reservas'}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {hasFilters
          ? 'Não existem reservas que correspondam aos filtros selecionados.'
          : 'As reservas dos campos do clube serão apresentadas nesta área.'}
      </p>
      <Button
        type="button"
        className="mt-5"
        variant={hasFilters ? 'outline' : 'default'}
        onClick={hasFilters ? onClearFilters : onCreate}
      >
        {hasFilters ? (
          <>
            <CircleOff className="size-4" />
            Limpar filtros
          </>
        ) : (
          <>
            <Plus className="size-4" />
            Criar primeira reserva
          </>
        )}
      </Button>
    </section>
  );
}

function ReservationsPageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </section>
      <Skeleton className="h-28 rounded-2xl" />
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-72 rounded-xl" />
        ))}
      </section>
    </div>
  );
}

function getReservationStatus(status: ReservationStatus) {
  const statuses = {
    PENDING: {
      label: 'Pendente',
      barClassName: 'bg-amber-500',
      badgeClassName:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    },
    CONFIRMED: {
      label: 'Confirmada',
      barClassName: 'bg-emerald-500',
      badgeClassName:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    },
    COMPLETED: {
      label: 'Concluída',
      barClassName: 'bg-blue-500',
      badgeClassName:
        'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
    },
    CANCELLED: {
      label: 'Cancelada',
      barClassName: 'bg-rose-500',
      badgeClassName:
        'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300',
    },
    NO_SHOW: {
      label: 'Falta',
      barClassName: 'bg-slate-500',
      badgeClassName:
        'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
    },
  };

  return statuses[status];
}

function getStatusLabel(status: ReservationStatus) {
  return getReservationStatus(status).label;
}

function formatPrice(value: Reservation['totalPrice']) {
  if (value === null || value === undefined) return 'Não definido';
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? currencyFormatter.format(numericValue)
    : 'Não definido';
}

function isSameLocalDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}
