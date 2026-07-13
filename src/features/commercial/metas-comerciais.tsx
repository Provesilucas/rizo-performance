'use client';

import * as React from 'react';
import { Crown, Pencil } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/shared';
import type { Salesperson } from '@/interfaces';
import { useSalesGoals } from '@/hooks/use-sales-goals';
import { formatCurrency, formatCurrencyCompact, formatPercent } from '@/lib/format';

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/** Editor de meta de um comercial (inline, com salvar/cancelar). */
function GoalEditor({
  value,
  onSave,
}: {
  value: number;
  onSave: (next: number) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));

  React.useEffect(() => setDraft(String(value)), [value]);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="group inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-foreground transition-colors hover:text-primary"
      >
        {formatCurrency(value)}
        <Pencil className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          R$
        </span>
        <Input
          type="number"
          min={0}
          step={1000}
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSave(Number(draft) || 0);
              setEditing(false);
            }
            if (e.key === 'Escape') setEditing(false);
          }}
          className="h-8 w-32 pl-7 tabular-nums"
          aria-label="Meta mensal"
        />
      </div>
      <Button
        size="sm"
        className="h-8"
        onClick={() => {
          onSave(Number(draft) || 0);
          setEditing(false);
        }}
      >
        Salvar
      </Button>
    </div>
  );
}

export function MetasComerciais({
  salespeople,
}: {
  salespeople: Salesperson[];
}) {
  const defaults = React.useMemo(
    () =>
      Object.fromEntries(salespeople.map((s) => [s.id, s.monthlyGoal])) as Record<
        string,
        number
      >,
    [salespeople],
  );
  const { goals, setGoal } = useSalesGoals(defaults);

  // Top do mês: por contratos fechados (critério do painel), desempate por valor.
  const topId = React.useMemo(() => {
    return [...salespeople].sort(
      (a, b) =>
        b.contractsMonth - a.contractsMonth ||
        b.closedValueMonth - a.closedValueMonth,
    )[0]?.id;
  }, [salespeople]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between border-b border-border/60">
        <CardTitle>Metas dos comerciais</CardTitle>
        <span className="text-xs text-muted-foreground">
          Clique na meta para editar
        </span>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {salespeople.map((person) => {
          const goal = goals[person.id] ?? person.monthlyGoal;
          const progress =
            goal > 0 ? (person.closedValueMonth / goal) * 100 : 0;
          const isTop = person.id === topId;
          return (
            <div key={person.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-secondary font-medium text-muted-foreground">
                      {initials(person.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {person.name}
                      </span>
                      {isTop && (
                        <Badge variant="warning" className="gap-1">
                          <Crown className="h-3 w-3" />
                          Top do mês
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {person.contractsMonth} contratos ·{' '}
                      {formatCurrency(person.averageTicket)} ticket médio
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">Meta</span>
                  <GoalEditor
                    value={goal}
                    onSave={(next) => setGoal(person.id, next)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatCurrency(person.closedValueMonth)}
                  </span>
                  <span
                    className={
                      progress >= 100
                        ? 'font-medium text-success'
                        : 'text-muted-foreground'
                    }
                  >
                    {formatPercent(progress, 0)} da meta
                  </span>
                </div>
                <ProgressBar
                  value={progress}
                  indicatorClassName={
                    progress >= 100 ? 'bg-success' : 'bg-primary'
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Acumulado no ano</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {formatCurrencyCompact(person.closedValueYear)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    · {person.contractsYear} contratos
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
