import { getDataProvider } from '@/providers';
import type { PeriodRange } from '@/interfaces';

/**
 * Camada de serviços: a fachada que os Server Components consomem.
 *
 * Hoje delega direto ao `DataProvider`, mas é o lugar certo para
 * orquestração futura (cache, agregações cross-domínio, tratamento de
 * erro, telemetria) sem acoplar a UI ao provider.
 */

const DEFAULT_PERIOD: PeriodRange = 'this-month';

export const dashboardService = {
  getOverview: (period: PeriodRange = DEFAULT_PERIOD) =>
    getDataProvider().getDashboardOverview(period),
};

export const commercialService = {
  getData: (period: PeriodRange = DEFAULT_PERIOD) =>
    getDataProvider().getCommercialData(period),
};

export const financialService = {
  getData: (period: PeriodRange = DEFAULT_PERIOD) =>
    getDataProvider().getFinancialData(period),
};

export const contractsService = {
  list: (period: PeriodRange = DEFAULT_PERIOD) =>
    getDataProvider().getContracts(period),
};

export const receivablesService = {
  list: (period: PeriodRange = DEFAULT_PERIOD) =>
    getDataProvider().getReceivables(period),
};

export const influencersService = {
  list: (period: PeriodRange = DEFAULT_PERIOD) =>
    getDataProvider().getInfluencers(period),
};

export const brandsService = {
  list: (period: PeriodRange = DEFAULT_PERIOD) =>
    getDataProvider().getBrands(period),
};

export const productionService = {
  getData: (period: PeriodRange = DEFAULT_PERIOD) =>
    getDataProvider().getContentProduction(period),
};
