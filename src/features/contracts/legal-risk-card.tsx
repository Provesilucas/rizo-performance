import { AlertTriangle, ShieldCheck } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DonutChart, type DonutSlice } from '@/components/charts/donut-chart';
import type { Contract, LegalStatus } from '@/interfaces';
import { LEGAL_STATUS_META, LEGAL_STATUS_ORDER } from './legal-status';

/** Agrega os contratos por status jurídico e sinais de risco. */
export function summarizeLegal(contracts: Contract[]) {
  const counts = {
    approved: 0,
    reservations: 0,
    rejected: 0,
    pending: 0,
  } satisfies Record<LegalStatus, number>;

  let needsReview = 0;
  let criticalIssues = 0;

  for (const contract of contracts) {
    counts[contract.legal.status] += 1;
    if (contract.legal.needsLegalReview) needsReview += 1;
    criticalIssues += contract.legal.criticalIssues;
  }

  const slices: DonutSlice[] = LEGAL_STATUS_ORDER.filter(
    (status) => counts[status] > 0,
  ).map((status) => ({
    label: LEGAL_STATUS_META[status].label,
    value: counts[status],
    color: LEGAL_STATUS_META[status].color,
  }));

  return {
    counts,
    needsReview,
    criticalIssues,
    slices,
    total: contracts.length,
  };
}

export function LegalRiskCard({ contracts }: { contracts: Contract[] }) {
  const summary = summarizeLegal(contracts);

  return (
    <Card>
      <CardHeader className="border-b border-border/60">
        <CardTitle>Risco jurídico dos contratos</CardTitle>
        <CardDescription>
          Validação automática — Aprovado, ressalvas ou reprovado.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <DonutChart
          data={summary.slices}
          centerValue={String(summary.total)}
          centerLabel="contratos"
        />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <div className="leading-tight">
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {summary.needsReview}
              </p>
              <p className="text-xs text-muted-foreground">Requerem revisão</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
            <div className="leading-tight">
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {summary.criticalIssues}
              </p>
              <p className="text-xs text-muted-foreground">Issues críticos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
