import { cn } from '@/lib/utils';

interface ProgressBarProps {
  /** Percentual preenchido (0-100). */
  value: number;
  className?: string;
  /** Classe de cor da barra preenchida. */
  indicatorClassName?: string;
  /** Marcador opcional (0-100), ex.: ritmo esperado. */
  marker?: number;
}

/** Barra de progresso acessível com marcador opcional de referência. */
export function ProgressBar({
  value,
  className,
  indicatorClassName,
  marker,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-muted',
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full bg-primary transition-all duration-500',
          indicatorClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
      {marker !== undefined && (
        <span
          className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-foreground/50"
          style={{ left: `${Math.min(Math.max(marker, 0), 100)}%` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
