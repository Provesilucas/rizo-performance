import { Suspense } from 'react';
import { CheckCircle2, FileText, Scale } from 'lucide-react';

import { SectionHeader, StatCard } from '@/components/shared';
import { ContractsTable } from '@/features/contracts/contracts-table';
import {
  LegalRiskCard,
  summarizeLegal,
} from '@/features/contracts/legal-risk-card';
import { TablePageSkeleton } from '@/features/shared/page-skeletons';
import { contractsService } from '@/services';
import { formatCurrencyCompact } from '@/lib/format';
import { parsePeriod } from '@/lib/periods';
import type { PeriodRange } from '@/interfaces';

export const metadata = { title: 'Contratos' };

interface PageProps {
  searchParams: { period?: string };
}

async function ContractsContent({ period }: { period: PeriodRange }) {
  const { data } = await contractsService.list(period);

  const totalValue = data.reduce((sum, c) => sum + c.value, 0);
  const signed = data.filter(
    (c) => c.status === 'signed' || c.status === 'active',
  ).length;
  const legal = summarizeLegal(data);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Valor total"
          value={formatCurrencyCompact(totalValue)}
          icon={FileText}
        />
        <StatCard
          label="Ativos / assinados"
          value={String(signed)}
          icon={CheckCircle2}
        />
        <StatCard
          label="Requerem revisão jurídica"
          value={String(legal.needsReview)}
          icon={Scale}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <LegalRiskCard contracts={data} />
        </div>
        <div className="lg:col-span-2">
          <ContractsTable contracts={data} />
        </div>
      </div>
    </div>
  );
}

export default function ContractsPage({ searchParams }: PageProps) {
  const period = parsePeriod(searchParams.period);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Contratos"
        description="Gestão de todos os contratos da agência."
      />
      <Suspense key={period} fallback={<TablePageSkeleton />}>
        <ContractsContent period={period} />
      </Suspense>
    </div>
  );
}
