'use client';

import { Suspense } from 'react';
import { CalendarDays } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryParam } from '@/hooks/use-query-param';
import { DEFAULT_PERIOD, parsePeriod, periodOptions } from '@/lib/periods';

/**
 * Seletor de período — sincroniza com o query param `?period`.
 * Envolto em Suspense pois `useSearchParams` exige um boundary durante
 * a renderização estática (Next App Router).
 */
export function PeriodSelect() {
  return (
    <Suspense fallback={<Skeleton className="h-9 w-[150px] rounded-md" />}>
      <PeriodSelectInner />
    </Suspense>
  );
}

function PeriodSelectInner() {
  const [raw, setValue] = useQueryParam('period');
  const current = parsePeriod(raw) ?? DEFAULT_PERIOD;

  return (
    <Select value={current} onValueChange={setValue}>
      <SelectTrigger className="h-9 w-[150px] gap-2" aria-label="Período">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periodOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
