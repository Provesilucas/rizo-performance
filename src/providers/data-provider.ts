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

/**
 * Contrato único da camada de dados.
 *
 * Toda a aplicação consome dados EXCLUSIVAMENTE através desta interface.
 * Existem duas implementações:
 *  - `MockProvider` — dados simulados (padrão de desenvolvimento).
 *  - `ApiProvider`  — consome a API oficial da RIZO.
 *
 * Trocar de uma para outra é feito via variável de ambiente
 * `NEXT_PUBLIC_DATA_PROVIDER` (ver `src/providers/index.ts`).
 */
export interface DataProvider {
  getDashboardOverview(
    period: PeriodRange,
  ): Promise<DataResult<DashboardOverview>>;

  getCommercialData(period: PeriodRange): Promise<DataResult<CommercialData>>;

  getFinancialData(period: PeriodRange): Promise<DataResult<FinancialData>>;

  getContracts(period: PeriodRange): Promise<DataResult<Contract[]>>;

  getReceivables(period: PeriodRange): Promise<DataResult<Receivable[]>>;

  getInfluencers(period: PeriodRange): Promise<DataResult<Influencer[]>>;

  getBrands(period: PeriodRange): Promise<DataResult<Brand[]>>;

  getContentProduction(
    period: PeriodRange,
  ): Promise<DataResult<ContentProduction>>;
}
