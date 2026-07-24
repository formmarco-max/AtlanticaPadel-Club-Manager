'use client';

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import {
  CheckCircle2,
  CloudUpload,
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
import { cn } from '@/lib/utils';
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

const allowedAvatarTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

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

function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  return message ?? error.response?.data?.error ?? fallback;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.trim().charAt(0)}${lastName
    .trim()
    .charAt(0)}`.toUpperCase();
}

function getApiOrigin(): string {
  const baseUrl =
    api.defaults.baseURL ?? 'http://localhost:3001/api/v1';

  try {
    return new URL(baseUrl).origin;
  } catch {
    return 'http://localhost:3001';
  }
}

function resolveAvatarUrl(
  avatarUrl: string | null,
): string | null {
  if (!avatarUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(avatarUrl)) {
    return avatarUrl;
  }

  return `${getApiOrigin()}${
    avatarUrl.startsWith('/') ? '' : '/'
  }${avatarUrl}`;
}

export function ProfileSettingsCard({
  profile,
  onProfileChanged,
}: ProfileSettingsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] =
    useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] =
    useState(false);
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
    setPhone(profile.phone ?? '');
  }, [profile]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const avatarSrc = useMemo(() => {
    if (avatarPreview) {
      return avatarPreview;
    }

    const resolved = resolveAvatarUrl(profile.avatarUrl);

    if (!resolved) {
      return null;
    }

    const separator = resolved.includes('?') ? '&' : '?';
    return `${resolved}${separator}v=${avatarVersion}`;
  }, [avatarPreview, avatarVersion, profile.avatarUrl]);

  const initials = useMemo(
    () => getInitials(profile.firstName, profile.lastName),
    [profile.firstName, profile.lastName],
  );

  const hasChanges =
    firstName.trim() !== profile.firstName ||
    lastName.trim() !== profile.lastName ||
    email.trim().toLowerCase() !== profile.email.toLowerCase() ||
    phone.trim() !== (profile.phone ?? '');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (
      !normalizedFirstName ||
      !normalizedLastName ||
      !normalizedEmail
    ) {
      setErrorMessage(
        'O primeiro nome, o apelido e o email são obrigatórios.',
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const payload: UpdateMyProfilePayload = {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        phone: normalizedPhone || undefined,
      };

      const response = await api.patch<
        MyProfile | ApiEnvelope<MyProfile>
      >('/users/me', payload);

      const updatedProfile = unwrapResponse(response.data);

      onProfileChanged(updatedProfile);
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

  function validateAvatar(file: File): string | null {
    if (!allowedAvatarTypes.includes(file.type)) {
      return 'Seleciona uma imagem JPG, PNG ou WebP.';
    }

    if (file.size > 5 * 1024 * 1024) {
      return 'A imagem não pode exceder 5 MB.';
    }

    return null;
  }

  async function uploadAvatar(file: File) {
    const validationError = validateAvatar(file);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return previewUrl;
    });

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
      setAvatarPreview((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
      setIsUploadingAvatar(false);
    }
  }

  async function handleAvatarSelected(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (file) {
      await uploadAvatar(file);
    }
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      await uploadAvatar(file);
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
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle>Meu perfil</CardTitle>
        <CardDescription>
          Atualiza os teus dados pessoais e a fotografia apresentada
          na plataforma.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {(errorMessage || successMessage) && (
          <Alert
            variant={errorMessage ? 'destructive' : 'default'}
          >
            {!errorMessage && (
              <CheckCircle2 className="size-4" />
            )}
            <AlertDescription>
              {errorMessage ?? successMessage}
            </AlertDescription>
          </Alert>
        )}

        <section className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div
            role="button"
            tabIndex={0}
            aria-label="Selecionar fotografia de perfil"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={cn(
              'group relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted/20 p-5 text-center outline-none transition',
              'hover:border-primary/50 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring',
              isDragging && 'border-primary bg-primary/5',
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarSelected}
            />

            <div className="relative mb-4 flex size-28 items-center justify-center overflow-hidden rounded-2xl border bg-background shadow-sm">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="size-full object-cover"
                />
              ) : initials ? (
                <span className="text-3xl font-semibold">
                  {initials}
                </span>
              ) : (
                <UserRound className="size-11 text-muted-foreground" />
              )}

              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <LoaderCircle className="size-7 animate-spin" />
                </div>
              )}
            </div>

            <CloudUpload className="mb-2 size-5 text-primary" />
            <p className="text-sm font-medium">
              Arrasta uma imagem ou clica para selecionar
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG ou WebP · máximo 5 MB
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border bg-background p-5">
            <div>
              <p className="text-lg font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.email}
              </p>
              <p className="mt-3 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {profile.role}
              </p>
            </div>

            {profile.avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                className="mt-5 w-fit text-destructive hover:text-destructive"
                onClick={handleRemoveAvatar}
                disabled={
                  isUploadingAvatar || isRemovingAvatar
                }
              >
                {isRemovingAvatar ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Remover fotografia
              </Button>
            )}
          </div>
        </section>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-2xl border p-5">
            <div className="mb-5">
              <h3 className="font-semibold">Dados pessoais</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Estes dados identificam a tua conta na plataforma.
              </p>
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

              <div className="space-y-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  maxLength={255}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={isSaving}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-phone">Telefone</Label>
                <Input
                  id="settings-phone"
                  type="tel"
                  value={phone}
                  maxLength={30}
                  placeholder="+351 912 345 678"
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                {hasChanges
                  ? 'Existem alterações por guardar.'
                  : 'O perfil está atualizado.'}
              </p>
              <p className="text-xs text-muted-foreground">
                As alterações ficam visíveis imediatamente na aplicação.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!hasChanges || isSaving}
            >
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
