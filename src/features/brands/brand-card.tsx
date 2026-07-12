import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendPill } from '@/components/shared';
import type { Brand } from '@/interfaces';
import { formatCurrency, formatCurrencyCompact } from '@/lib/format';

function initials(name: string) {
  return name
    .replace(/[^a-zA-ZÀ-ÿ ]/g, '')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Card className="p-5 transition-shadow duration-200 hover:shadow-card-hover">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-foreground">
          {initials(brand.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{brand.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {brand.segment}
          </p>
        </div>
        <Badge variant={brand.activeContracts > 0 ? 'success' : 'secondary'}>
          {brand.activeContracts > 0 ? 'Ativa' : 'Inativa'}
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Metric label="Receita" value={formatCurrencyCompact(brand.revenue)} />
        <Metric
          label="Ticket médio"
          value={formatCurrency(brand.averageTicket)}
        />
        <Metric label="Contratos" value={String(brand.contracts)} />
        <Metric label="Ativos" value={String(brand.activeContracts)} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-xs text-muted-foreground">
          Crescimento de receita
        </span>
        <TrendPill value={brand.growthPercent} />
      </div>
    </Card>
  );
}
