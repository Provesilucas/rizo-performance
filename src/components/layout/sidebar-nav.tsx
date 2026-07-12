'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navSections, resolveActiveNav } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  /** Callback disparado ao navegar (usado para fechar o drawer mobile). */
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const active = resolveActiveNav(pathname);

  return (
    <nav
      className="flex flex-1 flex-col gap-6 px-3 py-4"
      aria-label="Principal"
    >
      {navSections.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {section.label}
          </p>
          {section.items.map((item) => {
            const isActive = active?.href === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-secondary font-medium text-foreground'
                    : 'font-medium text-sidebar-foreground hover:bg-secondary/70 hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'absolute left-0 h-5 w-1 rounded-r-full bg-primary transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                  aria-hidden="true"
                />
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover:text-foreground',
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
