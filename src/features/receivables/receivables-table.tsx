'use client';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/shared';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Receivable, ReceivableStatus } from '@/interfaces';
import { formatCurrency, formatDateShort } from '@/lib/format';
import type { BadgeProps } from '@/components/ui/badge';

const STATUS_META: Record<
  ReceivableStatus,
  { label: string; variant: NonNullable<BadgeProps['variant']> }
> = {
  pending: { label: 'A vencer', variant: 'warning' },
  paid: { label: 'Pago', variant: 'success' },
  overdue: { label: 'Vencido', variant: 'destructive' },
};

const FILTERS: { value: ReceivableStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'A vencer' },
  { value: 'overdue', label: 'Vencidos' },
  { value: 'paid', label: 'Pagos' },
];

export function ReceivablesTable({ rows }: { rows: Receivable[] }) {
  const [status, setStatus] = React.useState<ReceivableStatus | 'all'>('all');

  const filtered = React.useMemo(
    () => rows.filter((r) => status === 'all' || r.status === status),
    [rows, status],
  );

  return (
    <div className="space-y-4">
      <Tabs
        value={status}
        onValueChange={(v) => setStatus(v as ReceivableStatus | 'all')}
      >
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum recebimento"
          description="Não há recebimentos para o filtro selecionado."
        />
      ) : (
        <div className="rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Contrato</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Influenciador</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Vencimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const meta = STATUS_META[row.status];
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium tabular-nums text-foreground">
                      {row.contractCode}
                    </TableCell>
                    <TableCell>{row.brandName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.influencerName}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(row.value)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatDateShort(row.dueDate)}
                      {row.daysOverdue > 0 && (
                        <span className="ml-1 text-xs text-destructive">
                          (+{row.daysOverdue}d)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
