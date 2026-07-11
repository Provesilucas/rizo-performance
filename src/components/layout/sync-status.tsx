'use client';

import * as React from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/** Formata a diferença de tempo em linguagem natural (pt-BR). */
function relativeTime(from: Date): string {
  const seconds = Math.floor((Date.now() - from.getTime()) / 1000);
  if (seconds < 10) return 'agora mesmo';
  if (seconds < 60) return `há ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `há ${hours}h`;
}

/**
 * Indicador de sincronização + botão atualizar.
 * "Atualizar" reexecuta os Server Components via router.refresh().
 */
export function SyncStatus() {
  const router = useRouter();
  const [lastSync, setLastSync] = React.useState<Date>(() => new Date());
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [, forceTick] = React.useReducer((x: number) => x + 1, 0);

  // Atualiza o rótulo "há X min" periodicamente.
  React.useEffect(() => {
    const id = setInterval(forceTick, 30_000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = React.useCallback(() => {
    setIsSyncing(true);
    router.refresh();
    // Feedback visual mínimo; alinhado à latência simulada do MockProvider.
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date());
    }, 700);
  }, [router]);

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 md:flex">
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full',
              isSyncing
                ? 'animate-ping bg-primary opacity-70'
                : 'bg-success/60',
            )}
          />
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              isSyncing ? 'bg-primary' : 'bg-success',
            )}
          />
        </span>
        <span className="text-xs text-muted-foreground">
          {isSyncing
            ? 'Sincronizando…'
            : `Sincronizado ${relativeTime(lastSync)}`}
        </span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isSyncing}
            aria-label="Atualizar dados"
          >
            <RefreshCw className={cn('h-4 w-4', isSyncing && 'animate-spin')} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Atualizar dados</TooltipContent>
      </Tooltip>
    </div>
  );
}
