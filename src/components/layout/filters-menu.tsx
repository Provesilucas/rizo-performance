'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const FILTERS = [
  { id: 'active', label: 'Somente contratos ativos' },
  { id: 'high-ticket', label: 'Ticket alto (> R$ 60k)' },
  { id: 'overdue', label: 'Com pendências' },
] as const;

/**
 * Menu de filtros do header. Mantém o estado localmente; ao integrar a API,
 * conecte estes filtros aos parâmetros de consulta dos serviços.
 */
export function FiltersMenu() {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const count = Object.values(selected).filter(Boolean).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {count > 0 && (
            <Badge className="h-5 min-w-5 justify-center px-1.5">{count}</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Refinar visualização</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {FILTERS.map((filter) => (
          <DropdownMenuCheckboxItem
            key={filter.id}
            checked={Boolean(selected[filter.id])}
            onCheckedChange={(checked) =>
              setSelected((prev) => ({ ...prev, [filter.id]: checked }))
            }
            onSelect={(e) => e.preventDefault()}
          >
            {filter.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
