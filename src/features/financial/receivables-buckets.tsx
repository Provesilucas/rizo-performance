import { Badge } from '@/components/ui/badge';
import type { ReceivableBucket } from '@/interfaces';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<
  ReceivableBucket['status'],
  { bar: string; label: string }
> = {
  pending: { bar: 'bg-primary', label: 'Em dia' },
  overdue: { bar: 'bg-destructive', label: 'Vencido' },
  paid: { bar: 'bg-success', label: 'Pago' },
};

/** Faixas de vencimento das contas a receber. */
export function ReceivablesBuckets({
  buckets,
}: {
  buckets: ReceivableBucket[];
}) {
  const max = Math.max(...buckets.map((b) => b.value), 1);

  return (
    <div className="space-y-4">
      {buckets.map((bucket) => {
        const width = Math.max((bucket.value / max) * 100, 3);
        const style = STATUS_STYLES[bucket.status];
        return (
          <div key={bucket.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-foreground">
                {bucket.label}
                <Badge
                  variant={
                    bucket.status === 'overdue' ? 'destructive' : 'secondary'
                  }
                  className="text-[10px]"
                >
                  {formatNumber(bucket.count)}
                </Badge>
              </span>
              <span className="font-semibold tabular-nums text-foreground">
                {formatCurrency(bucket.value)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all', style.bar)}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
