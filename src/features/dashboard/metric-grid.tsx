import type { MetricCard as MetricCardType } from '@/interfaces';
import { MetricCard } from './metric-card';

/** Grade responsiva de cards de métrica. */
export function MetricGrid({ metrics }: { metrics: MetricCardType[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  );
}
