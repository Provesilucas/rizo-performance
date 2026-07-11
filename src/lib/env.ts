/**
 * Acesso centralizado e tipado às variáveis de ambiente.
 *
 * Variáveis `NEXT_PUBLIC_*` ficam disponíveis no cliente; as demais
 * (ex.: RIZO_API_TOKEN) só existem no servidor. Como todo o consumo de
 * dados acontece em Server Components, o token nunca vaza para o browser.
 */
export type DataProviderKind = 'mock' | 'api';

const providerKind = (process.env.NEXT_PUBLIC_DATA_PROVIDER ??
  'mock') as DataProviderKind;

export const env = {
  /** Qual implementação da camada de dados usar. */
  dataProvider: providerKind === 'api' ? 'api' : ('mock' as DataProviderKind),
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.rizo.com.br/v1',
  apiToken: process.env.RIZO_API_TOKEN ?? '',
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? '15000'),
} as const;
