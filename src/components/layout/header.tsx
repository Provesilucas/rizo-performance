'use client';

import { usePathname } from 'next/navigation';

import { resolveActiveNav } from '@/lib/navigation';
import { FiltersMenu } from './filters-menu';
import { LiveIndicator } from './live-indicator';
import { MobileSidebar } from './mobile-sidebar';
import { PeriodSelect } from './period-select';
import { SyncStatus } from './sync-status';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

interface HeaderProps {
  user: { name: string; email: string };
}

/**
 * Cabeçalho fixo: título da página, controles de período/filtros,
 * status de sincronização e menu do usuário.
 */
export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const active = resolveActiveNav(pathname);
  const title = active?.title ?? 'RIZO Performance';
  const description = active?.description;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileSidebar />

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2.5">
            <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {title}
            </h1>
            <LiveIndicator />
          </div>
          {description && (
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {description}
            </p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <PeriodSelect />
          </div>
          <FiltersMenu />
          <SyncStatus />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <UserMenu name={user.name} email={user.email} />
        </div>
      </div>

      {/* Período em linha própria no mobile */}
      <div className="flex items-center gap-2 border-t border-border/60 px-4 py-2 md:hidden">
        <PeriodSelect />
      </div>
    </header>
  );
}
