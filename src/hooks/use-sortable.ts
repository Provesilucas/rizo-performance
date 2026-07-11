'use client';

import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<T> {
  key: keyof T;
  direction: SortDirection;
}

/**
 * Ordena uma lista por qualquer chave, com toggle de direção.
 * Memoiza o resultado para evitar reordenações desnecessárias.
 */
export function useSortable<T>(rows: T[], initial: SortState<T>) {
  const [sort, setSort] = useState<SortState<T>>(initial);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      let result = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        result = av - bv;
      } else {
        result = String(av).localeCompare(String(bv), 'pt-BR');
      }
      return sort.direction === 'asc' ? result : -result;
    });
    return copy;
  }, [rows, sort]);

  function toggle(key: keyof T) {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' },
    );
  }

  return { sorted, sort, toggle };
}
