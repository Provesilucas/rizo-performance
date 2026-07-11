import { formatCurrency } from '@/lib/format';

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
  /** Prefixo do rótulo (ex.: "Dia "). */
  labelPrefix?: string;
  /** Formata cada valor. Padrão: moeda. */
  valueFormatter?: (value: number) => string;
}

/** Tooltip customizado, alinhado ao design do dashboard. */
export function ChartTooltip({
  active,
  label,
  payload,
  labelPrefix = '',
  valueFormatter = formatCurrency,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const visible = payload.filter(
    (entry) => entry.value !== null && entry.value !== undefined,
  );
  if (!visible.length) return null;

  return (
    <div className="min-w-[160px] rounded-lg border border-border/70 bg-popover p-3 shadow-elevated">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {labelPrefix}
        {label}
      </p>
      <div className="space-y-1.5">
        {visible.map((entry, index) => (
          <div
            key={`${entry.dataKey}-${index}`}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {typeof entry.value === 'number'
                ? valueFormatter(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
