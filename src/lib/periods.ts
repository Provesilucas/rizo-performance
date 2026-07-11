import type { PeriodRange } from '@/interfaces';

export interface PeriodOption {
  value: PeriodRange;
  label: string;
}

export const periodOptions: PeriodOption[] = [
  { value: 'this-month', label: 'Este mês' },
  { value: 'last-month', label: 'Mês anterior' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'year', label: 'Ano' },
];

export const DEFAULT_PERIOD: PeriodRange = 'this-month';

/** Valida um valor arbitrário (ex.: query param) contra os períodos aceitos. */
export function parsePeriod(value: string | undefined | null): PeriodRange {
  const match = periodOptions.find((p) => p.value === value);
  return match?.value ?? DEFAULT_PERIOD;
}

export function periodLabel(value: PeriodRange): string {
  return periodOptions.find((p) => p.value === value)?.label ?? 'Este mês';
}
