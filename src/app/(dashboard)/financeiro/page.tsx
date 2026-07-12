import { Suspense } from 'react';
import { AlertCircle, Receipt, Wallet, Clock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SectionHeader, StatCard } from '@/components/shared';
import {
  SimpleAreaChart,
  SimpleBarChart,
} from '@/components/charts/simple-charts';
import { RevenueChart } from '@/features/financial/revenue-chart';
import { DistributionList } from '@/features/financial/distribution-list';
import { ReceivablesBuckets } from '@/features/financial/receivables-buckets';
import { ChartsPageSkeleton } from '@/features/shared/page-skeletons';
import { financialService } from '@/services';
import { formatCurrency, formatCurrencyCompact } from '@/lib/format';
import { parsePeriod } from '@/lib/periods';
import type { PeriodRange } from '@/interfaces';

export const metadata = { title: 'Financeiro' };

interface PageProps {
  searchParams: { period?: string };
}

async function FinancialContent({ period }: { period: PeriodRange }) {
  const { data } = await financialService.getData(period);
  const current = data.monthlyRevenue[data.monthlyRevenue.length - 1];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Recebido no mês"
          value={formatCurrencyCompact(current?.received ?? 0)}
          icon={Wallet}
          delta={6.2}
          deltaLabel="vs. mês anterior"
        />
        <StatCard
          label="A receber"
          value={formatCurrencyCompact(data.totalReceivable)}
          icon={Clock}
          delta={4.8}
          deltaLabel="em aberto"
        />
        <StatCard
          label="Vencidos"
          value={formatCurrencyCompact(data.totalOverdue)}
          icon={AlertCircle}
          delta={-12.5}
          deltaLabel="vs. mês anterior"
          invertDelta
        />
        <StatCard
          label="Ticket médio"
          value={formatCurrency(current?.averageTicket ?? 0)}
          icon={Receipt}
          delta={3.1}
          deltaLabel="vs. mês anterior"
        />
      </div>

      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Receita mensal</CardTitle>
          <CardDescription>
            Recebido x previsto nos últimos meses.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <RevenueChart data={data.monthlyRevenue} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Contratos fechados</CardTitle>
            <CardDescription>
              Volume mensal de contratos assinados.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <SimpleBarChart
              data={data.monthlyRevenue}
              dataKey="contracts"
              name="Contratos"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Ticket médio</CardTitle>
            <CardDescription>
              Evolução do valor médio por contrato.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <SimpleAreaChart
              data={data.monthlyRevenue}
              dataKey="averageTicket"
              name="Ticket médio"
              format="currency-compact"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Receita por influenciador</CardTitle>
            <CardDescription>
              Participação no faturamento do período.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <DistributionList items={data.revenueByInfluencer} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Receita por marca</CardTitle>
            <CardDescription>
              Participação no faturamento do período.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <DistributionList items={data.revenueByBrand} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Contas a receber</CardTitle>
            <CardDescription>
              Distribuição por faixa de vencimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ReceivablesBuckets buckets={data.receivableBuckets} />
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/[0.03]">
          <CardHeader className="border-b border-destructive/20">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Recebimentos vencidos
            </CardTitle>
            <CardDescription>
              Total em atraso que requer atenção.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-destructive">
              {formatCurrency(data.totalOverdue)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {
                data.receivableBuckets.filter((b) => b.status === 'overdue')
                  .length
              }{' '}
              faixas com pendências ·{' '}
              {data.receivableBuckets
                .filter((b) => b.status === 'overdue')
                .reduce((sum, b) => sum + b.count, 0)}{' '}
              recebimentos
            </p>
            <div className="mt-4">
              <ReceivablesBuckets
                buckets={data.receivableBuckets.filter(
                  (b) => b.status === 'overdue',
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function FinancialPage({ searchParams }: PageProps) {
  const period = parsePeriod(searchParams.period);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Financeiro"
        description="Receita, recebimentos e saúde financeira da agência."
      />
      <Suspense key={period} fallback={<ChartsPageSkeleton />}>
        <FinancialContent period={period} />
      </Suspense>
    </div>
  );
}
