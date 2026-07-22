'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { navigationGroups } from '@/constants/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

function getInitials(firstName?: string, lastName?: string) {
  const firstInitial = firstName?.trim().charAt(0) ?? '';
  const lastInitial = lastName?.trim().charAt(0) ?? '';

  return `${firstInitial}${lastInitial}`.toUpperCase() || 'AP';
}

function formatRole(role?: string) {
  if (!role) {
    return 'Utilizador';
  }

  return role
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = getInitials(user.firstName, user.lastName);
  const formattedRole = formatRole(user.role);

  const avatarSrc =
    user.firstName.trim().toLowerCase() === 'marco'
      ? '/images/avatars/marco.png'
      : null;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] flex-col overflow-hidden bg-[#063763] text-white shadow-2xl lg:flex">
      {/* Área do logótipo com a mesma cor de fundo da imagem */}
      <div className="flex shrink-0 justify-center border-b border-white/10 bg-[#063763] px-5 py-4">
        <Image
          src="/images/logo-apcm.png"
          alt="Atlantica Padel Club Manager"
          width={250}
          height={140}
          priority
          className="h-auto max-h-[190px] w-auto max-w-full object-contain"
        />
      </div>

      {/* Navegação e área do utilizador */}
      <div className="relative flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#0f3154] via-[#0d3d68] to-[#075b78]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-16 size-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="absolute -right-28 bottom-20 size-72 rounded-full bg-emerald-300/10 blur-3xl" />
        </div>

        <nav className="relative min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {navigationGroups.map((group, groupIndex) => (
            <div
              key={group.label ?? `navigation-group-${groupIndex}`}
              className="space-y-2"
            >
              {group.label ? (
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/45">
                  {group.label}
                </p>
              ) : null}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group relative flex min-h-10 items-center gap-3 overflow-hidden rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(3,22,40,0.18)]'
                          : 'text-cyan-50/70 hover:bg-white/8 hover:text-white',
                      )}
                    >
                      <span
                        className={cn(
                          'absolute inset-y-2 left-0 w-1 rounded-r-full bg-emerald-400 transition-all duration-200',
                          isActive
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-2 opacity-0',
                        )}
                      />

                      <Icon
                        className={cn(
                          'size-5 shrink-0 transition-all duration-200',
                          isActive
                            ? 'text-emerald-300'
                            : 'text-cyan-100/65 group-hover:text-cyan-100',
                        )}
                      />

                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative shrink-0 border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-white/8 px-3 py-2.5 ring-1 ring-white/8 backdrop-blur-sm">
            <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-300 to-cyan-400 text-xs font-extrabold text-slate-900 shadow-lg shadow-cyan-950/20 ring-2 ring-white/70">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={`Fotografia de ${fullName}`}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight text-white">
                {fullName}
              </p>

              <p className="mt-0.5 truncate text-[11px] leading-tight text-cyan-100/55">
                {formattedRole}
              </p>
            </div>

            <span
              className="size-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]"
              title="Sessão ativa"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full justify-start rounded-xl px-3 text-cyan-50/65 hover:bg-red-400/10 hover:text-red-200"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Terminar sessão
          </Button>
        </div>
      </div>
    </aside>
  );
}