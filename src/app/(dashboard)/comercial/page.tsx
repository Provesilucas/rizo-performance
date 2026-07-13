import { Suspense } from 'react';
import { Filter, TrendingUp, Wallet } from 'lucide-react';

import { SectionHeader, StatCard } from '@/components/shared';
import { FunnelChart } from '@/features/commercial/funnel-chart';
import { MetasComerciais } from '@/features/commercial/metas-comerciais';
import {
  TopComercialCard,
  resolveTopSeller,
} from '@/features/commercial/top-comercial-card';
import {
  ExternalHubCard,
  SalespersonBreakdown,
} from '@/features/commercial/salesperson-breakdown';
import { TablePageSkeleton } from '@/features/shared/page-skeletons';
import { commercialService } from '@/services';
import { formatCurrencyCompact, formatPercent } from '@/lib/format';
import { parsePeriod } from '@/lib/periods';
import type { PeriodRange } from '@/interfaces';

export const metadata = { title: 'Comercial' };

interface PageProps {
  searchParams: { period?: string };
}

async function CommercialContent({ period }: { period: PeriodRange }) {
  const { data } = await commercialService.getData(period);

  const topSeller = resolveTopSeller(data.salespeople);
  const yearTotal = data.salespeople.reduce(
    (sum, s) => sum + s.closedValueYear,
    0,
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TopComercialCard seller={topSeller} />
        <StatCard
          label="Acumulado no ano"
          value={formatCurrencyCompact(yearTotal)}
          icon={Wallet}
          delta={11.2}
          deltaLabel="vs. ano anterior"
        />
        <StatCard
          label="Pipeline em aberto"
          value={formatCurrencyCompact(data.totalPipeline)}
          icon={Filter}
        />
        <StatCard
          label="Conversão global"
          value={formatPercent(data.globalConversion)}
          icon={TrendingUp}
          deltaLabel="prospecção → fechado"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MetasComerciais salespeople={data.salespeople} />
        <FunnelChart stages={data.funnel} />
      </div>

      <SectionHeader
        title="Breakdown por comercial"
        description="Origem dos negócios, ticket médio e maior job no período."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {data.salespeople.map((person) => (
          <SalespersonBreakdown key={person.id} person={person} />
        ))}
        <ExternalHubCard hub={data.externalHub} />
      </div>
    </div>
  );
}

export default function CommercialPage({ searchParams }: PageProps) {
  const period = parsePeriod(searchParams.period);

  return (
    <Suspense key={period} fallback={<TablePageSkeleton />}>
      <CommercialContent period={period} />
    </Suspense>
  );
}
