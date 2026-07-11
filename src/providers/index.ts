import { env } from '@/lib/env';
import { ApiProvider } from './api-provider';
import type { DataProvider } from './data-provider';
import { MockProvider } from './mock-provider';

export type { DataProvider } from './data-provider';
export { ApiError } from './http-client';

/**
 * Adapter/Factory que decide qual implementação usar em tempo de execução,
 * com base em `NEXT_PUBLIC_DATA_PROVIDER`. É a ÚNICA porta de entrada da
 * camada de dados — services e Server Components dependem apenas disto.
 */
let instance: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (instance) return instance;
  instance =
    env.dataProvider === 'api' ? new ApiProvider() : new MockProvider();
  return instance;
}
