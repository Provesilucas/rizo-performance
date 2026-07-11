import type { NamedValue, TimeSeriesPoint } from './common';

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  /** Nicho principal. Ex.: "Moda", "Fitness". */
  niche: string;
  avatar?: string;
  /** Alcance/seguidores agregados. */
  followers: number;
  revenue: number;
  contracts: number;
  /** Total já recebido pela agência referente a este influenciador. */
  received: number;
  /** Campanhas ativas no momento. */
  activeCampaigns: number;
  /** Variação de faturamento vs. período anterior (%). */
  growthPercent: number;
}

/** Detalhe expandido de um influenciador. */
export interface InfluencerDetail extends Influencer {
  revenueEvolution: TimeSeriesPoint[];
  topBrands: NamedValue[];
}
