/**
 * Utilitários de formatação centralizados (pt-BR).
 * Usar sempre estes helpers em vez de formatar inline nos componentes.
 */

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const BRL_PRECISE = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NUMBER = new Intl.NumberFormat('pt-BR');

/** Formata em Real (sem centavos por padrão). Ex.: R$ 1.250.000 */
export function formatCurrency(value: number, precise = false): string {
  return precise ? BRL_PRECISE.format(value) : BRL.format(value);
}

/** Versão compacta para valores altos. Ex.: R$ 1,2 mi */
export function formatCurrencyCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} mi`;
  }
  if (abs >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 0,
    })} mil`;
  }
  return BRL.format(value);
}

/** Formata número inteiro/decimal com separador pt-BR. */
export function formatNumber(value: number): string {
  return NUMBER.format(value);
}

/** Formata percentual. Ex.: formatPercent(87.4) => "87,4%" */
export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

/** Percentual com sinal explícito. Ex.: "+12,4%" ou "-3,1%" */
export function formatSignedPercent(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatPercent(value, fractionDigits)}`;
}

/** Data curta. Ex.: "10 jul" */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

/** Data completa. Ex.: "10 de julho de 2026" */
export function formatDateLong(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/** Horário. Ex.: "14:32" */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
