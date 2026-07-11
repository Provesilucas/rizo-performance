import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Banner de aviso (ex.: contratos a encerrar) com link opcional de ação. */
export function AlertBanner({
  message,
  actionLabel,
  actionHref,
  className,
}: {
  message: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3',
        className,
      )}
      role="status"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
      <p className="text-sm text-foreground">
        {message}
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="ml-1.5 font-medium text-primary underline-offset-2 hover:underline"
          >
            {actionLabel}
          </Link>
        )}
      </p>
    </div>
  );
}
