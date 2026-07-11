/**
 * Parâmetros base dos dados simulados.
 * Mantidos num único ponto para manter os mocks coerentes entre si.
 */
export const MOCK_REFERENCE = {
  /** Data de referência dos dados simulados. */
  year: 2026,
  /** Mês 0-based (6 = Julho). */
  month: 6,
  currentDay: 10,
  daysInMonth: 31,
  /** Meta mensal da agência (R$). */
  monthlyTarget: 1_500_000,
  /** Valor fechado acumulado no mês (R$). */
  realized: 535_000,
  /** Projeção de fechamento do mês (R$). */
  projection: 1_658_000,
} as const;

/** Percentual do mês decorrido até a data de referência. */
export const MONTH_ELAPSED_PERCENT = Number(
  ((MOCK_REFERENCE.currentDay / MOCK_REFERENCE.daysInMonth) * 100).toFixed(1),
);

/** Timestamp da "última sincronização" simulada. */
export const MOCK_SYNCED_AT = new Date(
  MOCK_REFERENCE.year,
  MOCK_REFERENCE.month,
  MOCK_REFERENCE.currentDay,
  9,
  42,
).toISOString();
