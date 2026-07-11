import type { LegalStatus } from '@/interfaces';
import type { BadgeProps } from '@/components/ui/badge';

interface LegalStatusMeta {
  label: string;
  short: string;
  variant: NonNullable<BadgeProps['variant']>;
  /** Cor CSS para gráficos. */
  color: string;
}

export const LEGAL_STATUS_META: Record<LegalStatus, LegalStatusMeta> = {
  approved: {
    label: 'Aprovado',
    short: 'Aprovado',
    variant: 'success',
    color: 'hsl(var(--success))',
  },
  reservations: {
    label: 'Aprovado com ressalvas',
    short: 'Ressalvas',
    variant: 'warning',
    color: 'hsl(var(--warning))',
  },
  rejected: {
    label: 'Reprovado',
    short: 'Reprovado',
    variant: 'destructive',
    color: 'hsl(var(--destructive))',
  },
  pending: {
    label: 'Em análise',
    short: 'Em análise',
    variant: 'secondary',
    color: 'hsl(var(--chart-5))',
  },
};

/** Ordem de exibição do risco (mais grave primeiro). */
export const LEGAL_STATUS_ORDER: LegalStatus[] = [
  'rejected',
  'reservations',
  'approved',
  'pending',
];
