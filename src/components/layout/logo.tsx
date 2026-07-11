import { cn } from '@/lib/utils';

/**
 * Marca da RIZO. SVG próprio (sem imagem externa) para nitidez e
 * suporte automático a dark mode via currentColor.
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
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 19V6a2 2 0 0 1 2-2h6a4 4 0 0 1 1.2 7.8L18 19h-3l-3.2-6H8v6H5Z"
            fill="currentColor"
          />
        </svg>
      </div>
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
