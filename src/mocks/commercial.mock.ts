import type {
  CommercialData,
  ExternalHub,
  FunnelStage,
  Salesperson,
} from '@/interfaces';

const rawFunnel: Omit<FunnelStage, 'conversionFromPrevious'>[] = [
  { key: 'prospeccoes', label: 'Prospecções', count: 96, value: 5_200_000 },
  { key: 'reunioes', label: 'Reuniões', count: 48, value: 3_400_000 },
  { key: 'propostas', label: 'Propostas', count: 27, value: 1_950_000 },
  { key: 'negociacao', label: 'Negociação', count: 14, value: 1_120_000 },
  { key: 'fechados', label: 'Fechados', count: 18, value: 535_000 },
  { key: 'perdidos', label: 'Perdidos', count: 11, value: 640_000 },
];

/** Deriva a conversão de cada etapa em relação à anterior. */
function withConversion(
  stages: Omit<FunnelStage, 'conversionFromPrevious'>[],
): FunnelStage[] {
  return stages.map((stage, index) => {
    // "Perdidos" não faz parte da cadeia sequencial de conversão.
    if (index === 0 || stage.key === 'perdidos') {
      return { ...stage, conversionFromPrevious: null };
    }
    const previous = stages[index - 1]!;
    const conversion =
      previous.count > 0 ? (stage.count / previous.count) * 100 : 0;
    return {
      ...stage,
      conversionFromPrevious: Number(conversion.toFixed(1)),
    };
  });
}

const salespeople: Salesperson[] = [
  {
    id: 'djony',
    name: 'Djony',
    monthlyGoal: 40_000,
    closedValueMonth: 36_500,
    closedValueYear: 420_000,
    contractsMonth: 6,
    contractsYear: 71,
    averageTicket: 6_083,
    bySource: [
      {
        source: 'prospeccao',
        label: 'Prospecção',
        value: 36_500,
        jobs: 6,
        share: 100,
      },
      { source: 'inbound', label: 'Email / Inbound', value: 0, jobs: 0, share: 0 },
    ],
    biggestJob: { name: 'GRUPO OCEANIC', value: 12_000 },
  },
  {
    id: 'nicole',
    name: 'Nicole Reig',
    monthlyGoal: 55_000,
    closedValueMonth: 46_600,
    closedValueYear: 510_000,
    contractsMonth: 5,
    contractsYear: 63,
    averageTicket: 9_320,
    bySource: [
      {
        source: 'prospeccao',
        label: 'Prospecção',
        value: 31_100,
        jobs: 3,
        share: 66.7,
      },
      {
        source: 'inbound',
        label: 'Email / Inbound',
        value: 15_500,
        jobs: 2,
        share: 33.3,
      },
    ],
    biggestJob: { name: 'DROGARIA CATARINENSE', value: 24_600 },
  },
];

const externalHub: ExternalHub = {
  total: 148_000,
  jobs: 9,
  influencers: 7,
  sharePercent: 11,
  target: 200_000,
  growthPercent: 34.5,
  monthly: [
    { label: 'Fev', date: '2026-02-01', value: 42_000 },
    { label: 'Mar', date: '2026-03-01', value: 58_000 },
    { label: 'Abr', date: '2026-04-01', value: 76_000 },
    { label: 'Mai', date: '2026-05-01', value: 95_000 },
    { label: 'Jun', date: '2026-06-01', value: 110_000 },
    { label: 'Jul', date: '2026-07-01', value: 148_000 },
  ],
  items: [
    { handle: '@leofeck1', brand: 'PERNAMBUCANAS', value: 38_000 },
    { handle: '@carolwoudenberg', brand: 'SKALA COSMÉTICOS', value: 32_000 },
    { handle: '@marirocha', brand: 'DROGARIA SP', value: 28_000 },
    { handle: '@pedrolimaof', brand: 'CENTAURO', value: 26_000 },
    { handle: '@babioliveira', brand: 'RIACHUELO', value: 24_000 },
  ],
};

const funnel = withConversion(rawFunnel);
const signed = funnel.find((s) => s.key === 'fechados')?.count ?? 0;
const prospected = funnel.find((s) => s.key === 'prospeccoes')?.count ?? 1;

export const commercialDataMock: CommercialData = {
  funnel,
  salespeople,
  externalHub,
  totalPipeline: rawFunnel
    .filter((s) => s.key !== 'perdidos' && s.key !== 'fechados')
    .reduce((sum, s) => sum + s.value, 0),
  globalConversion: Number(((signed / prospected) * 100).toFixed(1)),
};
