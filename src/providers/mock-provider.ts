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
import {
  MOCK_SYNCED_AT,
  brandsMock,
  commercialDataMock,
  contractsMock,
  dashboardOverviewMock,
  financialDataMock,
  influencersMock,
  productionMock,
  receivablesMock,
} from '@/mocks';
import type { DataProvider } from './data-provider';

/** Latência simulada para reproduzir estados de carregamento reais. */
const SIMULATED_LATENCY_MS = 450;

function delay<T>(data: T): Promise<DataResult<T>> {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ data, syncedAt: MOCK_SYNCED_AT }),
      SIMULATED_LATENCY_MS,
    );
  });
}

/**
 * Implementação da camada de dados baseada em mocks locais.
 * O parâmetro `period` é aceito para manter a paridade de assinatura com o
 * `ApiProvider`; nos mocks ele é ignorado (dataset único de referência).
 */
export class MockProvider implements DataProvider {
  getDashboardOverview(
    _period: PeriodRange,
  ): Promise<DataResult<DashboardOverview>> {
    return delay(dashboardOverviewMock);
  }

  getCommercialData(_period: PeriodRange): Promise<DataResult<CommercialData>> {
    return delay(commercialDataMock);
  }

  getFinancialData(_period: PeriodRange): Promise<DataResult<FinancialData>> {
    return delay(financialDataMock);
  }

  getContracts(_period: PeriodRange): Promise<DataResult<Contract[]>> {
    return delay(contractsMock);
  }

  getReceivables(_period: PeriodRange): Promise<DataResult<Receivable[]>> {
    return delay(receivablesMock);
  }

  getInfluencers(_period: PeriodRange): Promise<DataResult<Influencer[]>> {
    return delay(influencersMock);
  }

  getBrands(_period: PeriodRange): Promise<DataResult<Brand[]>> {
    return delay(brandsMock);
  }

  getContentProduction(
    _period: PeriodRange,
  ): Promise<DataResult<ContentProduction>> {
    return delay(productionMock);
  }
}
