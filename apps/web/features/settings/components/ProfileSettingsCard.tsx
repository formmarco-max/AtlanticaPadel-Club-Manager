'use client';

import {
  type ChangeEvent,
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import {
  Camera,
  LoaderCircle,
  Save,
  Trash2,
  UserRound,
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
  MyProfile,
  UpdateMyProfilePayload,
} from '@/types/settings';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

interface ProfileSettingsCardProps {
  profile: MyProfile;
  onProfileChanged: (profile: MyProfile) => void;
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

function getInitials(
  firstName: string,
  lastName: string,
): string {
  return `${firstName.trim().charAt(0)}${lastName
    .trim()
    .charAt(0)}`.toUpperCase();
}

function getApiOrigin(): string {
  const baseUrl = api.defaults.baseURL ?? 'http://localhost:3001/api/v1';

  try {
    return new URL(baseUrl).origin;
  } catch {
    return 'http://localhost:3001';
  }
}

function resolveAvatarUrl(avatarUrl: string | null): string | null {
  if (!avatarUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(avatarUrl)) {
    return avatarUrl;
  }

  return `${getApiOrigin()}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
}

export function ProfileSettingsCard({
  profile,
  onProfileChanged,
}: ProfileSettingsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const avatarSrc = useMemo(
    () => resolveAvatarUrl(profile.avatarUrl),
    [profile.avatarUrl],
  );

  const versionedAvatarSrc = useMemo(() => {
    if (!avatarSrc) {
      return null;
    }

    const separator = avatarSrc.includes('?') ? '&' : '?';

    return `${avatarSrc}${separator}v=${avatarVersion}`;
  }, [avatarSrc, avatarVersion]);

  const initials = useMemo(
    () => getInitials(profile.firstName, profile.lastName),
    [profile.firstName, profile.lastName],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();

    if (!normalizedFirstName || !normalizedLastName) {
      setErrorMessage('O primeiro nome e o apelido são obrigatórios.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const payload: UpdateMyProfilePayload = {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
      };

      const response = await api.patch<
        MyProfile | ApiEnvelope<MyProfile>
      >('/users/me', payload);

      const updatedProfile = unwrapResponse(response.data);

      onProfileChanged(updatedProfile);
      setFirstName(updatedProfile.firstName);
      setLastName(updatedProfile.lastName);
      setSuccessMessage('Perfil atualizado com sucesso.');

      window.dispatchEvent(
        new CustomEvent('auth:user-updated', {
          detail: updatedProfile,
        }),
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          'Não foi possível atualizar o perfil.',
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarSelected(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        'Seleciona uma imagem JPG, PNG ou WebP.',
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        'A imagem não pode exceder 5 MB.',
      );
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post<
        MyProfile | ApiEnvelope<MyProfile>
      >('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedProfile = unwrapResponse(response.data);

      onProfileChanged(updatedProfile);
      setAvatarVersion((current) => current + 1);
      setSuccessMessage('Fotografia atualizada com sucesso.');

      window.dispatchEvent(
        new CustomEvent('auth:user-updated', {
          detail: updatedProfile,
        }),
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          'Não foi possível atualizar a fotografia.',
        ),
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    try {
      setIsRemovingAvatar(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await api.delete('/users/me/avatar');

      const updatedProfile: MyProfile = {
        ...profile,
        avatarUrl: null,
      };

      onProfileChanged(updatedProfile);
      setAvatarVersion((current) => current + 1);
      setSuccessMessage('Fotografia removida com sucesso.');

      window.dispatchEvent(
        new CustomEvent('auth:user-updated', {
          detail: updatedProfile,
        }),
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          'Não foi possível remover a fotografia.',
        ),
      );
    } finally {
      setIsRemovingAvatar(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu perfil</CardTitle>
        <CardDescription>
          Atualiza os teus dados pessoais e a fotografia apresentada na
          plataforma.
        </CardDescription>
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

          <div className="flex flex-col gap-5 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center">
            <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-background">
              {versionedAvatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={versionedAvatarSrc}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="size-full object-cover"
                />
              ) : initials ? (
                <span className="text-2xl font-semibold">
                  {initials}
                </span>
              ) : (
                <UserRound className="size-10 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {profile.email}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarSelected}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar || isRemovingAvatar}
                >
                  {isUploadingAvatar ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Camera className="size-4" />
                  )}
                  Alterar fotografia
                </Button>

                {profile.avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar || isRemovingAvatar}
                  >
                    {isRemovingAvatar ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    Remover
                  </Button>
                )}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Formatos aceites: JPG, PNG ou WebP. Máximo: 5 MB.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-first-name">
                Primeiro nome
              </Label>
              <Input
                id="settings-first-name"
                value={firstName}
                maxLength={100}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-last-name">
                Apelido
              </Label>
              <Input
                id="settings-last-name"
                value={lastName}
                maxLength={100}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                disabled={isSaving}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input
              id="settings-email"
              type="email"
              value={profile.email}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              O endereço de email não pode ser alterado nesta página.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Guardar alterações
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}