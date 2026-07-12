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

/**
 * Botão de atualizar os dados. Reexecuta os Server Components via
 * router.refresh(). O status "ao vivo" fica no indicador do cabeçalho.
 */
export function SyncStatus() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleRefresh = React.useCallback(() => {
    setIsSyncing(true);
    router.refresh();
    // Feedback visual mínimo; alinhado à latência simulada do MockProvider.
    setTimeout(() => setIsSyncing(false), 700);
  }, [router]);

  return (
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
  );
}
