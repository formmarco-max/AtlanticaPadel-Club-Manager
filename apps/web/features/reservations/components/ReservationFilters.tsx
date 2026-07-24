'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import type { Member } from '@/types/member';

const portuguesePhoneRegex = /^\+351\d{9}$/;

const memberFormSchema = z.object({
  membershipNumber: z
    .string()
    .trim()
    .min(1, 'O número de sócio é obrigatório.')
    .max(30, 'O número de sócio não pode exceder 30 caracteres.'),

  firstName: z
    .string()
    .trim()
    .min(1, 'O primeiro nome é obrigatório.')
    .max(100, 'O primeiro nome não pode exceder 100 caracteres.'),

  lastName: z
    .string()
    .trim()
    .min(1, 'O apelido é obrigatório.')
    .max(100, 'O apelido não pode exceder 100 caracteres.'),

  email: z
    .string()
    .trim()
    .max(255)
    .refine(
      (value) =>
        value.length === 0 || z.email().safeParse(value).success,
      'Introduz um email válido.',
    ),

  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (value) =>
        value.length === 0 ||
        portuguesePhoneRegex.test(value.replace(/\s+/g, '')),
      'Utiliza o formato +351912345678.',
    ),

  birthDate: z.string(),

  joinDate: z.string(),

  notes: z.string(),

  isActive: z.boolean(),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ApiErrorResponse {
  message?: string | string[];
}

interface MemberPayload {
  membershipNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  joinDate?: string;
  notes?: string;
  isActive: boolean;
}

interface MemberFormProps {
  mode: 'create' | 'edit';
  member?: Member | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function getCurrentDate() {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 10);
}

function getDateInputValue(value?: string | null) {
  return value ? value.slice(0, 10) : '';
}

function getDefaultValues(
  mode: 'create' | 'edit',
  member?: Member | null,
): MemberFormValues {
  if (mode === 'edit' && member) {
    return {
      membershipNumber: member.membershipNumber,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email ?? '',
      phone: member.phone ?? '',
      birthDate: getDateInputValue(member.birthDate),
      joinDate: getDateInputValue(member.joinDate),
      notes: member.notes ?? '',
      isActive: member.isActive,
    };
  }

  return {
    membershipNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    joinDate: getCurrentDate(),
    notes: '',
    isActive: true,
  };
}

function optionalString(value: string) {
  const v = value.trim();
  return v.length ? v : undefined;
}

function buildPayload(values: MemberFormValues): MemberPayload {
  return {
    membershipNumber: values.membershipNumber.trim(),
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: optionalString(values.email),
    phone: optionalString(values.phone.replace(/\s+/g, '')),
    birthDate: optionalString(values.birthDate),
    joinDate: optionalString(values.joinDate),
    notes: optionalString(values.notes),
    isActive: values.isActive,
  };
}

function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return 'Ocorreu um erro inesperado.';
  }

  if (!error.response) {
    return 'Não foi possível contactar o servidor.';
  }

  const message = error.response.data?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  if (typeof message === 'string') {
    return message;
  }

  switch (error.response.status) {
    case 400:
      return 'Os dados introduzidos não são válidos.';

    case 404:
      return 'Sócio não encontrado.';

    case 409:
      return 'Já existe um sócio com estes dados.';

    default:
      return 'Não foi possível guardar o sócio.';
  }
}

export function MemberForm({
  mode,
  member,
  onSuccess,
  onCancel,
}: MemberFormProps) {
  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: getDefaultValues(mode, member),
  });

  useEffect(() => {
    reset(getDefaultValues(mode, member));
    setSubmitError(null);
  }, [mode, member, reset]);

  const isActive = watch('isActive');

  async function onSubmit(values: MemberFormValues) {
    try {
      setSubmitError(null);

      const payload = buildPayload(values);

      if (mode === 'create') {
        await api.post('/members', payload);
      } else {
        await api.patch(`/members/${member?.id}`, payload);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      setSubmitError(getApiErrorMessage(error));
    }
  }
   return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {submitError && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível guardar</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="membershipNumber">Número de sócio</Label>

          <Input
            id="membershipNumber"
            {...register('membershipNumber')}
            placeholder="SOC-000001"
            autoComplete="off"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.membershipNumber)}
          />

          {errors.membershipNumber && (
            <p className="text-sm text-destructive">
              {errors.membershipNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="joinDate">Data de inscrição</Label>

          <Input
            id="joinDate"
            type="date"
            {...register('joinDate')}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.joinDate)}
          />

          {errors.joinDate && (
            <p className="text-sm text-destructive">
              {errors.joinDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Primeiro nome</Label>

          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="João"
            autoComplete="given-name"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.firstName)}
          />

          {errors.firstName && (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apelido</Label>

          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Silva"
            autoComplete="family-name"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.lastName)}
          />

          {errors.lastName && (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="joao.silva@email.pt"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
          />

          {errors.email && (
            <p className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>

          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="+351912345678"
            autoComplete="tel"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.phone)}
          />

          <p className="text-sm text-muted-foreground">
            Utiliza o indicativo internacional +351.
          </p>

          {errors.phone && (
            <p className="text-sm text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de nascimento</Label>

          <Input
            id="birthDate"
            type="date"
            {...register('birthDate')}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.birthDate)}
          />

          {errors.birthDate && (
            <p className="text-sm text-destructive">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        <div className="flex min-h-20 items-center justify-between gap-4 rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="isActive">Estado do sócio</Label>

            <p className="text-sm text-muted-foreground">
              Sócios inativos permanecem no histórico do clube.
            </p>
          </div>

          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) =>
              setValue('isActive', checked, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={isSubmitting}
            aria-label="Alterar estado do sócio"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>

        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Informação adicional relevante sobre o sócio..."
          rows={4}
          disabled={isSubmitting}
          className="resize-y"
          aria-invalid={Boolean(errors.notes)}
        />

        <p className="text-sm text-muted-foreground">
          Informação interna visível apenas para utilizadores autorizados.
        </p>

        {errors.notes && (
          <p className="text-sm text-destructive">
            {errors.notes.message}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <LoaderCircle className="size-4 animate-spin" />
          )}

          {isSubmitting
            ? 'A guardar...'
            : mode === 'create'
              ? 'Criar sócio'
              : 'Guardar alterações'}
        </Button>
      </div>
    </form>
  );
} 