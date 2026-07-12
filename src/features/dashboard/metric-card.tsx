import { Info } from 'lucide-react';

import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@/components/shared/icon';
import { TrendPill } from '@/components/shared/trend-pill';
import type { MetricCard as MetricCardType } from '@/interfaces';
import { cn } from '@/lib/utils';
import { formatMetricValue } from './format-metric';

interface MetricCardProps {
  metric: MetricCardType;
  /** Índice para o atraso escalonado da animação de entrada. */
  index?: number;
}

/**
 * Card de métrica executiva: ícone, valor, tooltip explicativo e
 * comparativo percentual com indicador de sentido.
 */
export function MetricCard({ metric, index = 0 }: MetricCardProps) {
  return (
    <Card
      className="animate-fade-in-up p-5 transition-shadow duration-200 hover:shadow-card-hover"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Icon name={metric.icon} className="h-[18px] w-[18px]" />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground/50 transition-colors hover:text-muted-foreground"
              aria-label={`Sobre ${metric.label}`}
            >
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{metric.tooltip}</TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </p>
        <p
          className={cn(
            'text-2xl font-medium tabular-nums tracking-tight text-foreground',
          )}
        >
          {formatMetricValue(metric)}
        </p>
      </div>

      {metric.deltaPercent !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <TrendPill value={metric.deltaPercent} invert={metric.invertDelta} />
          {metric.deltaLabel && (
            <span className="text-xs text-muted-foreground">
              {metric.deltaLabel}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
