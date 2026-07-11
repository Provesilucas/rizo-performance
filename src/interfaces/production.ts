import type { NamedValue, TimeSeriesPoint } from './common';

/**
 * Produção de conteúdo — reflete o pipeline do Rizo Director AI:
 * transcrição → diagnóstico criativo (nota de retenção) → edição →
 * controle de qualidade (9 checagens) → entrega.
 */

/** Perfis/criadores internos da agência (a "voz" criativa). */
export type CreatorProfile = 'lucas' | 'yasmin' | 'rizo';

/** Produção agregada por criador. */
export interface ProductionByCreator {
  id: string;
  name: string;
  profile: CreatorProfile;
  /** Vídeos entregues no período. */
  videos: number;
  /** Nota média de retenção prevista (0-10). */
  avgRetention: number;
  /** Taxa de aprovação no controle de qualidade (0-100). */
  qcApprovalRate: number;
}

/** Série mensal de produção. */
export interface ProductionMonthlyPoint extends TimeSeriesPoint {
  videos: number;
  avgRetention: number;
}

/** Desempenho de uma checagem do controle de qualidade. */
export interface QualityCheckStat {
  /** Nome da checagem (ex.: "Hook começa forte"). */
  item: string;
  /** Percentual de vídeos que passaram (0-100). */
  passRate: number;
}

export interface ContentProduction {
  /** Vídeos entregues no período. */
  videosDelivered: number;
  /** Nota média de retenção prevista (0-10). */
  avgRetention: number;
  /** Taxa geral de aprovação no controle de qualidade (0-100). */
  qcApprovalRate: number;
  /** Vídeos apenas planejados (brief + timeline, sem render). */
  planningOnly: number;
  byCreator: ProductionByCreator[];
  monthly: ProductionMonthlyPoint[];
  qualityChecks: QualityCheckStat[];
  /** Temas mais recorrentes nos conteúdos. */
  topThemes: NamedValue[];
}
