import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendPill } from '@/components/shared';
import type { ExternalHub, Salesperson } from '@/interfaces';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

const SOURCE_COLOR: Record<string, string> = {
  prospeccao: 'bg-primary',
  inbound: 'bg-chart-2',
};

/** Card de breakdown de um comercial por origem de negócio. */
export function SalespersonBreakdown({ person }: { person: Salesperson }) {
  return (
    <Card className="p-5">
      <div>
        <h3 className="font-semibold text-foreground">
          {person.name} <span className="text-muted-foreground">— breakdown</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          {person.contractsMonth} jobs · ticket médio{' '}
          {formatCurrency(person.averageTicket)}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {person.bySource.map((source) => (
          <div key={source.source} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{source.label}</span>
              <span className="tabular-nums">
                <span className="font-semibold text-foreground">
                  {formatCurrency(source.value)}
                </span>{' '}
                <span className="text-xs text-muted-foreground">
                  ({formatPercent(source.share, 1)})
                </span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  SOURCE_COLOR[source.source] ?? 'bg-primary',
                )}
                style={{ width: `${Math.max(source.share, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        Maior job:{' '}
        <span className="font-medium text-foreground">
          {person.biggestJob.name}
        </span>{' '}
        {formatCurrency(person.biggestJob.value)}
      </p>
    </Card>
  );
}

/** Card do Hub externo (influenciadores fora do casting). */
export function ExternalHubCard({ hub }: { hub: ExternalHub }) {
  return (
    <Card className="p-5">
      <div>
        <h3 className="font-semibold text-foreground">Hub externo</h3>
        <p className="text-sm text-muted-foreground">
          Influenciadores fora do casting
        </p>
        <Badge variant="default">Virada de chave</Badge>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <p className="text-2xl font-semibold tabular-nums text-foreground">
          {formatCurrency(hub.total)}
        </p>
        <TrendPill value={hub.growthPercent} className="mb-1" />
      </div>
      <p className="text-xs text-muted-foreground">
        {formatNumber(hub.influencers)} influenciadores · {hub.jobs} jobs ·{' '}
        {hub.sharePercent}% do faturamento
      </p>

      <ul className="mt-4 space-y-3 border-t border-border/60 pt-3">
        {hub.items.map((item, index) => (
          <li
            key={`${item.handle}-${item.brand}-${index}`}
            className="flex items-center justify-between"
          >
            <div className="leading-tight">
              <p className="text-sm font-medium text-foreground">
                {item.handle}
              </p>
              <p className="text-xs text-muted-foreground">{item.brand}</p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {formatCurrency(item.value)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
