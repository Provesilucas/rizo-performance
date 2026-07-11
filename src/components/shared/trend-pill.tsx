import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

import { formatSignedPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import { isPositiveDelta } from '@/utils/trend';

interface TrendPillProps {
  /** Variação percentual. */
  value: number;
  /** Quando `true`, uma queda é tratada como positiva. */
  invert?: boolean;
  className?: string;
}

/** Pílula compacta com seta + variação percentual, colorida por sentido. */
export function TrendPill({
  value,
  invert = false,
  className,
}: TrendPillProps) {
  const positive = isPositiveDelta(value, invert);
  const neutral = value === 0;
  const ArrowIcon = neutral ? Minus : value > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
        neutral && 'bg-muted text-muted-foreground',
        !neutral && positive && 'bg-success/10 text-success',
        !neutral && !positive && 'bg-destructive/10 text-destructive',
        className,
      )}
    >
      <ArrowIcon className="h-3 w-3" />
      {formatSignedPercent(value)}
    </span>
  );
}
