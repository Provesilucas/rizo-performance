import { Suspense } from 'react';
import { Building2, DollarSign, Handshake } from 'lucide-react';

import { SectionHeader, StatCard } from '@/components/shared';
import { BrandCard } from '@/features/brands/brand-card';
import { CardsPageSkeleton } from '@/features/shared/page-skeletons';
import { brandsService } from '@/services';
import { formatCurrencyCompact } from '@/lib/format';
import { parsePeriod } from '@/lib/periods';
import type { PeriodRange } from '@/interfaces';

export const metadata = { title: 'Marcas' };

interface PageProps {
  searchParams: { period?: string };
}

async function BrandsContent({ period }: { period: PeriodRange }) {
  const { data } = await brandsService.list(period);

  const totalRevenue = data.reduce((s, b) => s + b.revenue, 0);
  const activeContracts = data.reduce((s, b) => s + b.activeContracts, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Marcas" value={String(data.length)} icon={Building2} />
        <StatCard
          label="Receita total"
          value={formatCurrencyCompact(totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          label="Contratos ativos"
          value={String(activeContracts)}
          icon={Handshake}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}

export default function BrandsPage({ searchParams }: PageProps) {
  const period = parsePeriod(searchParams.period);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Marcas"
        description="Desempenho e relacionamento com as marcas parceiras."
      />
      <Suspense key={period} fallback={<CardsPageSkeleton />}>
        <BrandsContent period={period} />
      </Suspense>
    </div>
  );
}
