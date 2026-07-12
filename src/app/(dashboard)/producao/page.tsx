import { Suspense } from 'react';
import { CheckCircle2, Clapperboard, Gauge, PencilRuler } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SectionHeader, StatCard } from '@/components/shared';
import { DistributionList } from '@/features/financial/distribution-list';
import { ProductionChart } from '@/features/production/production-chart';
import { QualityChecks } from '@/features/production/quality-checks';
import { CreatorTable } from '@/features/production/creator-table';
import { ChartsPageSkeleton } from '@/features/shared/page-skeletons';
import { productionService } from '@/services';
import { formatNumber, formatPercent } from '@/lib/format';
import { parsePeriod } from '@/lib/periods';
import type { PeriodRange } from '@/interfaces';

export const metadata = { title: 'Produção' };

interface PageProps {
  searchParams: { period?: string };
}

async function ProductionContent({ period }: { period: PeriodRange }) {
  const { data } = await productionService.getData(period);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Vídeos entregues"
          value={formatNumber(data.videosDelivered)}
          icon={Clapperboard}
          delta={4.9}
          deltaLabel="vs. mês anterior"
        />
        <StatCard
          label="Retenção média"
          value={`${data.avgRetention.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}/10`}
          icon={Gauge}
          delta={1.3}
          deltaLabel="vs. mês anterior"
        />
        <StatCard
          label="Aprovação no QC"
          value={formatPercent(data.qcApprovalRate, 0)}
          icon={CheckCircle2}
          delta={2.4}
          deltaLabel="controle de qualidade"
        />
        <StatCard
          label="Apenas planejados"
          value={formatNumber(data.planningOnly)}
          icon={PencilRuler}
          deltaLabel="brief sem render"
        />
      </div>

      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Produção &amp; retenção</CardTitle>
          <CardDescription>
            Vídeos entregues por mês e evolução da nota de retenção prevista.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ProductionChart data={data.monthly} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Produção por criador</CardTitle>
            <CardDescription>Perfis internos da agência.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CreatorTable rows={data.byCreator} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Controle de qualidade</CardTitle>
            <CardDescription>
              Taxa de aprovação em cada checagem antes da entrega.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <QualityChecks checks={data.qualityChecks} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Temas mais produzidos</CardTitle>
          <CardDescription>
            Assuntos recorrentes nos conteúdos do período.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <DistributionList items={data.topThemes} format="number" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProductionPage({ searchParams }: PageProps) {
  const period = parsePeriod(searchParams.period);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Produção de conteúdo"
        description="Desempenho do pipeline de edição — Rizo Director AI."
      />
      <Suspense key={period} fallback={<ChartsPageSkeleton />}>
        <ProductionContent period={period} />
      </Suspense>
    </div>
  );
}
