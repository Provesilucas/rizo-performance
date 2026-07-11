import type { ContractStatus } from '@/interfaces';
import type { BadgeProps } from '@/components/ui/badge';

interface StatusMeta {
  label: string;
  variant: NonNullable<BadgeProps['variant']>;
}

export const CONTRACT_STATUS_META: Record<ContractStatus, StatusMeta> = {
  draft: { label: 'Rascunho', variant: 'secondary' },
  sent: { label: 'Enviado', variant: 'warning' },
  signed: { label: 'Assinado', variant: 'success' },
  active: { label: 'Ativo', variant: 'default' },
  completed: { label: 'Concluído', variant: 'outline' },
  canceled: { label: 'Cancelado', variant: 'destructive' },
};

/** Abas de filtro por status (com "todos"). */
export const CONTRACT_FILTERS: {
  value: ContractStatus | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'signed', label: 'Assinados' },
  { value: 'sent', label: 'Enviados' },
  { value: 'draft', label: 'Rascunhos' },
  { value: 'completed', label: 'Concluídos' },
];
