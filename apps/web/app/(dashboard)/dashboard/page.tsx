'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Dumbbell,
  LayoutDashboard,
  Map,
  RefreshCw,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/lib/api';

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
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>

        <Icon className="size-5 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold">{value}</div>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadSummary(): Promise<void> {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await api.get<ApiResponse<DashboardSummary>>(
        '/dashboard/summary',
      );

      setSummary(response.data.data);
    } catch (error: unknown) {
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
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Resumo geral do Atlantica Padel Club.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </CardHeader>

              <CardContent>
                <div className="h-3 w-40 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (errorMessage || !summary) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Resumo geral do Atlantica Padel Club.
          </p>
        </div>

        <Card className="border-destructive/50">
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="size-7" />

            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
          </div>

          <p className="mt-1 text-muted-foreground">
            Resumo geral da atividade do clube.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => void loadSummary()}
        >
          <RefreshCw className="size-4" />
          Atualizar
        </Button>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Estrutura do clube
          </h2>

          <p className="text-sm text-muted-foreground">
            Totais e registos ativos.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Sócios"
            value={summary.members.total}
            description={`${summary.members.active} sócios ativos`}
            icon={Users}
          />

          <SummaryCard
            title="Treinadores"
            value={summary.coaches.total}
            description={`${summary.coaches.active} treinadores ativos`}
            icon={Dumbbell}
          />

          <SummaryCard
            title="Campos"
            value={summary.courts.total}
            description={`${summary.courts.active} campos ativos`}
            icon={Map}
          />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Reservas
          </h2>

          <p className="text-sm text-muted-foreground">
            Estado atual das reservas do clube.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Reservas de hoje"
            value={summary.reservations.today}
            description="Reservas agendadas para hoje"
            icon={CalendarCheck}
          />

          <SummaryCard
            title="Próximas reservas"
            value={summary.reservations.upcoming}
            description="Reservas futuras confirmadas"
            icon={CalendarClock}
          />

          <SummaryCard
            title="Canceladas hoje"
            value={summary.reservations.cancelledToday}
            description="Reservas canceladas durante o dia"
            icon={CalendarX}
          />
        </div>
      </section>
    </div>
  );
}