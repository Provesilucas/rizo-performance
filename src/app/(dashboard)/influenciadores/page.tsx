import { Suspense } from 'react';
import { Megaphone, TrendingUp, Users } from 'lucide-react';

import { StatCard } from '@/components/shared';
import { InfluencerCard } from '@/features/influencers/influencer-card';
import { CardsPageSkeleton } from '@/features/shared/page-skeletons';
import { influencersService } from '@/services';
import { formatCurrencyCompact } from '@/lib/format';
import { parsePeriod } from '@/lib/periods';
import type { PeriodRange } from '@/interfaces';

export const metadata = { title: 'Influenciadores' };

interface PageProps {
  searchParams: { period?: string };
}

async function InfluencersContent({ period }: { period: PeriodRange }) {
  const { data } = await influencersService.list(period);

  const totalRevenue = data.reduce((s, i) => s + i.revenue, 0);
  const activeCampaigns = data.reduce((s, i) => s + i.activeCampaigns, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Influenciadores ativos"
          value={String(data.length)}
          icon={Users}
        />
        <StatCard
          label="Faturamento total"
          value={formatCurrencyCompact(totalRevenue)}
          icon={TrendingUp}
        />
        <StatCard
          label="Campanhas ativas"
          value={String(activeCampaigns)}
          icon={Megaphone}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((influencer) => (
          <InfluencerCard key={influencer.id} influencer={influencer} />
        ))}
      </div>
    </div>
  );
}

export default function InfluencersPage({ searchParams }: PageProps) {
  const period = parsePeriod(searchParams.period);

  return (
    <Suspense key={period} fallback={<CardsPageSkeleton />}>
      <InfluencersContent period={period} />
    </Suspense>
  );
}
