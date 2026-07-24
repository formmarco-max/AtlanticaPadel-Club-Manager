'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoaderCircle,
  UserRoundCog,
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
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import type {
  Coach,
  CoachPayload,
} from '@/types/coach';

const coachFormSchema = z.object({
  employeeNumber: z
    .string()
    .max(
      30,
      'O número interno não pode exceder 30 caracteres.',
    ),
  firstName: z
    .string()
    .trim()
    .min(2, 'O primeiro nome deve ter pelo menos 2 caracteres.')
    .max(100, 'O primeiro nome não pode exceder 100 caracteres.'),
  lastName: z
    .string()
    .trim()
    .min(2, 'O último nome deve ter pelo menos 2 caracteres.')
    .max(100, 'O último nome não pode exceder 100 caracteres.'),
  email: z
    .string()
    .trim()
    .refine(
      (value) =>
        value.length === 0 || z.string().email().safeParse(value).success,
      'Introduz um email válido.',
    )
    .refine(
      (value) => value.length <= 255,
      'O email não pode exceder 255 caracteres.',
    ),
  phone: z
    .string()
    .max(30, 'O telefone não pode exceder 30 caracteres.'),
  specialization: z
    .string()
    .max(
      150,
      'A especialização não pode exceder 150 caracteres.',
    ),
  biography: z
    .string()
    .max(
      2000,
      'A biografia não pode exceder 2000 caracteres.',
    ),
  hireDate: z.string(),
  isActive: z.boolean(),
});

type CoachFormValues = z.infer<typeof coachFormSchema>;

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CoachFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  coach: Coach | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (coach: Coach) => void;
}

const defaultValues: CoachFormValues = {
  employeeNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialization: '',
  biography: '',
  hireDate: '',
  isActive: true,
};

export function CoachFormDialog({
  open,
  mode,
  coach,
  onOpenChange,
  onSaved,
}: CoachFormDialogProps) {
  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const initialValues = useMemo<CoachFormValues>(() => {
    if (mode === 'edit' && coach) {
      return {
        employeeNumber: coach.employeeNumber ?? '',
        firstName: coach.firstName,
        lastName: coach.lastName,
        email: coach.email ?? '',
        phone: coach.phone ?? '',
        specialization: coach.specialization ?? '',
        biography: coach.biography ?? '',
        hireDate: toDateInputValue(coach.hireDate),
        isActive: coach.isActive,
      };
    }

    return defaultValues;
  }, [coach, mode]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!open) return;

    reset(initialValues);
    setSubmitError(null);
  }, [initialValues, open, reset]);

  const onSubmit: SubmitHandler<CoachFormValues> = async (
    values,
  ) => {
    try {
      setSubmitError(null);

      const payload: CoachPayload = {
        employeeNumber:
          values.employeeNumber.trim() || undefined,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        specialization:
          values.specialization.trim() || undefined,
        biography:
          values.biography.trim() || undefined,
        hireDate: values.hireDate || undefined,
        isActive: values.isActive,
      };

      const response =
        mode === 'create'
          ? await api.post<ApiResponse<Coach>>(
              '/coaches',
              payload,
            )
          : await api.patch<ApiResponse<Coach>>(
              `/coaches/${coach?.id}`,
              payload,
            );

      onSaved(response.data.data);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao guardar treinador:', error);
      setSubmitError(
        getApiErrorMessage(
          error,
          mode === 'create'
            ? 'Não foi possível criar o treinador.'
            : 'Não foi possível atualizar o treinador.',
        ),
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRoundCog className="size-5" />
          </div>
          <DialogTitle>
            {mode === 'create'
              ? 'Novo treinador'
              : 'Editar treinador'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Regista um novo treinador no clube.'
              : 'Atualiza os dados profissionais e os contactos do treinador.'}
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
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="coach-first-name">
                Primeiro nome
              </Label>
              <Input
                id="coach-first-name"
                autoComplete="given-name"
                placeholder="João"
                disabled={isSubmitting}
                {...register('firstName')}
              />
              <FieldError
                message={errors.firstName?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coach-last-name">
                Último nome
              </Label>
              <Input
                id="coach-last-name"
                autoComplete="family-name"
                placeholder="Silva"
                disabled={isSubmitting}
                {...register('lastName')}
              />
              <FieldError
                message={errors.lastName?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coach-employee-number">
                Número interno
              </Label>
              <Input
                id="coach-employee-number"
                placeholder="TR0001"
                disabled={isSubmitting}
                {...register('employeeNumber')}
              />
              <FieldError
                message={errors.employeeNumber?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coach-specialization">
                Especialização
              </Label>
              <Input
                id="coach-specialization"
                placeholder="Treinador Nível II"
                disabled={isSubmitting}
                {...register('specialization')}
              />
              <FieldError
                message={errors.specialization?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coach-email">
                Email
              </Label>
              <Input
                id="coach-email"
                type="email"
                autoComplete="email"
                placeholder="joao.silva@apcm.pt"
                disabled={isSubmitting}
                {...register('email')}
              />
              <FieldError
                message={errors.email?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coach-phone">
                Telefone
              </Label>
              <Input
                id="coach-phone"
                type="tel"
                autoComplete="tel"
                placeholder="912345678"
                disabled={isSubmitting}
                {...register('phone')}
              />
              <FieldError
                message={errors.phone?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coach-hire-date">
                Data de contratação
              </Label>
              <Input
                id="coach-hire-date"
                type="date"
                disabled={isSubmitting}
                {...register('hireDate')}
              />
              <FieldError
                message={errors.hireDate?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coach-status">
                Estado
              </Label>
              <select
                id="coach-status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                {...register('isActive', {
                  setValueAs: (value) => value === 'true',
                })}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
              <FieldError
                message={errors.isActive?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coach-biography">
              Biografia
            </Label>
            <Textarea
              id="coach-biography"
              rows={5}
              placeholder="Experiência, certificações e informação profissional relevante."
              className="resize-y"
              disabled={isSubmitting}
              {...register('biography')}
            />
            <div className="flex items-start justify-between gap-4">
              <FieldError
                message={errors.biography?.message}
              />
              <p className="ml-auto text-xs text-muted-foreground">
                Máximo de 2000 caracteres
              </p>
            </div>
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
                  ? 'Criar treinador'
                  : 'Guardar alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldError({
  message,
}: {
  message?: string;
}) {
  return message ? (
    <p className="text-sm text-destructive">
      {message}
    </p>
  ) : null;
}

function toDateInputValue(
  value: string | null,
) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toISOString().slice(0, 10);
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
