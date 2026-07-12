import type { NamedValue } from '@/interfaces';
import {
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from '@/lib/format';

/**
 * Lista de distribuição em barras horizontais (server component, sem JS).
 * Ideal para "receita por influenciador/marca" ou contagens (temas).
 */
export function DistributionList({
  items,
  format = 'currency',
}: {
  items: NamedValue[];
  format?: 'currency' | 'number';
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  const max = Math.max(...items.map((i) => i.value), 1);
  const formatValue =
    format === 'number' ? formatNumber : formatCurrencyCompact;

  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const width = Math.max((item.value / max) * 100, 3);
        const share = (item.value / total) * 100;
        return (
          <li key={item.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-foreground">
                {item.name}
              </span>
              <span className="flex shrink-0 items-center gap-2 tabular-nums">
                <span className="font-semibold text-foreground">
                  {formatValue(item.value)}
                </span>
                <span className="w-11 text-right text-xs text-muted-foreground">
                  {formatPercent(share, 0)}
                </span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
