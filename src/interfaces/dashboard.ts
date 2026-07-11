import type { HealthStatus, TimeSeriesPoint, TrendDirection } from './common';

/** Uma métrica de destaque exibida como card no dashboard. */
export interface MetricCard {
  id: string;
  label: string;
  /** Valor já numérico (a formatação é responsabilidade da UI). */
  value: number;
  /** Formato de exibição sugerido. */
  format: 'currency' | 'currency-compact' | 'percent' | 'number';
  /** Variação percentual vs. período anterior (opcional). */
  deltaPercent?: number;
  deltaDirection?: TrendDirection;
  /** Texto do comparativo. Ex.: "vs. mês anterior". */
  deltaLabel?: string;
  /** Identificador do ícone (mapeado na UI). */
  icon: string;
  /** Texto do tooltip explicativo. */
  tooltip: string;
  /** Quando `true`, uma variação negativa é considerada positiva. */
  invertDelta?: boolean;
}

/** Ponto da série "Evolução da Meta". */
export interface GoalEvolutionPoint extends TimeSeriesPoint {
  /** Meta acumulada esperada até esta data. */
  target: number;
  /** Valor realizado acumulado. */
  realized: number | null;
  /** Projeção acumulada (após "hoje"). */
  projection: number | null;
}

/** Resumo analítico da evolução da meta. */
export interface GoalEvolutionSummary {
  monthlyTarget: number;
  realized: number;
  projection: number;
  /** Percentual do mês já decorrido. */
  expectedPercent: number;
  /** Percentual da meta já realizado. */
  realizedPercent: number;
  /** Diferença de ritmo (realizado - esperado), em pontos percentuais. */
  paceDiff: number;
  status: HealthStatus;
  /** Mensagem automática interpretando o status. */
  message: string;
}

/** Granularidade de análise da "Evolução da Meta". */
export type GoalRange = 'month' | 'quarter' | 'semester' | 'year';

/**
 * Uma instância concreta de um período (ex.: "1º semestre 2026",
 * "Julho 2026"). Permite navegar para trás/frente e fazer fechamento
 * de períodos já encerrados.
 */
export interface GoalPeriodInstance {
  id: string;
  label: string;
  /** `true` quando o período contém a data de referência (hoje). */
  isCurrent: boolean;
  series: GoalEvolutionPoint[];
  summary: GoalEvolutionSummary;
}

export interface DashboardOverview {
  metrics: MetricCard[];
  /**
   * Instâncias de período por granularidade, ordenadas do mais antigo ao
   * mais recente. Ex.: `goalEvolution.semester = [S1 2026, S2 2026]`.
   */
  goalEvolution: Record<GoalRange, GoalPeriodInstance[]>;
}
