import { Suspense } from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

import { SectionHeader, StatCard } from '@/components/shared';
import { ReceivablesTable } from '@/features/receivables/receivables-table';
import { TablePageSkeleton } from '@/features/shared/page-skeletons';
import { receivablesService } from '@/services';
import { formatCurrencyCompact } from '@/lib/format';
import { parsePeriod } from '@/lib/periods';
import type { PeriodRange } from '@/interfaces';

export const metadata = { title: 'Recebimentos' };

interface PageProps {
  searchParams: { period?: string };
}

async function ReceivablesContent({ period }: { period: PeriodRange }) {
  const { data } = await receivablesService.list(period);

  const sum = (status: (typeof data)[number]['status']) =>
    data.filter((r) => r.status === status).reduce((s, r) => s + r.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="A vencer"
          value={formatCurrencyCompact(sum('pending'))}
          icon={Clock}
        />
        <StatCard
          label="Vencidos"
          value={formatCurrencyCompact(sum('overdue'))}
          icon={AlertCircle}
        />
        <StatCard
          label="Recebidos"
          value={formatCurrencyCompact(sum('paid'))}
          icon={CheckCircle2}
        />
      </div>
      <ReceivablesTable rows={data} />
    </div>
  );
}

export default function ReceivablesPage({ searchParams }: PageProps) {
  const period = parsePeriod(searchParams.period);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Recebimentos"
        description="Controle de contas a receber e pagamentos em atraso."
      />
      <Suspense key={period} fallback={<TablePageSkeleton />}>
        <ReceivablesContent period={period} />
      </Suspense>
    </div>
  );
}
