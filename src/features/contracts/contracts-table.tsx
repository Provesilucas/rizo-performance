'use client';

import * as React from 'react';
import { AlertTriangle, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Contract, ContractStatus } from '@/interfaces';
import { formatCurrency, formatDateShort } from '@/lib/format';
import { CONTRACT_FILTERS, CONTRACT_STATUS_META } from './contract-status';
import { LEGAL_STATUS_META } from './legal-status';

export function ContractsTable({ contracts }: { contracts: Contract[] }) {
  const [status, setStatus] = React.useState<ContractStatus | 'all'>('all');
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return contracts.filter((c) => {
      const matchesStatus = status === 'all' || c.status === status;
      const matchesQuery =
        !q ||
        [c.code, c.brandName, c.influencerName, c.ownerName]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [contracts, status, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={status}
          onValueChange={(v) => setStatus(v as ContractStatus | 'all')}
        >
          <TabsList className="flex-wrap">
            {CONTRACT_FILTERS.map((filter) => (
              <TabsTrigger key={filter.value} value={filter.value}>
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar contrato…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Buscar contrato"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum contrato encontrado"
          description="Ajuste os filtros ou o termo de busca para ver resultados."
        />
      ) : (
        <div className="rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Contrato</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Influenciador</TableHead>
                <TableHead>Comercial</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jurídico</TableHead>
                <TableHead className="text-right">Assinatura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((contract) => {
                const meta = CONTRACT_STATUS_META[contract.status];
                const legal = LEGAL_STATUS_META[contract.legal.status];
                return (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium tabular-nums text-foreground">
                      {contract.code}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          contract.origin === 'principal'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {contract.origin === 'principal'
                          ? 'Principal'
                          : 'Agência'}
                      </Badge>
                    </TableCell>
                    <TableCell>{contract.brandName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {contract.influencerName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contract.ownerName}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(contract.value)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={legal.variant}>{legal.short}</Badge>
                        {contract.legal.needsLegalReview && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-warning">
                                <AlertTriangle className="h-3.5 w-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Requer revisão jurídica · risco{' '}
                              {contract.legal.riskScore} ·{' '}
                              {contract.legal.criticalIssues} crítico(s),{' '}
                              {contract.legal.importantIssues} importante(s)
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {contract.signedAt
                        ? formatDateShort(contract.signedAt)
                        : '—'}
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
