'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Download,
  Plus,
  RefreshCw,
} from 'lucide-react';

import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteMemberDialog } from '@/features/members/components/DeleteMemberDialog';
import { MemberDialog } from '@/features/members/components/MemberDialog';
import { getMemberColumns } from '@/features/members/components/memberColumns';
import { api } from '@/lib/api';
import type { Member } from '@/types/member';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

type MemberDialogMode = 'create' | 'edit';

/**
 * Protege o conteúdo CSV contra separadores, aspas,
 * quebras de linha e fórmulas interpretadas pelo Excel.
 */
function escapeCsvValue(
  value: string | number | boolean | null | undefined,
): string {
  if (value === null || value === undefined) {
    return '';
  }

  let normalizedValue = String(value);

  // Impede que o Excel interprete o conteúdo como uma fórmula.
  if (/^[=+\-@]/.test(normalizedValue)) {
    normalizedValue = `'${normalizedValue}`;
  }

  const escapedValue = normalizedValue.replace(/"/g, '""');

  return `"${escapedValue}"`;
}

function formatCsvDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-PT').format(date);
}
export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberDialogMode, setMemberDialogMode] =
    useState<MemberDialogMode>('create');
  const [selectedMember, setSelectedMember] =
    useState<Member | null>(null);

  const fetchMembers = useCallback(async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage(null);

      const response =
        await api.get<ApiResponse<Member[]>>('/members');

      setMembers(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar sócios:', error);

      setErrorMessage(
        'Não foi possível carregar a lista de sócios. Tenta novamente.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  function handleCreateMember() {
    setSelectedMember(null);
    setMemberDialogMode('create');
    setMemberDialogOpen(true);
  }

  function handleEditMember(member: Member) {
    setSelectedMember(member);
    setMemberDialogMode('edit');
    setMemberDialogOpen(true);
  }

  function handleDeleteMember(member: Member) {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  }

  function handleMemberDialogOpenChange(open: boolean) {
    setMemberDialogOpen(open);

    if (!open) {
      setSelectedMember(null);
      setMemberDialogMode('create');
    }
  }

  function handleDeleteDialogOpenChange(open: boolean) {
    setDeleteDialogOpen(open);

    if (!open) {
      setSelectedMember(null);
    }
  }

  async function handleMemberSaved() {
    await fetchMembers(true);
  }

  async function handleMemberDeleted() {
    await fetchMembers(true);
  }

  function handleExportCsv() {
  if (members.length === 0) {
    return;
  }

  const headers = [
    'Número de sócio',
    'Primeiro nome',
    'Apelido',
    'Email',
    'Telefone',
    'Data de nascimento',
    'Data de inscrição',
    'Estado',
    'Observações',
  ];

  const rows = members.map((member) => [
    member.membershipNumber,
    member.firstName,
    member.lastName,
    member.email ?? '',
    member.phone ?? '',
    formatCsvDate(member.birthDate),
    formatCsvDate(member.joinDate),
    member.isActive ? 'Ativo' : 'Inativo',
    member.notes ?? '',
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(';'),
    ...rows.map((row) =>
      row.map(escapeCsvValue).join(';'),
    ),
  ].join('\r\n');

  // O BOM UTF-8 garante a correta apresentação de acentos no Excel.
  const csvBlob = new Blob(
    ['\uFEFF', csvContent],
    {
      type: 'text/csv;charset=utf-8;',
    },
  );

  const downloadUrl = URL.createObjectURL(csvBlob);
  const downloadLink = document.createElement('a');

  const currentDate = new Date()
    .toISOString()
    .slice(0, 10);

  downloadLink.href = downloadUrl;
  downloadLink.download = `socios-${currentDate}.csv`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(downloadUrl);
}

  const columns = useMemo(
    () =>
      getMemberColumns({
        onEdit: handleEditMember,
        onDelete: handleDeleteMember,
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sócios"
        description="Consulta e gere os sócios registados no clube."
        action={
          <Button type="button" onClick={handleCreateMember}>
            <Plus className="size-4" />
            Novo sócio
          </Button>
        }
      />

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>Erro ao carregar sócios</AlertTitle>

          <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span>{errorMessage}</span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void fetchMembers()}
            >
              <RefreshCw className="size-4" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <MembersTableSkeleton />
      ) : (
        <>
<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={handleExportCsv}
    disabled={members.length === 0}
  >
    <Download className="size-4" />
    Exportar CSV
  </Button>

  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => void fetchMembers(true)}
    disabled={isRefreshing}
  >
    <RefreshCw
      className={
        isRefreshing
          ? 'size-4 animate-spin'
          : 'size-4'
      }
    />

    {isRefreshing ? 'A atualizar...' : 'Atualizar'}
  </Button>
</div>

          <DataTable
            columns={columns}
            data={members}
            searchPlaceholder="Pesquisar sócios..."
            emptyTitle="Ainda não existem sócios"
            emptyDescription="Os sócios registados no clube serão apresentados aqui."
            getSearchableText={(member) =>
              [
                member.membershipNumber,
                member.firstName,
                member.lastName,
                `${member.firstName} ${member.lastName}`,
                member.email,
                member.phone ?? '',
              ].join(' ')
            }
          />
        </>
      )}

      <MemberDialog
        open={memberDialogOpen}
        mode={memberDialogMode}
        member={selectedMember}
        onOpenChange={handleMemberDialogOpenChange}
        onSuccess={handleMemberSaved}
      />

      <DeleteMemberDialog
        open={deleteDialogOpen}
        member={selectedMember}
        onOpenChange={handleDeleteDialogOpenChange}
        onSuccess={handleMemberDeleted}
      />
    </div>
  );
}

function MembersTableSkeleton() {
  return (
    <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:max-w-md" />
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[140px_1fr_200px_120px_100px] gap-4 border-b bg-muted/50 px-4 py-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="ml-auto h-4 w-12" />
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[140px_1fr_200px_120px_100px] items-center gap-4 border-b px-4 py-4 last:border-b-0"
            >
              <Skeleton className="h-5 w-24" />

              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>

              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />

              <div className="flex justify-end gap-2">
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="size-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}