'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CircleOff,
  Grid2X2,
  House,
  Lightbulb,
  MapPin,
  MapPinned,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Trees,
  Wrench,
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
import { DeleteCourtDialog } from '@/features/courts/components/DeleteCourtDialog';
import { CourtFormDialog } from '@/features/courts/components/CourtFormDialog';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type {
  Court,
  CourtEnvironment,
} from '@/types/court';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

type EnvironmentFilter =
  | 'ALL'
  | CourtEnvironment;

type StatusFilter =
  | 'ALL'
  | 'AVAILABLE'
  | 'MAINTENANCE'
  | 'INACTIVE';

type CourtDialogState =
  | {
      mode: 'create';
      court: null;
    }
  | {
      mode: 'edit';
      court: Court;
    }
  | null;

const currencyFormatter = new Intl.NumberFormat(
  'pt-PT',
  {
    style: 'currency',
    currency: 'EUR',
  },
);

export default function CourtsPage() {
  const [courts, setCourts] =
    useState<Court[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [
    environmentFilter,
    setEnvironmentFilter,
  ] = useState<EnvironmentFilter>('ALL');

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>('ALL');

  const [
    courtDialog,
    setCourtDialog,
  ] = useState<CourtDialogState>(null);

  const [
    courtToDelete,
    setCourtToDelete,
  ] = useState<Court | null>(null);

  const fetchCourts = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setErrorMessage(null);

        const response =
          await api.get<ApiResponse<Court[]>>(
            '/courts',
          );

        setCourts(response.data.data);
      } catch (error) {
        console.error(
          'Erro ao carregar campos:',
          error,
        );

        setErrorMessage(
          'Não foi possível carregar os campos do clube.',
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchCourts();
  }, [fetchCourts]);

  const statistics = useMemo(() => {
    const activeCourts = courts.filter(
      (court) =>
        court.isActive &&
        !court.isUnderMaintenance,
    ).length;

    const maintenanceCourts = courts.filter(
      (court) =>
        court.isUnderMaintenance,
    ).length;

    const indoorCourts = courts.filter(
      (court) =>
        court.environment === 'INDOOR',
    ).length;

    return {
      total: courts.length,
      active: activeCourts,
      maintenance: maintenanceCourts,
      indoor: indoorCourts,
    };
  }, [courts]);

  const filteredCourts = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return courts.filter((court) => {
      const searchableText = [
        court.name,
        court.location ?? '',
        court.description ?? '',
        getSurfaceLabel(court.surfaceType),
        getCourtTypeLabel(court.courtType),
        getEnvironmentLabel(
          court.environment,
        ),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(
          normalizedSearch,
        );

      const matchesEnvironment =
        environmentFilter === 'ALL' ||
        court.environment ===
          environmentFilter;

      const courtStatus =
        getCourtStatus(court).key;

      const matchesStatus =
        statusFilter === 'ALL' ||
        courtStatus === statusFilter;

      return (
        matchesSearch &&
        matchesEnvironment &&
        matchesStatus
      );
    });
  }, [
    courts,
    environmentFilter,
    searchTerm,
    statusFilter,
  ]);

  function handleCourtSaved(
    savedCourt: Court,
  ) {
    setCourts((currentCourts) => {
      const existingCourt =
        currentCourts.some(
          (court) =>
            court.id === savedCourt.id,
        );

      const nextCourts = existingCourt
        ? currentCourts.map((court) =>
            court.id === savedCourt.id
              ? savedCourt
              : court,
          )
        : [...currentCourts, savedCourt];

      return nextCourts.sort((courtA, courtB) =>
        courtA.name.localeCompare(
          courtB.name,
          'pt',
        ),
      );
    });
  }

  function handleCourtDeleted(
    courtId: string,
  ) {
    setCourts((currentCourts) =>
      currentCourts.filter(
        (court) => court.id !== courtId,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campos"
        description="Consulta o estado e gere os campos do clube."
        action={
          <Button
            type="button"
            onClick={() =>
              setCourtDialog({
                mode: 'create',
                court: null,
              })
            }
          >
            <Plus className="size-4" />
            Novo campo
          </Button>
        }
      />

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>
            Erro ao carregar campos
          </AlertTitle>

          <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span>{errorMessage}</span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                void fetchCourts()
              }
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <CourtsPageSkeleton />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatisticCard
              title="Total de campos"
              value={statistics.total}
              description="Campos registados"
              icon={Grid2X2}
            />

            <StatisticCard
              title="Disponíveis"
              value={statistics.active}
              description="Ativos e operacionais"
              icon={CheckCircle2}
              accent="success"
            />

            <StatisticCard
              title="Indoor"
              value={statistics.indoor}
              description="Campos cobertos"
              icon={House}
              accent="info"
            />

            <StatisticCard
              title="Em manutenção"
              value={statistics.maintenance}
              description="Temporariamente indisponíveis"
              icon={Wrench}
              accent="warning"
            />
          </section>

          <section className="rounded-2xl border bg-background p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={searchTerm}
                  placeholder="Pesquisar campos..."
                  className="pl-9"
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <FilterGroup>
                  <FilterButton
                    active={
                      environmentFilter ===
                      'ALL'
                    }
                    onClick={() =>
                      setEnvironmentFilter(
                        'ALL',
                      )
                    }
                  >
                    Todos
                  </FilterButton>

                  <FilterButton
                    active={
                      environmentFilter ===
                      'INDOOR'
                    }
                    onClick={() =>
                      setEnvironmentFilter(
                        'INDOOR',
                      )
                    }
                  >
                    Indoor
                  </FilterButton>

                  <FilterButton
                    active={
                      environmentFilter ===
                      'OUTDOOR'
                    }
                    onClick={() =>
                      setEnvironmentFilter(
                        'OUTDOOR',
                      )
                    }
                  >
                    Outdoor
                  </FilterButton>
                </FilterGroup>

                <FilterGroup>
                  <FilterButton
                    active={
                      statusFilter === 'ALL'
                    }
                    onClick={() =>
                      setStatusFilter('ALL')
                    }
                  >
                    Todos os estados
                  </FilterButton>

                  <FilterButton
                    active={
                      statusFilter ===
                      'AVAILABLE'
                    }
                    onClick={() =>
                      setStatusFilter(
                        'AVAILABLE',
                      )
                    }
                  >
                    Disponíveis
                  </FilterButton>

                  <FilterButton
                    active={
                      statusFilter ===
                      'MAINTENANCE'
                    }
                    onClick={() =>
                      setStatusFilter(
                        'MAINTENANCE',
                      )
                    }
                  >
                    Manutenção
                  </FilterButton>

                  <FilterButton
                    active={
                      statusFilter ===
                      'INACTIVE'
                    }
                    onClick={() =>
                      setStatusFilter(
                        'INACTIVE',
                      )
                    }
                  >
                    Inativos
                  </FilterButton>
                </FilterGroup>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  onClick={() =>
                    void fetchCourts(true)
                  }
                >
                  <RefreshCw
                    className={cn(
                      'size-4',
                      isRefreshing &&
                        'animate-spin',
                    )}
                  />

                  {isRefreshing
                    ? 'A atualizar...'
                    : 'Atualizar'}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
              <span>
                {filteredCourts.length}{' '}
                {filteredCourts.length === 1
                  ? 'campo apresentado'
                  : 'campos apresentados'}
              </span>

              {searchTerm ||
              environmentFilter !== 'ALL' ||
              statusFilter !== 'ALL' ? (
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={() => {
                    setSearchTerm('');
                    setEnvironmentFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                >
                  Limpar filtros
                </button>
              ) : null}
            </div>
          </section>

          {filteredCourts.length > 0 ? (
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredCourts.map(
                (court) => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    onEdit={() =>
                      setCourtDialog({
                        mode: 'edit',
                        court,
                      })
                    }
                    onDelete={() =>
                      setCourtToDelete(court)
                    }
                  />
                ),
              )}
            </section>
          ) : (
            <EmptyCourtsState
              hasFilters={
                searchTerm.length > 0 ||
                environmentFilter !== 'ALL' ||
                statusFilter !== 'ALL'
              }
              onCreate={() =>
                setCourtDialog({
                  mode: 'create',
                  court: null,
                })
              }
              onClearFilters={() => {
                setSearchTerm('');
                setEnvironmentFilter('ALL');
                setStatusFilter('ALL');
              }}
            />
          )}
        </>
      )}

      <CourtFormDialog
        open={courtDialog !== null}
        mode={
          courtDialog?.mode ?? 'create'
        }
        court={courtDialog?.court ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setCourtDialog(null);
          }
        }}
        onSaved={handleCourtSaved}
      />

      <DeleteCourtDialog
        open={courtToDelete !== null}
        court={courtToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCourtToDelete(null);
          }
        }}
        onDeleted={handleCourtDeleted}
      />
    </div>
  );
}

interface CourtCardProps {
  court: Court;
  onEdit: () => void;
  onDelete: () => void;
}

function CourtCard({
  court,
  onEdit,
  onDelete,
}: CourtCardProps) {
  const status = getCourtStatus(court);

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-1',
          status.barClassName,
        )}
      />

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <CourtIllustration
            environment={court.environment}
            inactive={!court.isActive}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label={`Ações de ${court.name}`}
                />
              }
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={onEdit}
              >
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
          <h2 className="truncate text-lg font-bold tracking-tight">
            {court.name}
          </h2>

          <div className="mt-2 flex min-h-5 items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />

            <span className="truncate">
              {court.location ??
                'Localização não definida'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/35 px-3 py-3">
          <span
            className={cn(
              'mt-1 size-2.5 shrink-0 rounded-full',
              status.dotClassName,
            )}
          />

          <div className="min-w-0">
            <p
              className={cn(
                'text-sm font-semibold',
                status.textClassName,
              )}
            >
              {status.label}
            </p>

            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {status.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">
            {court.environment ===
            'INDOOR' ? (
              <House className="size-3" />
            ) : (
              <Trees className="size-3" />
            )}

            {getEnvironmentLabel(
              court.environment,
            )}
          </Badge>

          <Badge variant="outline">
            {getCourtTypeLabel(
              court.courtType,
            )}
          </Badge>

          <Badge variant="outline">
            {getSurfaceLabel(
              court.surfaceType,
            )}
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Preço
            </p>

            <div className="mt-1 flex items-center gap-1.5 font-semibold">
              <Banknote className="size-4 text-emerald-600" />

              <span>
                {formatCourtPrice(
                  court.hourlyPrice,
                )}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Iluminação
            </p>

            <div className="mt-1 flex items-center gap-1.5 font-semibold">
              <Lightbulb
                className={cn(
                  'size-4',
                  court.hasLighting
                    ? 'text-amber-500'
                    : 'text-muted-foreground',
                )}
              />

              <span>
                {court.hasLighting
                  ? 'Disponível'
                  : 'Não disponível'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CourtIllustrationProps {
  environment: CourtEnvironment;
  inactive: boolean;
}

function CourtIllustration({
  environment,
  inactive,
}: CourtIllustrationProps) {
  return (
    <div
      className={cn(
        'relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border',
        environment === 'INDOOR'
          ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:border-blue-900 dark:from-blue-950/60 dark:to-cyan-950/40'
          : 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50 dark:border-emerald-900 dark:from-emerald-950/60 dark:to-lime-950/40',
        inactive && 'grayscale opacity-60',
      )}
    >
      <div
        className={cn(
          'relative h-14 w-11 border-2',
          environment === 'INDOOR'
            ? 'border-blue-500 bg-blue-400/20'
            : 'border-emerald-500 bg-emerald-400/20',
        )}
      >
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current opacity-70" />
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current opacity-70" />

        <span className="absolute inset-x-1 top-[27%] h-px bg-current opacity-55" />
        <span className="absolute inset-x-1 bottom-[27%] h-px bg-current opacity-55" />

        <span className="absolute inset-y-0 left-[18%] w-px bg-current opacity-45" />
        <span className="absolute inset-y-0 right-[18%] w-px bg-current opacity-45" />
      </div>
    </div>
  );
}

interface StatisticCardProps {
  title: string;
  value: number;
  description: string;
  icon: typeof Grid2X2;
  accent?:
    | 'default'
    | 'success'
    | 'info'
    | 'warning';
}

function StatisticCard({
  title,
  value,
  description,
  icon: Icon,
  accent = 'default',
}: StatisticCardProps) {
  const accentClassNames = {
    default:
      'bg-primary/10 text-primary',
    success:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    info:
      'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    warning:
      'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-2xl',
            accentClassNames[accent],
          )}
        >
          <Icon className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold">
            {value}
          </p>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface FilterGroupProps {
  children: React.ReactNode;
}

function FilterGroup({
  children,
}: FilterGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
      {children}
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

function FilterButton({
  active,
  children,
  onClick,
}: FilterButtonProps) {
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

interface EmptyCourtsStateProps {
  hasFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}

function EmptyCourtsState({
  hasFilters,
  onCreate,
  onClearFilters,
}: EmptyCourtsStateProps) {
  return (
    <section className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/15 px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {hasFilters ? (
          <Search className="size-6" />
        ) : (
          <MapPinned className="size-6" />
        )}
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        {hasFilters
          ? 'Nenhum campo encontrado'
          : 'Ainda não existem campos'}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {hasFilters
          ? 'Não existem campos que correspondam aos filtros selecionados.'
          : 'Os campos registados no clube serão apresentados nesta área.'}
      </p>

      <Button
        type="button"
        className="mt-5"
        variant={
          hasFilters
            ? 'outline'
            : 'default'
        }
        onClick={
          hasFilters
            ? onClearFilters
            : onCreate
        }
      >
        {hasFilters ? (
          <>
            <CircleOff className="size-4" />
            Limpar filtros
          </>
        ) : (
          <>
            <Plus className="size-4" />
            Criar primeiro campo
          </>
        )}
      </Button>
    </section>
  );
}

function CourtsPageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-28 rounded-xl"
          />
        ))}
      </section>

      <Skeleton className="h-28 rounded-2xl" />

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-80 rounded-xl"
          />
        ))}
      </section>
    </div>
  );
}

function getCourtStatus(
  court: Court,
) {
  if (court.isUnderMaintenance) {
    return {
      key: 'MAINTENANCE' as const,
      label: 'Em manutenção',
      description:
        court.maintenanceNotes ??
        'Campo temporariamente indisponível.',
      dotClassName:
        'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.55)]',
      barClassName: 'bg-amber-500',
      textClassName:
        'text-amber-700 dark:text-amber-300',
    };
  }

  if (!court.isActive) {
    return {
      key: 'INACTIVE' as const,
      label: 'Inativo',
      description:
        'Campo indisponível para utilização.',
      dotClassName: 'bg-slate-400',
      barClassName: 'bg-slate-400',
      textClassName:
        'text-slate-600 dark:text-slate-300',
    };
  }

  return {
    key: 'AVAILABLE' as const,
    label: 'Disponível',
    description:
      'Campo ativo e disponível para reservas.',
    dotClassName:
      'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.55)]',
    barClassName: 'bg-emerald-500',
    textClassName:
      'text-emerald-700 dark:text-emerald-300',
  };
}

function getSurfaceLabel(
  surfaceType: Court['surfaceType'],
) {
  const labels = {
    ARTIFICIAL_GRASS:
      'Relva artificial',
    CONCRETE: 'Betão',
    SYNTHETIC: 'Sintético',
    OTHER: 'Outro',
  };

  return labels[surfaceType];
}

function getCourtTypeLabel(
  courtType: Court['courtType'],
) {
  return courtType === 'DOUBLES'
    ? 'Pares'
    : 'Singulares';
}

function getEnvironmentLabel(
  environment: CourtEnvironment,
) {
  return environment === 'INDOOR'
    ? 'Indoor'
    : 'Outdoor';
}

function formatCourtPrice(
  value: Court['hourlyPrice'],
) {
  if (
    value === null ||
    value === undefined
  ) {
    return 'Não definido';
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 'Não definido';
  }

  return `${currencyFormatter.format(
    numericValue,
  )}/h`;
}