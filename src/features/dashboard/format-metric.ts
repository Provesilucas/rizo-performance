import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from '@/lib/format';
import type { MetricCard } from '@/interfaces';

/** Formata o valor de uma métrica conforme o `format` declarado. */
export function formatMetricValue(metric: MetricCard): string {
  switch (metric.format) {
    case 'currency':
      return formatCurrency(metric.value);
    case 'currency-compact':
      return formatCurrencyCompact(metric.value);
    case 'percent':
      return formatPercent(metric.value);
    case 'number':
      return formatNumber(metric.value);
    default:
      return String(metric.value);
  }
}
