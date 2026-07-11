export interface Brand {
  id: string;
  name: string;
  /** Segmento de mercado. Ex.: "Beleza", "Tecnologia". */
  segment: string;
  logo?: string;
  /** Receita total gerada pela marca. */
  revenue: number;
  contracts: number;
  activeContracts: number;
  /** Ticket médio dos contratos da marca. */
  averageTicket: number;
  /** Data do primeiro contrato. */
  since: string;
  /** Variação de receita vs. período anterior (%). */
  growthPercent: number;
}
