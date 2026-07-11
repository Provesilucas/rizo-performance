'use client';

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
import type { ProductionMonthlyPoint } from '@/interfaces';
import { formatNumber } from '@/lib/format';

/** Vídeos entregues por mês (barras) + nota de retenção (linha, 0-10). */
export function ProductionChart({
  data,
  height = 260,
}: {
  data: ProductionMonthlyPoint[];
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
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
            yAxisId="videos"
            tickLine={false}
            axisLine={false}
            width={32}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            yAxisId="retention"
            orientation="right"
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            width={28}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            content={<ChartTooltip valueFormatter={formatNumber} />}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
          />
          <Bar
            yAxisId="videos"
            dataKey="videos"
            name="Vídeos entregues"
            fill="hsl(var(--chart-1))"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
          <Line
            yAxisId="retention"
            type="monotone"
            dataKey="avgRetention"
            name="Retenção (0-10)"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2.5}
            dot={{ r: 3, fill: 'hsl(var(--chart-4))', strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
