/**
 * Tipos compartilhados entre entidades do domínio RIZO.
 */

/** Direção de uma variação (usada por indicadores de tendência). */
export type TrendDirection = 'up' | 'down' | 'neutral';

/** Status genérico de saúde de um indicador. */
export type HealthStatus = 'above' | 'on-track' | 'below';

/** Período de análise selecionável no header. */
export type PeriodRange =
  'this-month' | 'last-month' | 'quarter' | 'year' | 'custom';

/** Ponto genérico de série temporal. */
export interface TimeSeriesPoint {
  /** Rótulo do eixo X (ex.: "Jan", "10/07"). */
  label: string;
  /** Data ISO de referência do ponto. */
  date: string;
  value: number;
}

/** Item nomeado com valor — base para rankings e distribuições. */
export interface NamedValue {
  id: string;
  name: string;
  value: number;
}

/** Envelope padrão de resposta da camada de dados. */
export interface DataResult<T> {
  data: T;
  /** Momento em que os dados foram sincronizados. */
  syncedAt: string;
}
