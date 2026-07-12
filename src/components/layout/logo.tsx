import { cn } from '@/lib/utils';

/**
 * Marca da RIZO — monograma "RIZO" em grade 2×2 (SVG próprio, magenta da
 * marca via currentColor, com suporte automático a dark mode).
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
        viewBox="0 0 44 44"
        className="h-8 w-8 text-primary"
        role="img"
        aria-label="RIZO"
      >
        <g
          fill="currentColor"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontWeight={800}
          fontSize={23}
          letterSpacing={-1}
          textAnchor="middle"
        >
          <text x="11" y="20">
            R
          </text>
          <text x="33" y="20">
            I
          </text>
          <text x="11" y="42">
            Z
          </text>
          <text x="33" y="42">
            O
          </text>
        </g>
      </svg>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-foreground">
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
