import type { HealthStatus } from '@/interfaces';
import type { BadgeProps } from '@/components/ui/badge';

interface StatusPresentation {
  label: string;
  variant: NonNullable<BadgeProps['variant']>;
  /** Classe de cor para a barra de progresso. */
  bar: string;
}

/** Traduz um `HealthStatus` para rótulo, variante de badge e cor. */
export function goalStatusPresentation(
  status: HealthStatus,
): StatusPresentation {
  switch (status) {
    case 'above':
      return {
        label: 'Acima do esperado',
        variant: 'success',
        bar: 'bg-success',
      };
    case 'below':
      return {
        label: 'Abaixo do esperado',
        variant: 'destructive',
        bar: 'bg-destructive',
      };
    default:
      return {
        label: 'Dentro do esperado',
        variant: 'warning',
        bar: 'bg-primary',
      };
  }
}
