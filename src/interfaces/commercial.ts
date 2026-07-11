import type { TimeSeriesPoint } from './common';

/**
 * Etapas do funil comercial da RIZO. Enxuto para a realidade de fechar
 * poucos deals de alto valor com marcas.
 */
export type FunnelStageKey =
  | 'prospeccoes'
  | 'reunioes'
  | 'propostas'
  | 'negociacao'
  | 'fechados'
  | 'perdidos';

/** Uma etapa do funil comercial com métricas agregadas. */
export interface FunnelStage {
  key: FunnelStageKey;
  label: string;
  /** Quantidade de oportunidades nesta etapa. */
  count: number;
  /** Valor total (pipeline) associado à etapa. */
  value: number;
  /** Conversão em relação à etapa anterior (0-100). */
  conversionFromPrevious: number | null;
}

/** Origem do lead que gerou o negócio. */
export type DealSource = 'prospeccao' | 'inbound';

/** Distribuição do faturamento de um comercial por origem. */
export interface SalespersonSource {
  source: DealSource;
  label: string;
  value: number;
  jobs: number;
  /** Participação no total do comercial (0-100). */
  share: number;
}

/**
 * Um comercial da agência (ex.: Djony, Nicole). Consolida realizado do mês,
 * acumulado do ano e o breakdown por origem — base para metas e ranking.
 */
export interface Salesperson {
  id: string;
  name: string;
  /** Meta mensal (R$). Editável pelo usuário. */
  monthlyGoal: number;
  /** Valor fechado no mês corrente. */
  closedValueMonth: number;
  /** Valor fechado acumulado no ano. */
  closedValueYear: number;
  /** Contratos fechados no mês. */
  contractsMonth: number;
  /** Contratos fechados no ano. */
  contractsYear: number;
  averageTicket: number;
  bySource: SalespersonSource[];
  /** Maior job do período. */
  biggestJob: { name: string; value: number };
}

/** Um job fechado por influenciador fora do casting (Hub externo). */
export interface ExternalHubJob {
  handle: string;
  brand: string;
  value: number;
}

/**
 * Faturamento vindo de influenciadores fora do casting exclusivo da agência.
 * Aposta estratégica ("virada de chave") para a saúde financeira.
 */
export interface ExternalHub {
  total: number;
  jobs: number;
  /** Influenciadores externos distintos que fecharam no período. */
  influencers: number;
  /** Participação no faturamento total (0-100). */
  sharePercent: number;
  /** Meta de faturamento externo do período. */
  target: number;
  /** Crescimento vs. período anterior (%). */
  growthPercent: number;
  /** Evolução mensal do faturamento externo. */
  monthly: TimeSeriesPoint[];
  items: ExternalHubJob[];
}

export interface CommercialData {
  funnel: FunnelStage[];
  /** Comerciais da agência (metas, realizado, breakdown). */
  salespeople: Salesperson[];
  externalHub: ExternalHub;
  /** Pipeline total em aberto. */
  totalPipeline: number;
  /** Conversão global prospecção -> fechamento (0-100). */
  globalConversion: number;
}
