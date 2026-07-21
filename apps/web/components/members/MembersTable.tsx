'use client';

import { useMemo, useState } from 'react';
import { Pencil, Search, Trash2, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface MemberClub {
  id: string;
  name: string;
  slug: string;
}

export interface MemberUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Member {
  id: string;
  clubId: string;
  userId: string | null;
  membershipNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  joinDate: string;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  club: MemberClub;
  user: MemberUser | null;
}

interface MembersTableProps {
  members: Member[];
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function MembersTable({
  members,
  onEdit,
  onDelete,
}: MembersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    const normalizedSearchTerm = normalizeText(searchTerm);

    if (!normalizedSearchTerm) {
      return members;
    }

    return members.filter((member) => {
      const searchableValues = [
        member.membershipNumber,
        member.firstName,
        member.lastName,
        `${member.firstName} ${member.lastName}`,
        member.email,
        member.phone ?? '',
      ];

      return searchableValues.some((value) =>
        normalizeText(value).includes(normalizedSearchTerm),
      );
    });
  }, [members, searchTerm]);

  return (
    <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Pesquisar por nome, email ou número..."
            className="pl-9"
            aria-label="Pesquisar sócios"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredMembers.length}{' '}
          {filteredMembers.length === 1 ? 'sócio encontrado' : 'sócios encontrados'}
        </p>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Users className="size-6 text-muted-foreground" />
          </div>

          <h2 className="text-base font-semibold">
            {members.length === 0
              ? 'Ainda não existem sócios'
              : 'Nenhum sócio encontrado'}
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {members.length === 0
              ? 'Os sócios registados no clube serão apresentados nesta tabela.'
              : 'Tenta pesquisar utilizando outro nome, email, telefone ou número de sócio.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-muted/50">
              <tr className="border-b text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nº de sócio
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nome
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Telefone
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Estado
                </th>

                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => {
                const fullName =
                  `${member.firstName} ${member.lastName}`.trim();

                return (
                  <tr
                    key={member.id}
                    className="border-b transition-colors last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                      {member.membershipNumber}
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-medium">{fullName}</p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {member.club.name}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {member.email}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                      {member.phone || '—'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          member.isActive
                            ? 'inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'
                        }
                      >
                        {member.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit?.(member)}
                          disabled={!onEdit}
                          aria-label={`Editar ${fullName}`}
                          title="Editar sócio"
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete?.(member)}
                          disabled={!onDelete}
                          aria-label={`Eliminar ${fullName}`}
                          title="Eliminar sócio"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}