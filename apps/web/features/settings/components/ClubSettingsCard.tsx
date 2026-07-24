'use client';

import { FormEvent, useState } from 'react';
import axios from 'axios';
import {
  Building2,
  LoaderCircle,
  Save,
} from 'lucide-react';

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import type {
  ApiEnvelope,
  ClubSettings,
  UpdateClubPayload,
} from '@/types/settings';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface ClubSettingsCardProps {
  club: ClubSettings;
  onClubChanged: (club: ClubSettings) => void;
}

function unwrapResponse<T>(value: T | ApiEnvelope<T>): T {
  if (
    typeof value === 'object' &&
    value !== null &&
    'data' in value
  ) {
    return (value as ApiEnvelope<T>).data;
  }

  return value as T;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  return message ?? error.response?.data?.error ?? fallback;
}

export function ClubSettingsCard({
  club,
  onClubChanged,
}: ClubSettingsCardProps) {
  const [name, setName] = useState(club.name);
  const [slug, setSlug] = useState(club.slug);
  const [email, setEmail] = useState(club.email ?? '');
  const [phone, setPhone] = useState(club.phone ?? '');
  const [address, setAddress] = useState(club.address ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedSlug = slug.trim();

    if (!normalizedName || !normalizedSlug) {
      setErrorMessage('O nome e o identificador do clube são obrigatórios.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const payload: UpdateClubPayload = {
        name: normalizedName,
        slug: normalizedSlug,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      };

      const response = await api.patch<
        ClubSettings | ApiEnvelope<ClubSettings>
      >(`/clubs/${club.id}`, payload);

      const updatedClub = unwrapResponse(response.data);

      onClubChanged(updatedClub);
      setName(updatedClub.name);
      setSlug(updatedClub.slug);
      setEmail(updatedClub.email ?? '');
      setPhone(updatedClub.phone ?? '');
      setAddress(updatedClub.address ?? '');
      setSuccessMessage('Dados do clube atualizados com sucesso.');
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          'Não foi possível atualizar os dados do clube.',
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>

          <div>
            <CardTitle>Clube</CardTitle>
            <CardDescription className="mt-1">
              Atualiza os dados institucionais do clube.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {(errorMessage || successMessage) && (
            <Alert variant={errorMessage ? 'destructive' : 'default'}>
              <AlertDescription>
                {errorMessage ?? successMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="club-name">Nome</Label>
              <Input
                id="club-name"
                value={name}
                maxLength={150}
                onChange={(event) => setName(event.target.value)}
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-slug">
                Identificador
              </Label>
              <Input
                id="club-slug"
                value={slug}
                maxLength={100}
                onChange={(event) => setSlug(event.target.value)}
                disabled={isSaving}
                required
              />
              <p className="text-xs text-muted-foreground">
                Exemplo: atlantica-padel-club
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-email">Email</Label>
              <Input
                id="club-email"
                type="email"
                value={email}
                maxLength={255}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-phone">Telefone</Label>
              <Input
                id="club-phone"
                value={phone}
                maxLength={30}
                onChange={(event) => setPhone(event.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="club-address">Morada</Label>
            <Input
              id="club-address"
              value={address}
              maxLength={255}
              onChange={(event) => setAddress(event.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Guardar clube
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
