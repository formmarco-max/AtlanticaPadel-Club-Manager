'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Mail, Pencil, Phone, Trash2 } from 'lucide-react';

import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Member } from '@/types/member';

interface GetMemberColumnsParams {
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

function formatPhoneNumber(phone: string | null): string {
  if (!phone) {
    return 'Sem telefone';
  }

  const normalizedPhone = phone.replace(/\s+/g, '');

  const portuguesePhoneMatch = normalizedPhone.match(
    /^(\+351)(\d{3})(\d{3})(\d{3})$/,
  );

  if (portuguesePhoneMatch) {
    const [, countryCode, firstGroup, secondGroup, thirdGroup] =
      portuguesePhoneMatch;

    return `${countryCode} ${firstGroup} ${secondGroup} ${thirdGroup}`;
  }

  return phone;
}

/**
 * Obtém as iniciais do primeiro nome e do apelido.
 *
 * Exemplos:
 * António Almeida -> AA
 * Marco Oliveira -> MO
 */
function getMemberInitials(
  firstName: string,
  lastName: string,
): string {
  const firstInitial = firstName.trim().charAt(0);
  const lastInitial = lastName.trim().charAt(0);

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function getMemberColumns({
  onEdit,
  onDelete,
}: GetMemberColumnsParams): ColumnDef<Member>[] {
  return [
    {
      accessorKey: 'membershipNumber',
      header: 'N.º de sócio',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-semibold">
          {row.original.membershipNumber}
        </span>
      ),
    },
    {
      id: 'member',
      accessorFn: (member) =>
        `${member.firstName} ${member.lastName} ${member.email ?? ''}`,
      header: 'Sócio',
      cell: ({ row }) => {
        const member = row.original;

        const fullName =
          `${member.firstName} ${member.lastName}`.trim();

        const initials = getMemberInitials(
          member.firstName,
          member.lastName,
        );

        return (
          <div className="min-w-64">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {fullName}
                </p>

                {member.email ? (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="size-3.5 shrink-0" />

                    <a
                      href={`mailto:${member.email}`}
                      className="truncate transition-colors hover:text-foreground hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sem email
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ row }) => {
        const phone = row.original.phone;
        const formattedPhone = formatPhoneNumber(phone);

        return (
          <div className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
            <Phone className="size-4 shrink-0" />

            {phone ? (
              <a
                href={`tel:${phone}`}
                className="transition-colors hover:text-foreground hover:underline"
              >
                {formattedPhone}
              </a>
            ) : (
              <span>{formattedPhone}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => (
        <StatusBadge active={row.original.isActive} />
      ),
      sortingFn: (rowA, rowB) =>
        Number(rowA.original.isActive) -
        Number(rowB.original.isActive),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: 'Ações',
      cell: ({ row }) => {
        const member = row.original;

        const fullName =
          `${member.firstName} ${member.lastName}`.trim();

        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex justify-end gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(member)}
                      aria-label={`Editar ${fullName}`}
                      className="size-9"
                    />
                  }
                >
                  <Pencil className="size-4" />
                </TooltipTrigger>

                <TooltipContent>
                  <p>Editar sócio</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(member)}
                      aria-label={`Eliminar ${fullName}`}
                      className="size-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    />
                  }
                >
                  <Trash2 className="size-4" />
                </TooltipTrigger>

                <TooltipContent>
                  <p>Eliminar sócio</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];
}