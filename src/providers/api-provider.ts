import type {
  Brand,
  CommercialData,
  Contract,
  ContentProduction,
  DashboardOverview,
  DataResult,
  FinancialData,
  Influencer,
  PeriodRange,
  Receivable,
} from '@/interfaces';
import type { DataProvider } from './data-provider';
import { apiFetch } from './http-client';

/**
 * Implementação da camada de dados que consome a API oficial da RIZO.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ PONTO DE INTEGRAÇÃO COM O SISTEMA REAL DA RIZO                     │
 * │                                                                    │
 * │ Cada método abaixo mapeia 1:1 para um endpoint REST. Ao conectar  │
 * │ o sistema oficial:                                                 │
 * │   1. Ajuste os paths (`/dashboard/overview`, etc.) conforme a API. │
 * │   2. Se o payload da API divergir das interfaces de `@/interfaces`,│
 * │      adicione um mapeamento (adapter) aqui — a UI não muda.         │
 * │   3. Defina NEXT_PUBLIC_DATA_PROVIDER=api e RIZO_API_TOKEN.         │
 * └──────────────────────────────────────────────────────────────────┘
 */
export class ApiProvider implements DataProvider {
  private query(period: PeriodRange): string {
    return `?period=${encodeURIComponent(period)}`;
  }

  async getDashboardOverview(
    period: PeriodRange,
  ): Promise<DataResult<DashboardOverview>> {
    return apiFetch<DataResult<DashboardOverview>>(
      `/dashboard/overview${this.query(period)}`,
    );
  }

  async getCommercialData(
    period: PeriodRange,
  ): Promise<DataResult<CommercialData>> {
    return apiFetch<DataResult<CommercialData>>(
      `/commercial${this.query(period)}`,
    );
  }

  async getFinancialData(
    period: PeriodRange,
  ): Promise<DataResult<FinancialData>> {
    return apiFetch<DataResult<FinancialData>>(
      `/financial${this.query(period)}`,
    );
  }

  async getContracts(period: PeriodRange): Promise<DataResult<Contract[]>> {
    return apiFetch<DataResult<Contract[]>>(`/contracts${this.query(period)}`);
  }

  async getReceivables(period: PeriodRange): Promise<DataResult<Receivable[]>> {
    return apiFetch<DataResult<Receivable[]>>(
      `/receivables${this.query(period)}`,
    );
  }

  async getInfluencers(period: PeriodRange): Promise<DataResult<Influencer[]>> {
    return apiFetch<DataResult<Influencer[]>>(
      `/influencers${this.query(period)}`,
    );
  }

  async getBrands(period: PeriodRange): Promise<DataResult<Brand[]>> {
    return apiFetch<DataResult<Brand[]>>(`/brands${this.query(period)}`);
  }

  async getContentProduction(
    period: PeriodRange,
  ): Promise<DataResult<ContentProduction>> {
    return apiFetch<DataResult<ContentProduction>>(
      `/production${this.query(period)}`,
    );
  }
}
