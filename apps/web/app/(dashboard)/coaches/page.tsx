'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AlertCircle,
  BadgeCheck,
  BriefcaseBusiness,
  CircleOff,
  Mail,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  UserRound,
  UsersRound,
  UserX,
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
import { CoachFormDialog } from '@/features/coaches/components/CoachFormDialog';
import { DeleteCoachDialog } from '@/features/coaches/components/DeleteCoachDialog';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Coach } from '@/types/coach';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

type CoachDialogState =
  | { mode: 'create'; coach: null }
  | { mode: 'edit'; coach: Coach }
  | null;

const hireDateFormatter = new Intl.DateTimeFormat('pt-PT', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('ALL');
  const [coachDialog, setCoachDialog] =
    useState<CoachDialogState>(null);
  const [coachToDelete, setCoachToDelete] =
    useState<Coach | null>(null);

  const fetchCoaches = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) setIsRefreshing(true);
        else setIsLoading(true);

        setErrorMessage(null);

        const response = await api.get<ApiResponse<Coach[]>>(
          '/coaches',
        );

        setCoaches(response.data.data);
      } catch (error) {
        console.error('Erro ao carregar treinadores:', error);
        setErrorMessage(
          'Não foi possível carregar os treinadores do clube.',
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchCoaches();
  }, [fetchCoaches]);

  const statistics = useMemo(() => {
    return {
      total: coaches.length,
      active: coaches.filter((coach) => coach.isActive).length,
      inactive: coaches.filter((coach) => !coach.isActive).length,
      specialized: coaches.filter(
        (coach) => Boolean(coach.specialization?.trim()),
      ).length,
    };
  }, [coaches]);

  const filteredCoaches = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return coaches
      .filter((coach) => {
        const searchableText = [
          coach.firstName,
          coach.lastName,
          `${coach.firstName} ${coach.lastName}`,
          coach.employeeNumber ?? '',
          coach.email ?? '',
          coach.phone ?? '',
          coach.specialization ?? '',
          coach.biography ?? '',
          coach.isActive ? 'ativo' : 'inativo',
        ]
          .join(' ')
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableText.includes(normalizedSearch);

        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'ACTIVE' && coach.isActive) ||
          (statusFilter === 'INACTIVE' && !coach.isActive);

        return matchesSearch && matchesStatus;
      })
      .sort((coachA, coachB) =>
        `${coachA.firstName} ${coachA.lastName}`.localeCompare(
          `${coachB.firstName} ${coachB.lastName}`,
          'pt-PT',
        ),
      );
  }, [coaches, searchTerm, statusFilter]);

  function handleCoachSaved(savedCoach: Coach) {
    setCoaches((currentCoaches) => {
      const exists = currentCoaches.some(
        (coach) => coach.id === savedCoach.id,
      );

      return exists
        ? currentCoaches.map((coach) =>
            coach.id === savedCoach.id ? savedCoach : coach,
          )
        : [...currentCoaches, savedCoach];
    });
  }

  function handleCoachDeleted(coachId: string) {
    setCoaches((currentCoaches) =>
      currentCoaches.filter((coach) => coach.id !== coachId),
    );
  }

  const hasFilters =
    searchTerm.length > 0 || statusFilter !== 'ALL';

  function clearFilters() {
    setSearchTerm('');
    setStatusFilter('ALL');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Treinadores"
        description="Gere os treinadores, especializações e contactos do clube."
        action={
          <Button
            type="button"
            onClick={() =>
              setCoachDialog({
                mode: 'create',
                coach: null,
              })
            }
          >
            <Plus className="size-4" />
            Novo treinador
          </Button>
        }
      />

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Erro ao carregar treinadores</AlertTitle>
          <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span>{errorMessage}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void fetchCoaches()}
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <CoachesPageSkeleton />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatisticCard
              title="Total de treinadores"
              value={statistics.total}
              description="Treinadores registados"
              icon={UsersRound}
            />
            <StatisticCard
              title="Ativos"
              value={statistics.active}
              description="Disponíveis no clube"
              icon={UserCheck}
              accent="success"
            />
            <StatisticCard
              title="Inativos"
              value={statistics.inactive}
              description="Sem atividade"
              icon={UserX}
              accent="warning"
            />
            <StatisticCard
              title="Com especialização"
              value={statistics.specialized}
              description="Perfil técnico definido"
              icon={BadgeCheck}
              accent="info"
            />
          </section>

          <section className="rounded-2xl border bg-background p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  placeholder="Pesquisar nome, especialização ou contacto..."
                  className="pl-9"
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <FilterGroup>
                  <FilterButton
                    active={statusFilter === 'ALL'}
                    onClick={() => setStatusFilter('ALL')}
                  >
                    Todos
                  </FilterButton>
                  <FilterButton
                    active={statusFilter === 'ACTIVE'}
                    onClick={() => setStatusFilter('ACTIVE')}
                  >
                    Ativos
                  </FilterButton>
                  <FilterButton
                    active={statusFilter === 'INACTIVE'}
                    onClick={() => setStatusFilter('INACTIVE')}
                  >
                    Inativos
                  </FilterButton>
                </FilterGroup>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  onClick={() => void fetchCoaches(true)}
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
                {filteredCoaches.length}{' '}
                {filteredCoaches.length === 1
                  ? 'treinador apresentado'
                  : 'treinadores apresentados'}
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

          {filteredCoaches.length > 0 ? (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCoaches.map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  onEdit={() =>
                    setCoachDialog({
                      mode: 'edit',
                      coach,
                    })
                  }
                  onDelete={() => setCoachToDelete(coach)}
                />
              ))}
            </section>
          ) : (
            <EmptyCoachesState
              hasFilters={hasFilters}
              onCreate={() =>
                setCoachDialog({
                  mode: 'create',
                  coach: null,
                })
              }
              onClearFilters={clearFilters}
            />
          )}
        </>
      )}

      <CoachFormDialog
        open={coachDialog !== null}
        mode={coachDialog?.mode ?? 'create'}
        coach={coachDialog?.coach ?? null}
        onOpenChange={(open) => {
          if (!open) setCoachDialog(null);
        }}
        onSaved={handleCoachSaved}
      />

      <DeleteCoachDialog
        open={coachToDelete !== null}
        coach={coachToDelete}
        onOpenChange={(open) => {
          if (!open) setCoachToDelete(null);
        }}
        onDeleted={handleCoachDeleted}
      />
    </div>
  );
}

function CoachCard({
  coach,
  onEdit,
  onDelete,
}: {
  coach: Coach;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const fullName = `${coach.firstName} ${coach.lastName}`;
  const initials = getInitials(coach.firstName, coach.lastName);

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1',
          coach.isActive ? 'bg-emerald-500' : 'bg-slate-400',
        )}
      />

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
              {initials}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold tracking-tight">
                {fullName}
              </h2>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {coach.employeeNumber
                  ? `N.º ${coach.employeeNumber}`
                  : 'Sem número interno'}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0"
                  aria-label={`Ações de ${fullName}`}
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
              <DropdownMenuItem
                variant="destructive"
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5">
          <Badge
            className={
              coach.isActive
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
            }
          >
            {coach.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <div className="mt-4 rounded-xl bg-muted/35 p-3">
          <div className="flex items-start gap-2 text-sm">
            <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">
                Especialização
              </span>
              <span className="mt-0.5 block truncate font-medium">
                {coach.specialization ?? 'Não definida'}
              </span>
            </span>
          </div>

          {coach.hireDate ? (
            <div className="mt-3 flex items-start gap-2 border-t pt-3 text-sm">
              <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="block text-xs text-muted-foreground">
                  Contratado em
                </span>
                <span className="mt-0.5 block font-medium">
                  {hireDateFormatter.format(new Date(coach.hireDate))}
                </span>
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-4 space-y-2">
          {coach.email ? (
            <a
              href={`mailto:${coach.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{coach.email}</span>
            </a>
          ) : null}

          {coach.phone ? (
            <a
              href={`tel:${coach.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-4 shrink-0" />
              <span className="truncate">{coach.phone}</span>
            </a>
          ) : null}

          {!coach.email && !coach.phone ? (
            <p className="text-sm text-muted-foreground">
              Sem contactos registados.
            </p>
          ) : null}
        </div>

        {coach.biography ? (
          <p className="mt-4 line-clamp-3 border-t pt-4 text-sm leading-relaxed text-muted-foreground">
            {coach.biography}
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
  icon: typeof UsersRound;
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

function EmptyCoachesState({
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
          <UsersRound className="size-6" />
        )}
      </div>
      <h2 className="mt-5 text-lg font-semibold">
        {hasFilters
          ? 'Nenhum treinador encontrado'
          : 'Ainda não existem treinadores'}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {hasFilters
          ? 'Não existem treinadores que correspondam aos filtros selecionados.'
          : 'Os treinadores do clube serão apresentados nesta área.'}
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
            Criar primeiro treinador
          </>
        )}
      </Button>
    </section>
  );
}

function CoachesPageSkeleton() {
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
          <Skeleton key={index} className="h-80 rounded-xl" />
        ))}
      </section>
    </div>
  );
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
