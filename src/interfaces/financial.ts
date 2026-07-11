import type { NamedValue } from './common';
import type { ReceivableStatus } from './receivable';

/** Receita mensal com previsto vs. recebido. */
export interface MonthlyRevenuePoint {
  label: string;
  date: string;
  /** Receita realizada/recebida no mês. */
  received: number;
  /** Receita prevista para o mês. */
  forecast: number;
  /** Receita recebida no mesmo mês do ano anterior (comparativo). */
  receivedPrevYear: number;
  /** Contratos fechados no mês. */
  contracts: number;
  /** Ticket médio do mês. */
  averageTicket: number;
}

/** Agregado de contas a receber por faixa de vencimento. */
export interface ReceivableBucket {
  /** Ex.: "A vencer", "1-15 dias", "16-30 dias", "+30 dias". */
  label: string;
  value: number;
  count: number;
  status: ReceivableStatus;
}

export interface FinancialData {
  monthlyRevenue: MonthlyRevenuePoint[];
  revenueByInfluencer: NamedValue[];
  /** Top marcas fechadas (por valor). */
  revenueByBrand: NamedValue[];
  /** Top setores/segmentos fechados (beleza, alimentos, varejo…). */
  revenueBySector: NamedValue[];
  receivableBuckets: ReceivableBucket[];
  /** Total a receber em aberto. */
  totalReceivable: number;
  /** Total vencido. */
  totalOverdue: number;
}
