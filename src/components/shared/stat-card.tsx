import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { TrendPill } from '@/components/shared/trend-pill';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  delta?: number;
  deltaLabel?: string;
  invertDelta?: boolean;
  className?: string;
}

/**
 * Card de estatística simples (rótulo + valor + variação opcional).
 * Usado em páginas onde não há um `MetricCard` completo do domínio.
 */
export function StatCard({
  label,
  value,
  icon: IconComp,
  delta,
  deltaLabel,
  invertDelta,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {IconComp && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
            <IconComp className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-medium tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      {delta !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <TrendPill value={delta} invert={invertDelta} />
          {deltaLabel && (
            <span className="text-xs text-muted-foreground">{deltaLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
}
