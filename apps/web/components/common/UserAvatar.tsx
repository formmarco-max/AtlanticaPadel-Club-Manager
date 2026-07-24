'use client';

import { useMemo, useState } from 'react';
import { UserRound } from 'lucide-react';

import {
  getUserInitials,
  resolveAvatarUrl,
  type AvatarUser,
} from '@/lib/avatar';
import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface UserAvatarProps {
  user: AvatarUser;
  size?: AvatarSize;
  className?: string;
  imageClassName?: string;
  showStatus?: boolean;
  statusLabel?: string;
  cacheKey?: string | number | null;
  alt?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'size-7 text-[10px]',
  sm: 'size-9 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-16 text-lg',
  xl: 'size-24 text-2xl',
};

const statusClasses: Record<AvatarSize, string> = {
  xs: 'size-2 border',
  sm: 'size-2.5 border-2',
  md: 'size-3 border-2',
  lg: 'size-3.5 border-2',
  xl: 'size-4 border-2',
};

export function UserAvatar({
  user,
  size = 'md',
  className,
  imageClassName,
  showStatus = false,
  statusLabel = 'Sessão ativa',
  cacheKey,
  alt,
}: UserAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const initials = useMemo(() => getUserInitials(user), [user]);
  const resolvedAvatarUrl = useMemo(
    () => resolveAvatarUrl(user.avatarUrl),
    [user.avatarUrl],
  );

  const avatarSrc =
    resolvedAvatarUrl && cacheKey !== null && cacheKey !== undefined
      ? `${resolvedAvatarUrl}${
          resolvedAvatarUrl.includes('?') ? '&' : '?'
        }v=${encodeURIComponent(String(cacheKey))}`
      : resolvedAvatarUrl;

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0',
        sizeClasses[size],
        className,
      )}
    >
      <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/70 font-semibold text-primary-foreground shadow-sm ring-1 ring-black/5">
        {avatarSrc && !hasImageError ? (
          // A tag img evita configuração adicional de remotePatterns no Next.js.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            alt={alt ?? (fullName ? `Fotografia de ${fullName}` : 'Avatar')}
            className={cn('size-full object-cover', imageClassName)}
            onError={() => setHasImageError(true)}
          />
        ) : initials ? (
          <span aria-hidden="true">{initials}</span>
        ) : (
          <UserRound className="size-1/2" aria-hidden="true" />
        )}
      </span>

      {showStatus && (
        <span
          title={statusLabel}
          aria-label={statusLabel}
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-background bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.08)]',
            statusClasses[size],
          )}
        />
      )}
    </span>
  );
}
