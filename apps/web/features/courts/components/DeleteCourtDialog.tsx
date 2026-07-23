'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LoaderCircle,
  Trash2,
  TriangleAlert,
} from 'lucide-react';

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import type { Court } from '@/types/court';

interface DeleteCourtDialogProps {
  court: Court | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (courtId: string) => void;
}

export function DeleteCourtDialog({
  court,
  open,
  onOpenChange,
  onDeleted,
}: DeleteCourtDialogProps) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIsDeleting(false);
    }
  }, [open]);

  async function handleDelete() {
    if (!court) {
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage(null);

      await api.delete(
        `/courts/${court.id}`,
      );

      onDeleted(court.id);
      onOpenChange(false);
    } catch (error) {
      console.error(
        'Erro ao eliminar campo:',
        error,
      );

      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível eliminar o campo.',
        ),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" />
          </div>

          <DialogTitle>
            Eliminar campo
          </DialogTitle>

          <DialogDescription>
            Esta ação elimina permanentemente o campo e não pode ser anulada.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            Campo selecionado
          </p>

          <p className="mt-1 font-semibold">
            {court?.name}
          </p>

          {court?.location ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {court.location}
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void handleDelete()}
          >
            {isDeleting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}

            {isDeleting
              ? 'A eliminar...'
              : 'Eliminar campo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const responseMessage =
    error.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' ');
  }

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  return fallbackMessage;
}