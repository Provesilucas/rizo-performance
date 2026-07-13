import {
  BarChart3,
  Download,
  FileSpreadsheet,
  LineChart,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared';

export const metadata = { title: 'Relatórios' };

const REPORTS = [
  {
    id: 'executivo',
    title: 'Relatório executivo mensal',
    description: 'Panorama completo de metas, comercial e financeiro do mês.',
    icon: BarChart3,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'comercial',
    title: 'Fechamento comercial',
    description: 'Funil, ranking e conversões do time comercial.',
    icon: LineChart,
    formats: ['PDF'],
  },
  {
    id: 'financeiro',
    title: 'Demonstrativo financeiro',
    description: 'Receita, recebimentos e contas a receber detalhados.',
    icon: FileSpreadsheet,
    formats: ['Excel', 'CSV'],
  },
  {
    id: 'influenciadores',
    title: 'Performance de influenciadores',
    description: 'Faturamento, campanhas e evolução por influenciador.',
    icon: Users,
    formats: ['PDF', 'Excel'],
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {REPORTS.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.id}
              className="flex flex-col justify-between p-5 transition-colors duration-200 hover:border-foreground/20"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1.5">
                    {report.formats.map((format) => (
                      <Badge key={format} variant="secondary">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {report.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.description}
                </p>
              </div>
              <Button variant="outline" className="mt-5 w-full">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Relatórios gerados</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <EmptyState
            title="Nenhum relatório gerado ainda"
            description="Os relatórios exportados aparecerão aqui para download e histórico."
          />
        </CardContent>
      </Card>
    </div>
  );
}
