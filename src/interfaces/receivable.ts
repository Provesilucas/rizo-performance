export type ReceivableStatus = 'pending' | 'paid' | 'overdue';

/** Um recebimento individual (parcela/fatura). */
export interface Receivable {
  id: string;
  contractId: string;
  contractCode: string;
  brandName: string;
  influencerName: string;
  value: number;
  dueDate: string;
  paidAt: string | null;
  status: ReceivableStatus;
  /** Dias em atraso (0 se em dia/pago). */
  daysOverdue: number;
}
