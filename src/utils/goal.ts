import type {
  GoalEvolutionPoint,
  GoalEvolutionSummary,
  HealthStatus,
} from '@/interfaces';

/**
 * Regras de negócio da "Evolução da Meta".
 * Mantidas fora dos componentes para serem testáveis e reutilizáveis
 * tanto pelo MockProvider quanto pelo ApiProvider (caso a API entregue
 * apenas os números brutos).
 */

/** Limiares (em pontos percentuais) que definem o status de ritmo. */
const ON_TRACK_TOLERANCE = 3;

export interface GoalInputs {
  monthlyTarget: number;
  realized: number;
  /** Percentual do mês já decorrido (0-100). */
  monthElapsedPercent: number;
}

/** Classifica o ritmo comparando realizado x esperado. */
export function resolveGoalStatus(paceDiff: number): HealthStatus {
  if (paceDiff > ON_TRACK_TOLERANCE) return 'above';
  if (paceDiff < -ON_TRACK_TOLERANCE) return 'below';
  return 'on-track';
}

/** Mensagem automática para o status de ritmo. */
export function resolveGoalMessage(
  status: HealthStatus,
  paceDiff: number,
): string {
  const abs = Math.abs(paceDiff).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  });
  switch (status) {
    case 'above':
      return `Acima do esperado — ${abs} p.p. à frente do ritmo ideal.`;
    case 'below':
      return `Abaixo do esperado — ${abs} p.p. atrás do ritmo ideal.`;
    default:
      return 'Dentro do esperado — ritmo alinhado à meta do mês.';
  }
}

/**
 * Deriva o resumo analítico a partir dos números brutos.
 * A projeção assume manutenção do ritmo atual até o fim do mês.
 */
export function computeGoalSummary({
  monthlyTarget,
  realized,
  monthElapsedPercent,
}: GoalInputs): GoalEvolutionSummary {
  const expectedPercent = monthElapsedPercent;
  const realizedPercent =
    monthlyTarget > 0 ? (realized / monthlyTarget) * 100 : 0;
  const paceDiff = realizedPercent - expectedPercent;

  // Projeção linear: extrapola o realizado pelo ritmo diário atual.
  const projection =
    monthElapsedPercent > 0
      ? Math.round((realized / monthElapsedPercent) * 100)
      : realized;

  const status = resolveGoalStatus(paceDiff);

  return {
    monthlyTarget,
    realized,
    projection,
    expectedPercent: Number(expectedPercent.toFixed(1)),
    realizedPercent: Number(realizedPercent.toFixed(1)),
    paceDiff: Number(paceDiff.toFixed(1)),
    status,
    message: resolveGoalMessage(status, paceDiff),
  };
}

/**
 * Gera a série diária acumulada (meta, realizado, projeção) de um mês.
 * `realizedTotal` é distribuído até o dia atual com leve ruído p/ realismo.
 */
export function buildGoalEvolutionSeries(params: {
  year: number;
  /** 0-11 */
  month: number;
  /** Dia atual (1-based). */
  currentDay: number;
  monthlyTarget: number;
  realizedTotal: number;
  projectionTotal: number;
}): GoalEvolutionPoint[] {
  const { year, month, currentDay, monthlyTarget, realizedTotal } = params;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Pesos diários (fins de semana rendem menos) para uma curva orgânica.
  const weights: number[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const weekday = new Date(year, month, day).getDay();
    weights.push(weekday === 0 || weekday === 6 ? 0.4 : 1);
  }
  const realizedWeightSum = weights
    .slice(0, currentDay)
    .reduce((a, b) => a + b, 0);

  const series: GoalEvolutionPoint[] = [];
  let realizedAcc = 0;
  const projectionAcc = realizedTotal;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const target = Math.round((monthlyTarget / daysInMonth) * day);

    let realized: number | null = null;
    let projection: number | null = null;

    if (day <= currentDay) {
      realizedAcc += (weights[day - 1]! / realizedWeightSum) * realizedTotal;
      realized = Math.round(realizedAcc);
      // O ponto "hoje" ancora também o início da projeção.
      if (day === currentDay) projection = realized;
    } else {
      const remainingWeight = weights
        .slice(currentDay, day)
        .reduce((a, b) => a + b, 0);
      const remainingTotalWeight = weights
        .slice(currentDay)
        .reduce((a, b) => a + b, 0);
      const projected =
        realizedTotal +
        (remainingWeight / remainingTotalWeight) *
          (params.projectionTotal - realizedTotal);
      projection = Math.round(projected);
    }

    series.push({
      label: String(day).padStart(2, '0'),
      date: date.toISOString(),
      value: realized ?? projection ?? 0,
      target,
      realized,
      projection,
    });
  }

  void projectionAcc;
  return series;
}

/**
 * Série acumulada de granularidade MENSAL (meta, realizado, projeção) —
 * usada nas janelas trimestre/semestre/ano do filtro da "Evolução da Meta".
 * `monthlyRealized` usa `null` para meses futuros (viram projeção).
 */
export function buildMonthlyGoalSeries(params: {
  year: number;
  /** Índice 0-based do mês do primeiro rótulo. */
  startMonth: number;
  labels: string[];
  monthlyTarget: number;
  monthlyRealized: (number | null)[];
  /** Projeção acumulada estimada ao fim do período. */
  projectionTotal: number;
}): GoalEvolutionPoint[] {
  const { year, startMonth, labels, monthlyTarget, monthlyRealized } = params;
  const n = labels.length;

  let lastRealizedIndex = -1;
  for (let i = 0; i < n; i++) {
    if (monthlyRealized[i] != null) lastRealizedIndex = i;
  }
  const realizedAtLast = monthlyRealized
    .slice(0, lastRealizedIndex + 1)
    .reduce<number>((sum, v) => sum + (v ?? 0), 0);
  const remainingMonths = n - 1 - lastRealizedIndex;
  const projStep =
    remainingMonths > 0
      ? (params.projectionTotal - realizedAtLast) / remainingMonths
      : 0;

  const series: GoalEvolutionPoint[] = [];
  let targetAcc = 0;
  let realizedAcc = 0;

  for (let i = 0; i < n; i++) {
    targetAcc += monthlyTarget;
    const date = new Date(year, startMonth + i, 1).toISOString();

    let realized: number | null = null;
    let projection: number | null = null;

    if (i <= lastRealizedIndex && monthlyRealized[i] != null) {
      realizedAcc += monthlyRealized[i]!;
      realized = Math.round(realizedAcc);
      // O último mês realizado ancora o início da projeção.
      if (i === lastRealizedIndex) projection = realized;
    } else if (i > lastRealizedIndex) {
      projection = Math.round(realizedAtLast + projStep * (i - lastRealizedIndex));
    }

    series.push({
      label: labels[i]!,
      date,
      value: realized ?? projection ?? 0,
      target: Math.round(targetAcc),
      realized,
      projection,
    });
  }

  return series;
}
