import { api } from '@/lib/api';

export interface AvatarUser {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}

export function getUserInitials(user: AvatarUser): string {
  const firstInitial = user.firstName?.trim().charAt(0) ?? '';
  const lastInitial = user.lastName?.trim().charAt(0) ?? '';

  return `${firstInitial}${lastInitial}`.toUpperCase() || 'AP';
}

export function getApiOrigin(): string {
  const baseUrl =
    api.defaults.baseURL ?? 'http://localhost:3001/api/v1';

  try {
    return new URL(baseUrl).origin;
  } catch {
    return 'http://localhost:3001';
  }
}

export function resolveAvatarUrl(
  avatarUrl?: string | null,
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
