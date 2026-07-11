import { Crown } from 'lucide-react';

import { Card } from '@/components/ui/card';
import type { Salesperson } from '@/interfaces';
import { formatCurrency } from '@/lib/format';

/** Resolve o top comercial do mês (por contratos, desempate por valor). */
export function resolveTopSeller(
  salespeople: Salesperson[],
): Salesperson | undefined {
  return [...salespeople].sort(
    (a, b) =>
      b.contractsMonth - a.contractsMonth ||
      b.closedValueMonth - a.closedValueMonth,
  )[0];
}

/** Card do comercial que mais fechou no mês, com o valor fechado em destaque. */
export function TopComercialCard({ seller }: { seller?: Salesperson }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Top comercial do mês
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Crown className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {seller?.name ?? '—'}
      </p>

      {seller && (
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">Fechou</span>
          <span className="text-lg font-semibold tabular-nums text-success">
            {formatCurrency(seller.closedValueMonth)}
          </span>
          <span className="text-xs text-muted-foreground">
            · {seller.contractsMonth} contratos
          </span>
        </div>
      )}
    </Card>
  );
}
