'use client';

import * as React from 'react';
import { GitCompareArrows } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartTooltip } from '@/components/charts/chart-tooltip';
import { Button } from '@/components/ui/button';
import type { MonthlyRevenuePoint } from '@/interfaces';
import { formatCurrencyAxis } from '@/lib/format';

/** Ano anterior ao dos dados (para o rótulo do comparativo). */
function previousYearLabel(data: MonthlyRevenuePoint[]): string {
  const year = data[0] ? new Date(data[0].date).getFullYear() : 0;
  return String(year - 1);
}

/** Receita mensal: barras (recebido) + linha (previsto), com comparativo opcional. */
export function RevenueChart({ data }: { data: MonthlyRevenuePoint[] }) {
  const [compare, setCompare] = React.useState(false);
  const prevYear = previousYearLabel(data);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          variant={compare ? 'default' : 'outline'}
          size="sm"
          className="h-8 gap-1.5"
          aria-pressed={compare}
          onClick={() => setCompare((v) => !v)}
        >
          <GitCompareArrows className="h-4 w-4" />
          Comparar {prevYear}
        </Button>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={52}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value: number) => formatCurrencyAxis(value)}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
            />
            <Bar
              dataKey="received"
              name="Recebido"
              fill="hsl(var(--chart-1))"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Previsto"
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ r: 3, fill: 'hsl(var(--chart-4))', strokeWidth: 0 }}
            />
            {compare && (
              <Line
                type="monotone"
                dataKey="receivedPrevYear"
                name={`Recebido ${prevYear}`}
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
