'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartTooltip } from '@/components/charts/chart-tooltip';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
} from '@/lib/format';

/**
 * Formato do valor. Recebido como string (serializável) para permitir que
 * Server Components configurem o gráfico sem passar funções — o que o React
 * Server Components não permite.
 */
export type ChartValueFormat = 'number' | 'currency' | 'currency-compact';

const FORMATTERS: Record<ChartValueFormat, (value: number) => string> = {
  number: formatNumber,
  currency: formatCurrency,
  'currency-compact': formatCurrencyCompact,
};

interface SimpleChartProps {
  /** Registros do gráfico. Cada item deve conter `label` e a `dataKey`. */
  data: object[];
  dataKey: string;
  name: string;
  format?: ChartValueFormat;
  color?: string;
  height?: number;
}

/** Gráfico de barras de série única. */
export function SimpleBarChart({
  data,
  dataKey,
  name,
  format = 'number',
  color = 'hsl(var(--chart-3))',
  height = 240,
}: SimpleChartProps) {
  const valueFormatter = FORMATTERS[format];
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
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
            width={40}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value: number) => valueFormatter(value)}
          />
          <Tooltip
            content={<ChartTooltip valueFormatter={valueFormatter} />}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
          />
          <Bar
            dataKey={dataKey}
            name={name}
            fill={color}
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Gráfico de área de série única. */
export function SimpleAreaChart({
  data,
  dataKey,
  name,
  format = 'number',
  color = 'hsl(var(--chart-2))',
  height = 240,
}: SimpleChartProps) {
  const valueFormatter = FORMATTERS[format];
  const gradientId = `area-${dataKey}`;
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            width={56}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value: number) => valueFormatter(value)}
          />
          <Tooltip
            content={<ChartTooltip valueFormatter={valueFormatter} />}
            cursor={{ stroke: 'hsl(var(--border))' }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
