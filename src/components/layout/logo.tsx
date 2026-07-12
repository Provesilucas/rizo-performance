import { cn } from '@/lib/utils';

/**
 * Marca da RIZO — monograma "RIZO" em grade 2×2 (lockup oficial), na fonte
 * da marca (Unbounded) e no magenta oficial via currentColor.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 48 48"
        className="h-8 w-8 text-primary"
        role="img"
        aria-label="RIZO"
      >
        <g
          fill="currentColor"
          fontFamily="var(--font-display), var(--font-sans), sans-serif"
          fontWeight={700}
          fontSize={19}
          textAnchor="middle"
        >
          <text x="13" y="21">
            R
          </text>
          <text x="36" y="21">
            I
          </text>
          <text x="13" y="45">
            Z
          </text>
          <text x="36" y="45">
            O
          </text>
        </g>
      </svg>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm font-bold tracking-tight text-foreground">
            RIZO
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            Performance
          </span>
        </div>
      )}
    </div>
  );
}
