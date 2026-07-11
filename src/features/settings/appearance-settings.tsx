'use client';

import * as React from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
] as const;

/** Seleção de tema (claro/escuro/sistema). */
export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const current = mounted ? (theme ?? 'light') : 'light';

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = current === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              'relative flex items-center gap-3 rounded-lg border p-4 text-left transition-colors',
              isActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-accent',
            )}
          >
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {option.label}
            </span>
            {isActive && (
              <Check className="absolute right-3 top-3 h-4 w-4 text-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
