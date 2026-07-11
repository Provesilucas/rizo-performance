'use client';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartTooltip } from '@/components/charts/chart-tooltip';
import type { GoalEvolutionPoint } from '@/interfaces';
import { formatCurrencyCompact } from '@/lib/format';

/** Marca do dia atual: último ponto com `realized` preenchido. */
function resolveTodayLabel(series: GoalEvolutionPoint[]): string | undefined {
  const withRealized = series.filter((p) => p.realized !== null);
  return withRealized[withRealized.length - 1]?.label;
}

export function GoalEvolutionChart({
  series,
  labelPrefix = '',
  compareSeries,
  compareName,
}: {
  series: GoalEvolutionPoint[];
  /** Prefixo do rótulo no tooltip (ex.: "Dia "). */
  labelPrefix?: string;
  /** Série realizada do mesmo período do ano anterior (comparativo). */
  compareSeries?: GoalEvolutionPoint[];
  /** Nome exibido no tooltip/legenda para a série comparativa. */
  compareName?: string;
}) {
  const todayLabel = resolveTodayLabel(series);
  // Rótulos densos (série diária) espaçam o eixo; mensais mostram todos.
  const xInterval = series.length > 15 ? 4 : 0;

  // Mescla o realizado do ano anterior alinhando por posição (mesmo período).
  const hasCompare =
    !!compareSeries && compareSeries.length === series.length;
  const data = hasCompare
    ? series.map((point, i) => ({
        ...point,
        compareValue:
          compareSeries![i]!.realized ?? compareSeries![i]!.value ?? null,
      }))
    : series;

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <defs>
            <linearGradient id="fillRealized" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.18}
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0}
              />
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
            interval={xInterval}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={64}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value: number) => formatCurrencyCompact(value)}
          />
          <Tooltip
            content={<ChartTooltip labelPrefix={labelPrefix} />}
            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          />

          {todayLabel && (
            <ReferenceLine
              x={todayLabel}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
          )}

          <Line
            type="monotone"
            dataKey="target"
            name="Meta acumulada"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            strokeDasharray="6 5"
            dot={false}
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="realized"
            name="Realizado"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2.5}
            fill="url(#fillRealized)"
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="projection"
            name="Projeção"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            strokeDasharray="2 4"
            dot={false}
            connectNulls
          />
          {hasCompare && (
            <Line
              type="monotone"
              dataKey="compareValue"
              name={compareName ?? 'Ano anterior'}
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              strokeOpacity={0.9}
              dot={false}
              connectNulls
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
