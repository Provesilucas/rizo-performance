import type {
  DashboardOverview,
  GoalPeriodInstance,
  GoalRange,
  MetricCard,
} from '@/interfaces';
import {
  buildGoalEvolutionSeries,
  buildMonthlyGoalSeries,
  computeGoalSummary,
} from '@/utils';
import { MOCK_REFERENCE, MONTH_ELAPSED_PERCENT } from './config';

const { monthlyTarget, realized, projection } = MOCK_REFERENCE;

const MONTH_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];
const MONTH_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const CUR_YEAR = MOCK_REFERENCE.year; // 2026
const CUR_MONTH = MOCK_REFERENCE.month; // 6 (Jul)
/** Data de referência ("hoje") dos dados simulados. */
const REF = new Date(CUR_YEAR, CUR_MONTH, MOCK_REFERENCE.currentDay).getTime();

// Valor fechado por mês (meses completos). Jul/2026 é parcial (= realized).
const CLOSED_FULL_2026 = [
  1_420_000, 1_380_000, 1_550_000, 1_610_000, 1_660_000, 1_720_000,
];
const CLOSED_2025 = [
  1_300_000, 1_250_000, 1_400_000, 1_450_000, 1_500_000, 1_550_000,
  1_600_000, 1_580_000, 1_620_000, 1_680_000, 1_720_000, 1_800_000,
];

/** Valor fechado de um mês (`null` = mês futuro sem realizado). */
function realizedForMonth(year: number, month: number): number | null {
  if (year < CUR_YEAR) return CLOSED_2025[month] ?? 0;
  if (month < CUR_MONTH) return CLOSED_FULL_2026[month] ?? 0;
  if (month === CUR_MONTH) return realized; // mês corrente (parcial)
  return null; // futuro
}

/** Percentual do período já decorrido, relativo à data de referência. */
function elapsedPercentForRange(
  year: number,
  firstMonth: number,
  lastMonth: number,
): number {
  const start = new Date(year, firstMonth, 1).getTime();
  const end = new Date(year, lastMonth + 1, 1).getTime();
  const pct = ((REF - start) / (end - start)) * 100;
  return Number(Math.min(Math.max(pct, 0), 100).toFixed(1));
}

/** Instância de um único mês — granularidade DIÁRIA. */
function buildMonthInstance(year: number, month: number): GoalPeriodInstance {
  const isCurrent = year === CUR_YEAR && month === CUR_MONTH;
  const isPast = year < CUR_YEAR || (year === CUR_YEAR && month < CUR_MONTH);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let currentDay: number;
  let realizedTotal: number;
  let projectionTotal: number;
  if (isCurrent) {
    currentDay = MOCK_REFERENCE.currentDay;
    realizedTotal = realized;
    projectionTotal = projection;
  } else if (isPast) {
    currentDay = daysInMonth;
    realizedTotal = realizedForMonth(year, month) ?? 0;
    projectionTotal = realizedTotal;
  } else {
    currentDay = 0;
    realizedTotal = 0;
    projectionTotal = monthlyTarget;
  }

  const elapsed = isPast ? 100 : isCurrent ? MONTH_ELAPSED_PERCENT : 0;
  const summary = computeGoalSummary({
    monthlyTarget,
    realized: realizedTotal,
    monthElapsedPercent: elapsed,
  });
  const series = buildGoalEvolutionSeries({
    year,
    month,
    currentDay,
    monthlyTarget,
    realizedTotal,
    projectionTotal,
  });

  return {
    id: `month-${year}-${month}`,
    label: `${MONTH_FULL[month]} ${year}`,
    isCurrent,
    series,
    summary,
  };
}

/** Instância de vários meses (trimestre/semestre/ano) — granularidade MENSAL. */
function buildMultiMonthInstance(
  year: number,
  months: number[],
  id: string,
  label: string,
): GoalPeriodInstance {
  const monthlyRealized = months.map((m) => realizedForMonth(year, m));
  const rangeTarget = monthlyTarget * months.length;
  const rangeRealized = monthlyRealized.reduce<number>(
    (sum, v) => sum + (v ?? 0),
    0,
  );
  const elapsed = elapsedPercentForRange(
    year,
    months[0]!,
    months[months.length - 1]!,
  );
  const summary = computeGoalSummary({
    monthlyTarget: rangeTarget,
    realized: rangeRealized,
    monthElapsedPercent: elapsed,
  });
  const projectionTotal = elapsed > 0 ? summary.projection : rangeTarget;
  const series = buildMonthlyGoalSeries({
    year,
    startMonth: months[0]!,
    labels: months.map((m) => MONTH_SHORT[m]!),
    monthlyTarget,
    monthlyRealized,
    projectionTotal,
  });

  return {
    id,
    label,
    isCurrent: elapsed > 0 && elapsed < 100,
    series,
    summary,
  };
}

const QUARTERS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10, 11],
];
const SEMESTERS = [
  [0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11],
];

// Anos disponíveis para navegação (ano anterior + atual), p/ comparativo.
const YEARS = [CUR_YEAR - 1, CUR_YEAR];
const ALL_MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const goalEvolution: Record<GoalRange, GoalPeriodInstance[]> = {
  // Instâncias ordenadas do mais antigo ao mais recente (Jan/2025 → Dez/2026).
  month: YEARS.flatMap((year) =>
    ALL_MONTHS.map((m) => buildMonthInstance(year, m)),
  ),
  quarter: YEARS.flatMap((year) =>
    QUARTERS.map((months, i) =>
      buildMultiMonthInstance(
        year,
        months,
        `q-${year}-${i + 1}`,
        `${i + 1}º trimestre ${year}`,
      ),
    ),
  ),
  semester: YEARS.flatMap((year) =>
    SEMESTERS.map((months, i) =>
      buildMultiMonthInstance(
        year,
        months,
        `s-${year}-${i + 1}`,
        `${i + 1}º semestre ${year}`,
      ),
    ),
  ),
  year: YEARS.map((year) =>
    buildMultiMonthInstance(year, ALL_MONTHS, `y-${year}`, `${year}`),
  ),
};

// Resumo do mês corrente, reutilizado pelos cards de métrica.
const summary = (goalEvolution.month.find((i) => i.isCurrent) ??
  goalEvolution.month[goalEvolution.month.length - 1]!).summary;

const metrics: MetricCard[] = [
  {
    id: 'valor-fechado',
    label: 'Valor fechado',
    value: realized,
    format: 'currency-compact',
    deltaPercent: 12.4,
    deltaDirection: 'up',
    deltaLabel: 'vs. mês anterior',
    icon: 'trophy',
    tooltip: 'Soma dos contratos assinados no período selecionado.',
  },
  {
    id: 'meta-mensal',
    label: 'Meta mensal',
    value: monthlyTarget,
    format: 'currency-compact',
    icon: 'target',
    tooltip: 'Objetivo de faturamento definido para o mês.',
  },
  {
    id: 'percentual-atingido',
    label: 'Percentual atingido',
    value: summary.realizedPercent,
    format: 'percent',
    deltaPercent: summary.paceDiff,
    deltaDirection: summary.paceDiff >= 0 ? 'up' : 'down',
    deltaLabel: 'vs. ritmo esperado',
    icon: 'gauge',
    tooltip: 'Percentual da meta mensal já realizado.',
  },
  {
    id: 'valor-restante',
    label: 'Valor restante',
    value: Math.max(monthlyTarget - realized, 0),
    format: 'currency-compact',
    deltaPercent: -8.1,
    deltaDirection: 'down',
    deltaLabel: 'vs. mês anterior',
    icon: 'flag',
    tooltip: 'Quanto falta para atingir a meta do mês.',
    invertDelta: true,
  },
  {
    id: 'projecao-mes',
    label: 'Projeção do mês',
    value: projection,
    format: 'currency-compact',
    deltaPercent: 10.5,
    deltaDirection: 'up',
    deltaLabel: 'vs. meta',
    icon: 'trending-up',
    tooltip: 'Estimativa de fechamento mantendo o ritmo atual.',
  },
  {
    id: 'valor-recebido',
    label: 'Valor recebido',
    value: 1_240_000,
    format: 'currency-compact',
    deltaPercent: 6.2,
    deltaDirection: 'up',
    deltaLabel: 'vs. mês anterior',
    icon: 'wallet',
    tooltip: 'Total efetivamente recebido no período.',
  },
  {
    id: 'valor-a-receber',
    label: 'Valor a receber',
    value: 720_000,
    format: 'currency-compact',
    deltaPercent: 4.8,
    deltaDirection: 'up',
    deltaLabel: 'vs. mês anterior',
    icon: 'clock',
    tooltip: 'Contas a receber em aberto (não vencidas).',
  },
  {
    id: 'ticket-medio',
    label: 'Ticket médio',
    value: 68_000,
    format: 'currency',
    deltaPercent: 3.1,
    deltaDirection: 'up',
    deltaLabel: 'vs. mês anterior',
    icon: 'receipt',
    tooltip: 'Valor médio por contrato assinado.',
  },
  {
    id: 'contratos-fechados',
    label: 'Contratos fechados',
    value: 18,
    format: 'number',
    deltaPercent: 20,
    deltaDirection: 'up',
    deltaLabel: '+3 vs. mês anterior',
    icon: 'file-signature',
    tooltip: 'Quantidade de contratos assinados no período.',
  },
  {
    id: 'crescimento',
    label: 'Crescimento',
    value: 12.4,
    format: 'percent',
    deltaPercent: 12.4,
    deltaDirection: 'up',
    deltaLabel: 'vs. mês anterior',
    icon: 'sparkles',
    tooltip: 'Variação do valor fechado em relação ao mês anterior.',
  },
];

export const dashboardOverviewMock: DashboardOverview = {
  metrics,
  goalEvolution,
};
