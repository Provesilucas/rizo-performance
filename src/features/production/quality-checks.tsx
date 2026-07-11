import type { QualityCheckStat } from '@/interfaces';
import { formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

/** Barras horizontais com a taxa de aprovação de cada checagem do QC. */
export function QualityChecks({ checks }: { checks: QualityCheckStat[] }) {
  return (
    <ul className="space-y-3">
      {checks.map((check) => {
        const tone =
          check.passRate >= 90
            ? 'bg-success'
            : check.passRate >= 80
              ? 'bg-primary'
              : 'bg-warning';
        return (
          <li key={check.item} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-foreground">{check.item}</span>
              <span className="font-medium tabular-nums text-muted-foreground">
                {formatPercent(check.passRate, 0)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all', tone)}
                style={{ width: `${check.passRate}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
