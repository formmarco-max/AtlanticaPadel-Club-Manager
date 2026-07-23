'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoaderCircle,
  MapPinned,
} from 'lucide-react';
import {
  useForm,
  type SubmitHandler,
} from 'react-hook-form';
import { z } from 'zod';

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import type {
  Court,
  CourtEnvironment,
  CourtPayload,
  CourtSurfaceType,
  CourtType,
} from '@/types/court';

const courtFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome do campo é obrigatório.')
    .max(
      100,
      'O nome do campo não pode exceder 100 caracteres.',
    ),

  description: z
    .string()
    .max(
      1000,
      'A descrição não pode exceder 1000 caracteres.',
    ),

  location: z
    .string()
    .max(
      150,
      'A localização não pode exceder 150 caracteres.',
    ),

  surfaceType: z.enum([
    'ARTIFICIAL_GRASS',
    'CONCRETE',
    'SYNTHETIC',
    'OTHER',
  ]),

  courtType: z.enum([
    'SINGLES',
    'DOUBLES',
  ]),

  environment: z.enum([
    'INDOOR',
    'OUTDOOR',
  ]),

  hourlyPrice: z
    .string()
    .refine(
      (value) => {
        if (value.trim() === '') {
          return true;
        }

        const parsedValue = Number(value);

        return (
          Number.isFinite(parsedValue) &&
          parsedValue > 0 &&
          /^\d+([.,]\d{1,2})?$/.test(value.trim())
        );
      },
      'Introduz um preço superior a zero, com até duas casas decimais.',
    ),

  isActive: z.boolean(),
});

type CourtFormValues = z.infer<
  typeof courtFormSchema
>;

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CourtFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  court: Court | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (court: Court) => void;
}

const defaultValues: CourtFormValues = {
  name: '',
  description: '',
  location: '',
  surfaceType: 'ARTIFICIAL_GRASS',
  courtType: 'DOUBLES',
  environment: 'INDOOR',
  hourlyPrice: '',
  isActive: true,
};

export function CourtFormDialog({
  open,
  mode,
  court,
  onOpenChange,
  onSaved,
}: CourtFormDialogProps) {
  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const initialValues = useMemo<CourtFormValues>(() => {
    if (mode === 'edit' && court) {
      return {
        name: court.name,
        description: court.description ?? '',
        location: court.location ?? '',
        surfaceType: court.surfaceType,
        courtType: court.courtType,
        environment: court.environment,
        hourlyPrice:
          court.hourlyPrice !== null
            ? String(court.hourlyPrice)
            : '',
        isActive: court.isActive,
      };
    }

    return defaultValues;
  }, [court, mode]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CourtFormValues>({
    resolver: zodResolver(courtFormSchema),
    defaultValues: initialValues,
  });

  const isActive = watch('isActive');

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(initialValues);
    setSubmitError(null);
  }, [initialValues, open, reset]);

  const onSubmit: SubmitHandler<CourtFormValues> = async (
    values,
  ) => {
    try {
      setSubmitError(null);

      const normalizedPrice = values.hourlyPrice
        .trim()
        .replace(',', '.');

      const payload: CourtPayload = {
        name: values.name.trim(),

        description:
          values.description.trim() || undefined,

        location:
          values.location.trim() || undefined,

        surfaceType:
          values.surfaceType as CourtSurfaceType,

        courtType:
          values.courtType as CourtType,

        environment:
          values.environment as CourtEnvironment,

        hourlyPrice:
          normalizedPrice.length > 0
            ? Number(normalizedPrice)
            : undefined,

        isActive: values.isActive,
      };

      const response =
        mode === 'create'
          ? await api.post<ApiResponse<Court>>(
              '/courts',
              payload,
            )
          : await api.patch<ApiResponse<Court>>(
              `/courts/${court?.id}`,
              payload,
            );

      onSaved(response.data.data);
      onOpenChange(false);
    } catch (error) {
      console.error(
        'Erro ao guardar campo:',
        error,
      );

      setSubmitError(
        getApiErrorMessage(
          error,
          mode === 'create'
            ? 'Não foi possível criar o campo.'
            : 'Não foi possível atualizar o campo.',
        ),
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapPinned className="size-5" />
          </div>

          <DialogTitle>
            {mode === 'create'
              ? 'Novo campo'
              : 'Editar campo'}
          </DialogTitle>

          <DialogDescription>
            {mode === 'create'
              ? 'Regista um novo campo no clube.'
              : `Atualiza a configuração de ${court?.name ?? 'campo'}.`}
          </DialogDescription>
        </DialogHeader>

        {submitError ? (
          <Alert variant="destructive">
            <AlertDescription>
              {submitError}
            </AlertDescription>
          </Alert>
        ) : null}

        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="court-name">
              Nome
            </Label>

            <Input
              id="court-name"
              placeholder="Ex.: Campo Central"
              disabled={isSubmitting}
              {...register('name')}
            />

            <FieldError
              message={errors.name?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="court-location">
              Localização
            </Label>

            <Input
              id="court-location"
              placeholder="Ex.: Pavilhão principal"
              disabled={isSubmitting}
              {...register('location')}
            />

            <FieldError
              message={errors.location?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="court-description">
              Descrição
            </Label>

            <Textarea
              id="court-description"
              rows={3}
              placeholder="Informação adicional sobre o campo."
              className="resize-y"
              disabled={isSubmitting}
              {...register('description')}
            />

            <FieldError
              message={errors.description?.message}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="court-surface">
                Superfície
              </Label>

              <select
                id="court-surface"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                {...register('surfaceType')}
              >
                <option value="ARTIFICIAL_GRASS">
                  Relva artificial
                </option>

                <option value="SYNTHETIC">
                  Piso sintético
                </option>

                <option value="CONCRETE">
                  Betão
                </option>

                <option value="OTHER">
                  Outro
                </option>
              </select>

              <FieldError
                message={errors.surfaceType?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="court-type">
                Tipo de campo
              </Label>

              <select
                id="court-type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                {...register('courtType')}
              >
                <option value="DOUBLES">
                  Pares
                </option>

                <option value="SINGLES">
                  Singulares
                </option>
              </select>

              <FieldError
                message={errors.courtType?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="court-environment">
                Ambiente
              </Label>

              <select
                id="court-environment"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                {...register('environment')}
              >
                <option value="INDOOR">
                  Indoor
                </option>

                <option value="OUTDOOR">
                  Outdoor
                </option>
              </select>

              <FieldError
                message={errors.environment?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="court-price">
                Preço por hora
              </Label>

              <div className="relative">
                <Input
                  id="court-price"
                  inputMode="decimal"
                  placeholder="25,00"
                  className="pr-12"
                  disabled={isSubmitting}
                  {...register('hourlyPrice')}
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
              </div>

              <FieldError
                message={errors.hourlyPrice?.message}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-5 rounded-xl border bg-muted/25 p-4">
            <div>
              <Label htmlFor="court-active">
                Campo ativo
              </Label>

              <p className="mt-1 text-sm text-muted-foreground">
                Campos inativos não devem ficar disponíveis para novas reservas.
              </p>
            </div>

            <Switch
              id="court-active"
              checked={isActive}
              onCheckedChange={(checked) => {
                setValue(
                  'isActive',
                  checked,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                );
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : null}

              {isSubmitting
                ? 'A guardar...'
                : mode === 'create'
                  ? 'Criar campo'
                  : 'Guardar alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface FieldErrorProps {
  message?: string;
}

function FieldError({
  message,
}: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm text-destructive">
      {message}
    </p>
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