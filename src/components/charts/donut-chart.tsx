'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export interface DonutSlice {
  label: string;
  value: number;
  /** Cor CSS (ex.: "hsl(var(--chart-1))"). */
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  /** Valor central em destaque. */
  centerValue?: string;
  centerLabel?: string;
  height?: number;
}

/** Gráfico de rosca com rótulo central e legenda lateral. */
export function DonutChart({
  data,
  centerValue,
  centerLabel,
  height = 200,
}: DonutChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((slice) => (
                <Cell key={slice.label} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerValue && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold tabular-nums text-foreground">
              {centerValue}
            </span>
            {centerLabel && (
              <span className="text-xs text-muted-foreground">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <ul className="flex w-full flex-col gap-2.5">
        {data.map((slice) => {
          const share = total > 0 ? (slice.value / total) * 100 : 0;
          return (
            <li
              key={slice.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                {slice.label}
              </span>
              <span className="flex items-center gap-2 tabular-nums">
                <span className="font-semibold text-foreground">
                  {slice.value}
                </span>
                <span className="w-11 text-right text-xs text-muted-foreground">
                  {share.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
