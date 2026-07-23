'use client';

import { useState } from 'react';
import axios from 'axios';
import { LoaderCircle, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/lib/api';
import type { Member } from '@/types/member';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface DeleteMemberDialogProps {
  open: boolean;
  member: Member | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: (member: Member) => void;
}

function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return 'Ocorreu um erro inesperado. Tenta novamente.';
  }

  if (!error.response) {
    return 'Não foi possível contactar o servidor. Verifica a ligação e tenta novamente.';
  }

  const responseMessage = error.response.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' ');
  }

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  if (error.response.status === 404) {
    return 'O sócio já não existe ou não está disponível.';
  }

  if (error.response.status === 409) {
    return 'Não é possível eliminar este sócio porque existem registos associados.';
  }

  return 'Não foi possível eliminar o sócio. Tenta novamente.';
}

export function DeleteMemberDialog({
  open,
  member,
  onOpenChange,
  onSuccess,
}: DeleteMemberDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fullName = member
    ? `${member.firstName} ${member.lastName}`.trim()
    : '';

  function handleOpenChange(nextOpen: boolean) {
    if (isDeleting) {
      return;
    }

    if (!nextOpen) {
      setDeleteError(null);
    }

    onOpenChange(nextOpen);
  }

  async function handleDelete() {
    if (!member) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await api.delete(`/members/${member.id}`);

      onSuccess(member);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao eliminar sócio:', error);
      setDeleteError(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </div>

            <div className="space-y-1">
              <AlertDialogTitle>Eliminar sócio</AlertDialogTitle>

              <AlertDialogDescription>
                Esta ação irá eliminar permanentemente o sócio{' '}
                <span className="font-semibold text-foreground">
                  {fullName}
                </span>
                {member?.membershipNumber
                  ? ` (${member.membershipNumber})`
                  : ''}
                .
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <p className="text-sm text-muted-foreground">
          Esta operação não pode ser anulada. Confirma que pretendes continuar.
        </p>

        {deleteError && (
          <Alert variant="destructive">
            <AlertTitle>Não foi possível eliminar</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            disabled={isDeleting || !member}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && (
              <LoaderCircle className="size-4 animate-spin" />
            )}

            {isDeleting ? 'A eliminar...' : 'Eliminar sócio'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}