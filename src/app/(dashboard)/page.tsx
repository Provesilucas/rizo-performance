import { Suspense } from 'react';
import { CalendarClock, FilePlus2, Wallet } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertBanner, StatCard } from '@/components/shared';
import { GoalEvolutionCard } from '@/features/dashboard/goal-evolution-card';
import { DashboardSkeleton } from '@/features/dashboard/dashboard-skeleton';
import { RevenueChart } from '@/features/financial/revenue-chart';
import { DistributionList } from '@/features/financial/distribution-list';
import { TopInfluencers } from '@/features/influencers/top-influencers';
import { MetasComerciais } from '@/features/commercial/metas-comerciais';
import { ExternalHubHighlight } from '@/features/commercial/external-hub-highlight';
import {
  TopComercialCard,
  resolveTopSeller,
} from '@/features/commercial/top-comercial-card';
import {
  commercialService,
  contractsService,
  dashboardService,
  financialService,
  influencersService,
} from '@/services';
import { formatCurrencyCompact } from '@/lib/format';
import { parsePeriod } from '@/lib/periods';
import type { PeriodRange } from '@/interfaces';

export const metadata = { title: 'Visão Geral' };

interface PageProps {
  searchParams: { period?: string };
}

/** Data de referência dos dados simulados. */
const REFERENCE_DATE = new Date('2026-07-11');
const EXPIRY_WINDOW_DAYS = 60;

async function DashboardContent({ period }: { period: PeriodRange }) {
  // Visão Geral multi-domínio: cruza comercial, financeiro, contratos e
  // influenciadores numa leitura executiva única.
  const [overview, financial, contracts, commercial, influencers] =
    await Promise.all([
      dashboardService.getOverview(period),
      financialService.getData(period),
      contractsService.list(period),
      commercialService.getData(period),
      influencersService.list(period),
    ]);

  const monthInstances = overview.data.goalEvolution.month;
  const monthSummary = (
    monthInstances.find((i) => i.isCurrent) ??
    monthInstances[monthInstances.length - 1]!
  ).summary;

  const newContracts = overview.data.metrics.find(
    (m) => m.id === 'contratos-fechados',
  );

  const topSeller = resolveTopSeller(commercial.data.salespeople);

  // Receita acumulada no ano (soma do recebido mensal).
  const yearRevenue = financial.data.monthlyRevenue.reduce(
    (sum, m) => sum + m.received,
    0,
  );

  // Contratos a encerrar em até 60 dias (ou já encerrados e ainda ativos).
  const limit = new Date(REFERENCE_DATE);
  limit.setDate(limit.getDate() + EXPIRY_WINDOW_DAYS);
  const expiring = contracts.data.filter((c) => {
    if (!c.endsAt || c.status === 'completed' || c.status === 'canceled') {
      return false;
    }
    return new Date(c.endsAt) <= limit;
  }).length;

  return (
    <div className="space-y-8">
      {expiring > 0 && (
        <AlertBanner
          message={
            <>
              Você tem <strong>{expiring} contratos</strong> a encerrar em 60
              dias ou já encerrados.
            </>
          }
          actionLabel="Ver contratos"
          actionHref="/contratos"
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Previsão do mês"
          value={formatCurrencyCompact(monthSummary.projection)}
          icon={CalendarClock}
          delta={monthSummary.paceDiff}
          deltaLabel="vs. ritmo esperado"
        />
        <StatCard
          label="Novos contratos no mês"
          value={String(newContracts?.value ?? 0)}
          icon={FilePlus2}
          delta={newContracts?.deltaPercent}
          deltaLabel="vs. mês anterior"
        />
        <TopComercialCard seller={topSeller} />
        <StatCard
          label="Acumulado no ano"
          value={formatCurrencyCompact(yearRevenue)}
          icon={Wallet}
          delta={9.4}
          deltaLabel="vs. ano anterior"
        />
      </div>

      {/* Prioridade 1: evolução da meta */}
      <GoalEvolutionCard ranges={overview.data.goalEvolution} />

      {/* Prioridade 2: faturamento da agência (largura total, em destaque) */}
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Faturamento da agência</CardTitle>
          <CardDescription>
            Receita mensal — recebido x previsto, com comparativo do ano anterior.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <RevenueChart data={financial.data.monthlyRevenue} />
        </CardContent>
      </Card>

      {/* Aposta estratégica, agora abaixo das prioridades */}
      <ExternalHubHighlight hub={commercial.data.externalHub} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MetasComerciais salespeople={commercial.data.salespeople} />

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Top marcas fechadas</CardTitle>
            <CardDescription>
              Marcas com maior valor fechado no período.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <DistributionList items={financial.data.revenueByBrand} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Top setores fechados</CardTitle>
            <CardDescription>
              Segmentos com maior faturamento (beleza, alimentos, varejo…).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <DistributionList items={financial.data.revenueBySector} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Top influenciadores</CardTitle>
            <CardDescription>
              Principais influenciadores por receita no ano.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <TopInfluencers influencers={influencers.data} limit={6} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage({ searchParams }: PageProps) {
  const period = parsePeriod(searchParams.period);

  return (
    <Suspense key={period} fallback={<DashboardSkeleton />}>
      <DashboardContent period={period} />
    </Suspense>
  );
}
