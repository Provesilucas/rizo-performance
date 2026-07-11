import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/shared';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ProductionByCreator } from '@/interfaces';
import { formatPercent } from '@/lib/format';

/** Retenção prevista em nota /10, colorida por faixa. */
function retentionVariant(value: number) {
  if (value >= 8) return 'success' as const;
  if (value >= 7) return 'default' as const;
  return 'warning' as const;
}

export function CreatorTable({ rows }: { rows: ProductionByCreator[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Criador</TableHead>
          <TableHead className="text-right">Vídeos</TableHead>
          <TableHead className="text-right">Retenção</TableHead>
          <TableHead className="text-right">Aprovação QC</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {row.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{row.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">
              {row.videos}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant={retentionVariant(row.avgRetention)}
                className="tabular-nums"
              >
                {row.avgRetention.toLocaleString('pt-BR', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                /10
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="ml-auto flex w-28 flex-col items-end gap-1">
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {formatPercent(row.qcApprovalRate, 0)}
                </span>
                <ProgressBar value={row.qcApprovalRate} className="h-1.5" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
