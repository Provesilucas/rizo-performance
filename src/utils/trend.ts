import type { TrendDirection } from '@/interfaces';

/** Resolve a direção de uma variação numérica. */
export function resolveTrend(delta: number): TrendDirection {
  if (delta > 0) return 'up';
  if (delta < 0) return 'down';
  return 'neutral';
}

/**
 * Determina se uma variação deve ser exibida como "positiva" (verde).
 * Para algumas métricas (ex.: valores vencidos, valor restante), uma
 * queda é o resultado desejado — nesses casos passe `invert = true`.
 */
export function isPositiveDelta(delta: number, invert = false): boolean {
  return invert ? delta < 0 : delta > 0;
}

/** Variação percentual entre dois valores. */
export function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}
