'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarClock, LoaderCircle } from 'lucide-react';
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
import type { Court } from '@/types/court';
import type { Member } from '@/types/member';
import type {
  Reservation,
  ReservationPayload,
  ReservationStatus,
} from '@/types/reservation';

const reservationFormSchema = z
  .object({
    memberId: z.string().min(1, 'Seleciona um sócio.'),
    courtId: z.string().min(1, 'Seleciona um campo.'),
    startTime: z.string().min(1, 'Indica a data e hora de início.'),
    endTime: z.string().min(1, 'Indica a data e hora de fim.'),
    status: z.enum([
      'PENDING',
      'CONFIRMED',
      'CANCELLED',
      'COMPLETED',
      'NO_SHOW',
    ]),
    totalPrice: z
      .string()
      .refine((value) => {
        if (value.trim() === '') return true;
        const parsedValue = Number(value.replace(',', '.'));
        return Number.isFinite(parsedValue) && parsedValue > 0;
      }, 'Introduz um preço superior a zero.'),
    notes: z
      .string()
      .max(1000, 'As observações não podem exceder 1000 caracteres.'),
  })
  .refine(
    (values) =>
      !values.startTime ||
      !values.endTime ||
      new Date(values.endTime).getTime() >
        new Date(values.startTime).getTime(),
    {
      path: ['endTime'],
      message: 'A hora de fim deve ser posterior à hora de início.',
    },
  );

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ReservationFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  reservation: Reservation | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (reservation: Reservation) => void;
}

const defaultValues: ReservationFormValues = {
  memberId: '',
  courtId: '',
  startTime: '',
  endTime: '',
  status: 'CONFIRMED',
  totalPrice: '',
  notes: '',
};

export function ReservationFormDialog({
  open,
  mode,
  reservation,
  onOpenChange,
  onSaved,
}: ReservationFormDialogProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues = useMemo<ReservationFormValues>(() => {
    if (mode === 'edit' && reservation) {
      return {
        memberId: reservation.memberId,
        courtId: reservation.courtId,
        startTime: toDateTimeLocalValue(reservation.startTime),
        endTime: toDateTimeLocalValue(reservation.endTime),
        status: reservation.status,
        totalPrice:
          reservation.totalPrice !== null
            ? String(reservation.totalPrice)
            : '',
        notes: reservation.notes ?? '',
      };
    }

    return defaultValues;
  }, [mode, reservation]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: initialValues,
  });

  const selectedCourtId = watch('courtId');
  const startTime = watch('startTime');

  useEffect(() => {
    if (!open) return;

    reset(initialValues);
    setSubmitError(null);

    async function loadOptions() {
      try {
        setIsLoadingOptions(true);
        const [membersResponse, courtsResponse] = await Promise.all([
          api.get<ApiResponse<Member[]>>('/members'),
          api.get<ApiResponse<Court[]>>('/courts'),
        ]);

        setMembers(membersResponse.data.data);
        setCourts(courtsResponse.data.data);
      } catch (error) {
        console.error('Erro ao carregar dados da reserva:', error);
        setSubmitError(
          'Não foi possível carregar os sócios e os campos disponíveis.',
        );
      } finally {
        setIsLoadingOptions(false);
      }
    }

    void loadOptions();
  }, [initialValues, open, reset]);

  useEffect(() => {
    if (mode !== 'create' || !selectedCourtId || !startTime) return;

    const selectedCourt = courts.find(
      (court) => court.id === selectedCourtId,
    );

    if (!selectedCourt) return;

    const startDate = new Date(startTime);
    if (Number.isNaN(startDate.getTime())) return;

    const endDate = new Date(
      startDate.getTime() +
        selectedCourt.defaultReservationDuration * 60_000,
    );

    setValue('endTime', toDateTimeLocalValue(endDate.toISOString()), {
      shouldValidate: true,
    });
  }, [courts, mode, selectedCourtId, setValue, startTime]);

  const onSubmit: SubmitHandler<ReservationFormValues> = async (values) => {
    try {
      setSubmitError(null);

      const normalizedPrice = values.totalPrice.trim().replace(',', '.');

      const payload: ReservationPayload = {
        courtId: values.courtId,
        memberId: values.memberId,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        status: values.status as ReservationStatus,
        totalPrice:
          normalizedPrice.length > 0
            ? Number(normalizedPrice)
            : undefined,
        notes: values.notes.trim() || undefined,
      };

      const response =
        mode === 'create'
          ? await api.post<ApiResponse<Reservation>>(
              '/reservations',
              payload,
            )
          : await api.patch<ApiResponse<Reservation>>(
              `/reservations/${reservation?.id}`,
              payload,
            );

      onSaved(response.data.data);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao guardar reserva:', error);
      setSubmitError(
        getApiErrorMessage(
          error,
          mode === 'create'
            ? 'Não foi possível criar a reserva.'
            : 'Não foi possível atualizar a reserva.',
        ),
      );
    }
  };

  const availableMembers = members.filter(
    (member) =>
      member.isActive || member.id === reservation?.memberId,
  );

  const availableCourts = courts.filter(
    (court) =>
      (court.isActive && !court.isUnderMaintenance) ||
      court.id === reservation?.courtId,
  );

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
            <CalendarClock className="size-5" />
          </div>
          <DialogTitle>
            {mode === 'create' ? 'Nova reserva' : 'Editar reserva'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Agenda um campo para um sócio do clube.'
              : 'Atualiza os dados e o estado da reserva.'}
          </DialogDescription>
        </DialogHeader>

        {submitError ? (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reservation-member">Sócio</Label>
              <select
                id="reservation-member"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting || isLoadingOptions}
                {...register('memberId')}
              >
                <option value="">Selecionar sócio</option>
                {availableMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName} · {member.membershipNumber}
                  </option>
                ))}
              </select>
              <FieldError message={errors.memberId?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation-court">Campo</Label>
              <select
                id="reservation-court"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting || isLoadingOptions}
                {...register('courtId')}
              >
                <option value="">Selecionar campo</option>
                {availableCourts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                    {court.location ? ` · ${court.location}` : ''}
                  </option>
                ))}
              </select>
              <FieldError message={errors.courtId?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation-start">Início</Label>
              <Input
                id="reservation-start"
                type="datetime-local"
                disabled={isSubmitting}
                {...register('startTime')}
              />
              <FieldError message={errors.startTime?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation-end">Fim</Label>
              <Input
                id="reservation-end"
                type="datetime-local"
                disabled={isSubmitting}
                {...register('endTime')}
              />
              <FieldError message={errors.endTime?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation-status">Estado</Label>
              <select
                id="reservation-status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                {...register('status')}
              >
                <option value="CONFIRMED">Confirmada</option>
                <option value="PENDING">Pendente</option>
                {mode === 'edit' ? (
                  <>
                    <option value="COMPLETED">Concluída</option>
                    <option value="CANCELLED">Cancelada</option>
                    <option value="NO_SHOW">Falta de comparência</option>
                  </>
                ) : null}
              </select>
              <FieldError message={errors.status?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation-price">Preço total</Label>
              <div className="relative">
                <Input
                  id="reservation-price"
                  inputMode="decimal"
                  placeholder="Calculado automaticamente"
                  className="pr-10"
                  disabled={isSubmitting}
                  {...register('totalPrice')}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Deixa em branco para usar o preço do campo.
              </p>
              <FieldError message={errors.totalPrice?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reservation-notes">Observações</Label>
            <Textarea
              id="reservation-notes"
              rows={3}
              placeholder="Informação adicional sobre a reserva."
              className="resize-y"
              disabled={isSubmitting}
              {...register('notes')}
            />
            <FieldError message={errors.notes?.message} />
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
              disabled={isSubmitting || isLoadingOptions}
            >
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : null}
              {isSubmitting
                ? 'A guardar...'
                : mode === 'create'
                  ? 'Criar reserva'
                  : 'Guardar alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="text-sm text-destructive">{message}</p>
  ) : null;
}

function toDateTimeLocalValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 16);
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError(error)) return fallbackMessage;
  const responseMessage = error.response?.data?.message;
  if (Array.isArray(responseMessage)) return responseMessage.join(' ');
  if (typeof responseMessage === 'string') return responseMessage;
  return fallbackMessage;
}
