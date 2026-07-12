import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FunnelStage } from '@/interfaces';
import {
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from '@/lib/format';
import { cn } from '@/lib/utils';

/** Visualização do funil comercial em barras horizontais proporcionais. */
export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const pipeline = stages.filter((s) => s.key !== 'perdidos');
  const lost = stages.find((s) => s.key === 'perdidos');
  const maxCount = Math.max(...pipeline.map((s) => s.count), 1);

  return (
    <Card>
      <CardHeader className="border-b border-border/60">
        <CardTitle>Funil comercial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-6">
        {pipeline.map((stage, index) => {
          const width = Math.max((stage.count / maxCount) * 100, 4);
          return (
            <div key={stage.key} className="group">
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {stage.label}
                </span>
                <span className="flex items-center gap-3">
                  {stage.conversionFromPrevious !== null && (
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatPercent(stage.conversionFromPrevious, 0)}
                    </span>
                  )}
                  <span className="w-12 text-right font-semibold tabular-nums text-foreground">
                    {formatNumber(stage.count)}
                  </span>
                </span>
              </div>
              <div className="relative h-9 overflow-hidden rounded-md bg-muted/50">
                <div
                  className="flex h-full items-center rounded-md bg-primary px-3 transition-all duration-500"
                  style={{ width: `${width}%` }}
                >
                  <span className="truncate text-xs font-medium text-primary-foreground">
                    {formatCurrencyCompact(stage.value)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {lost && (
          <div
            className={cn(
              'mt-4 flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3',
            )}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Badge variant="destructive">Perdidos</Badge>
            </span>
            <span className="flex items-center gap-4 text-sm">
              <span className="tabular-nums text-muted-foreground">
                {formatCurrencyCompact(lost.value)}
              </span>
              <span className="font-semibold tabular-nums text-foreground">
                {formatNumber(lost.count)}
              </span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
