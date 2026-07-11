export type ContractStatus =
  'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'canceled';

/**
 * Resultado da validação jurídica (Validador de Contratos):
 * - approved      → APROVADO (sem pendências relevantes)
 * - reservations  → APROVADO_COM_RESSALVAS (requer revisão)
 * - rejected      → REPROVADO (risco crítico)
 * - pending       → ainda não analisado
 */
export type LegalStatus = 'approved' | 'reservations' | 'rejected' | 'pending';

/** Bloco de análise jurídica de um contrato. */
export interface LegalReview {
  status: LegalStatus;
  /** Pontuação de risco (Crítico=10, Importante=4, Menor=1). */
  riskScore: number;
  criticalIssues: number;
  importantIssues: number;
  minorIssues: number;
  /** Se requer revisão de uma pessoa responsável. */
  needsLegalReview: boolean;
}

/** Origem do contrato: fechado direto (Principal) ou via agência. */
export type ContractOrigin = 'principal' | 'agencia';

export interface Contract {
  id: string;
  /** Código interno legível. Ex.: "RZ-2026-0184". */
  code: string;
  /** Se o negócio veio direto (Principal) ou por uma agência. */
  origin: ContractOrigin;
  brandId: string;
  brandName: string;
  influencerId: string;
  influencerName: string;
  /** Comercial responsável. */
  ownerId: string;
  ownerName: string;
  value: number;
  status: ContractStatus;
  createdAt: string;
  signedAt: string | null;
  /** Data de início da vigência. */
  startsAt: string | null;
  /** Data de término da vigência. */
  endsAt: string | null;
  /** Análise jurídica do contrato (Validador de Contratos). */
  legal: LegalReview;
}
