import { TrendingUp, Users } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar, TrendPill } from '@/components/shared';
import { SimpleAreaChart } from '@/components/charts/simple-charts';
import type { ExternalHub } from '@/interfaces';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from '@/lib/format';

/**
 * Destaque do Hub externo — aposta estratégica da agência ("virada de chave"):
 * fechar cada vez mais influenciadores fora do casting exclusivo.
 */
export function ExternalHubHighlight({ hub }: { hub: ExternalHub }) {
  const goalPercent = hub.target > 0 ? (hub.total / hub.target) * 100 : 0;

  return (
    <Card className="overflow-hidden border-l-2 border-l-primary">
      <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Hub externo
            </h3>
            <Badge variant="secondary">Prioridade estratégica</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Influenciadores fora do casting exclusivo — foco de crescimento para
            a saúde financeira da agência.
          </p>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-medium tracking-tight tabular-nums text-foreground">
              {formatCurrency(hub.total)}
            </span>
            <TrendPill value={hub.growthPercent} className="mb-1" />
          </div>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {formatNumber(hub.influencers)} influenciadores ·{' '}
            {formatNumber(hub.jobs)} jobs · {formatPercent(hub.sharePercent, 0)}{' '}
            do faturamento
          </p>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Meta externa {formatCurrencyCompact(hub.target)}
              </span>
              <span className="font-medium text-foreground">
                {formatPercent(goalPercent, 0)}
              </span>
            </div>
            <ProgressBar value={goalPercent} indicatorClassName="bg-primary" />
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-medium text-muted-foreground">
            Evolução do faturamento externo
          </p>
          <div className="mt-2 flex-1">
            <SimpleAreaChart
              data={hub.monthly}
              dataKey="value"
              name="Faturamento externo"
              format="currency-compact"
              color="hsl(var(--primary))"
              height={168}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
