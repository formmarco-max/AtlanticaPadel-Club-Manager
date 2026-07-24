'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import {
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ClubSettingsCard } from '@/features/settings/components/ClubSettingsCard';
import { ProfileSettingsCard } from '@/features/settings/components/ProfileSettingsCard';
import { api } from '@/lib/api';
import type {
  ApiEnvelope,
  ClubSettings,
  MyProfile,
} from '@/types/settings';

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
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

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-[430px] w-full rounded-xl" />
    </div>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] =
    useState<MyProfile | null>(null);
  const [club, setClub] =
    useState<ClubSettings | null>(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [profileError, setProfileError] =
    useState<string | null>(null);
  const [clubError, setClubError] =
    useState<string | null>(null);

  const canManageClub =
    profile?.role === 'ADMIN' ||
    profile?.role === 'OWNER';

  const loadSettings = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setProfileError(null);
        setClubError(null);

        const profileResponse = await api.get<
          MyProfile | ApiEnvelope<MyProfile>
        >('/users/me');

        const loadedProfile = unwrapResponse(
          profileResponse.data,
        );

        setProfile(loadedProfile);

        if (
          loadedProfile.role === 'ADMIN' ||
          loadedProfile.role === 'OWNER'
        ) {
          try {
            const clubResponse = await api.get<
              ClubSettings | ApiEnvelope<ClubSettings>
            >(`/clubs/${loadedProfile.clubId}`);

            setClub(unwrapResponse(clubResponse.data));
          } catch (error) {
            console.error(
              'Erro ao carregar o clube:',
              error,
            );

            setClub(null);
            setClubError(
              getErrorMessage(
                error,
                'Não foi possível carregar os dados do clube.',
              ),
            );
          }
        } else {
          setClub(null);
        }
      } catch (error) {
        console.error(
          'Erro ao carregar o perfil:',
          error,
        );

        setProfile(null);
        setClub(null);
        setProfileError(
          getErrorMessage(
            error,
            'Não foi possível carregar o teu perfil.',
          ),
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Definições"
        description="Gere o teu perfil e as configurações disponíveis."
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadSettings(true)}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`size-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            Atualizar
          </Button>
        }
      />

      {profileError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>
            Erro ao carregar o perfil
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span>{profileError}</span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadSettings()}
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {profile && (
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              Meu perfil
            </TabsTrigger>

            {canManageClub && (
              <TabsTrigger value="club">
                Clube
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettingsCard
              profile={profile}
              onProfileChanged={setProfile}
            />
          </TabsContent>

          {canManageClub && (
            <TabsContent value="club">
              {club ? (
                <ClubSettingsCard
                  club={club}
                  onClubChanged={setClub}
                />
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>
                    Erro ao carregar o clube
                  </AlertTitle>
                  <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {clubError ??
                        'Não foi possível carregar os dados do clube.'}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void loadSettings(true)
                      }
                    >
                      Tentar novamente
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
