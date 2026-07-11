'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  GitCompareArrows,
  Info,
  TrendingUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressBar } from '@/components/shared/progress-bar';
import type { GoalPeriodInstance, GoalRange } from '@/interfaces';
import { formatCurrencyCompact, formatPercent } from '@/lib/format';
import { GoalEvolutionChart } from './goal-evolution-chart';
import { goalStatusPresentation } from './goal-status';

interface GoalEvolutionCardProps {
  ranges: Record<GoalRange, GoalPeriodInstance[]>;
}

const RANGE_OPTIONS: { value: GoalRange; label: string; targetLabel: string }[] =
  [
    { value: 'month', label: 'Mês', targetLabel: 'Meta do mês' },
    { value: 'quarter', label: 'Trimestre', targetLabel: 'Meta do trimestre' },
    { value: 'semester', label: 'Semestre', targetLabel: 'Meta do semestre' },
    { value: 'year', label: 'Ano', targetLabel: 'Meta do ano' },
  ];

const LEGEND = [
  { label: 'Meta acumulada', className: 'bg-chart-5' },
  { label: 'Realizado', className: 'bg-chart-1' },
  { label: 'Projeção', className: 'bg-chart-2' },
];

/** Quantidade de instâncias por ano em cada granularidade. */
const PERIODS_PER_YEAR: Record<GoalRange, number> = {
  month: 12,
  quarter: 4,
  semester: 2,
  year: 1,
};

/** Índice da instância corrente (fallback: a mais recente). */
function currentIndex(instances: GoalPeriodInstance[]): number {
  const i = instances.findIndex((inst) => inst.isCurrent);
  return i >= 0 ? i : instances.length - 1;
}

function SummaryStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-semibold tabular-nums text-foreground">
        {value}
      </p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function GoalEvolutionCard({ ranges }: GoalEvolutionCardProps) {
  const [range, setRange] = React.useState<GoalRange>('month');
  // Índice do período selecionado por granularidade (default: o corrente).
  const [indices, setIndices] = React.useState<Record<GoalRange, number>>(
    () => ({
      month: currentIndex(ranges.month),
      quarter: currentIndex(ranges.quarter),
      semester: currentIndex(ranges.semester),
      year: currentIndex(ranges.year),
    }),
  );

  const [compare, setCompare] = React.useState(false);

  const option =
    RANGE_OPTIONS.find((o) => o.value === range) ?? RANGE_OPTIONS[0]!;
  const instances = ranges[range];
  const index = indices[range];
  const instance = instances[index]!;
  const { series, summary } = instance;
  const status = goalStatusPresentation(summary.status);

  // Mesmo período do ano anterior (uma "volta" de instâncias atrás).
  const compareInstance =
    index - PERIODS_PER_YEAR[range] >= 0
      ? instances[index - PERIODS_PER_YEAR[range]]
      : undefined;
  const showCompare = compare && !!compareInstance;

  const move = (delta: number) =>
    setIndices((prev) => ({
      ...prev,
      [range]: Math.min(Math.max(prev[range] + delta, 0), instances.length - 1),
    }));

  // Rótulo de situação do período (fechamento).
  const periodState = instance.isCurrent
    ? { label: 'Em andamento', variant: 'secondary' as const }
    : summary.expectedPercent >= 100
      ? { label: 'Encerrado', variant: 'outline' as const }
      : { label: 'Futuro', variant: 'secondary' as const };

  return (
    <Card>
      <CardHeader className="gap-4 border-b border-border/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Evolução da Meta</CardTitle>
              <Badge variant={status.variant}>{status.label}</Badge>
              <Badge variant={periodState.variant}>{periodState.label}</Badge>
            </div>
            <CardDescription>
              Meta acumulada, realizado e projeção — navegue entre períodos para
              fechamento.
            </CardDescription>
          </div>
          <Tabs
            value={range}
            onValueChange={(v) => setRange(v as GoalRange)}
            className="shrink-0"
          >
            <TabsList>
              {RANGE_OPTIONS.map((o) => (
                <TabsTrigger key={o.value} value={o.value}>
                  {o.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => move(-1)}
              disabled={index === 0}
              aria-label="Período anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[9.5rem] text-center text-sm font-medium text-foreground">
              {instance.label}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => move(1)}
              disabled={index === instances.length - 1}
              aria-label="Próximo período"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {compareInstance && (
              <Button
                variant={compare ? 'default' : 'outline'}
                size="sm"
                className="h-8 gap-1.5"
                aria-pressed={compare}
                onClick={() => setCompare((v) => !v)}
              >
                <GitCompareArrows className="h-4 w-4" />
                Comparar {compareInstance.label}
              </Button>
            )}
            <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 lg:flex">
              {LEGEND.map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span className={`h-2 w-2 rounded-full ${item.className}`} />
                  {item.label}
                </span>
              ))}
              {showCompare && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-chart-4" />
                  {compareInstance!.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <GoalEvolutionChart
          series={series}
          labelPrefix={range === 'month' ? 'Dia ' : ''}
          compareSeries={showCompare ? compareInstance!.series : undefined}
          compareName={compareInstance?.label}
        />

        <div className="mt-6 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="flex items-start gap-2.5">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm font-medium text-foreground">
              {summary.message}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                Realizado {formatPercent(summary.realizedPercent)}
                <Info className="h-3 w-3" />
              </span>
              <span>
                Ritmo esperado {formatPercent(summary.expectedPercent)}
              </span>
            </div>
            <ProgressBar
              value={summary.realizedPercent}
              marker={summary.expectedPercent}
              indicatorClassName={status.bar}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryStat
            label={option.targetLabel}
            value={formatCurrencyCompact(summary.monthlyTarget)}
          />
          <SummaryStat
            label="Realizado"
            value={formatCurrencyCompact(summary.realized)}
            hint={formatPercent(summary.realizedPercent)}
          />
          <SummaryStat
            label="Projeção"
            value={formatCurrencyCompact(summary.projection)}
            hint={`${summary.projection >= summary.monthlyTarget ? 'Acima' : 'Abaixo'} da meta`}
          />
          <SummaryStat
            label="Diferença de ritmo"
            value={`${summary.paceDiff > 0 ? '+' : ''}${formatPercent(summary.paceDiff)}`}
            hint="realizado − esperado"
          />
        </div>
      </CardContent>
    </Card>
  );
}
