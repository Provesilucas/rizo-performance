'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'rizo:sales-goals';

/**
 * Metas mensais dos comerciais, editáveis e persistidas localmente.
 *
 * Hoje grava no `localStorage` (funciona sem backend). Na integração com a
 * API oficial, troque `read`/`persist` por `GET/PUT /salespeople/:id/goal`.
 */
export function useSalesGoals(defaults: Record<string, number>) {
  const [goals, setGoals] = useState<Record<string, number>>(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const stored = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      // Defaults garantem que novos comerciais apareçam mesmo sem registro.
      setGoals({ ...defaults, ...stored });
    } catch {
      setGoals(defaults);
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setGoal = useCallback((id: string, value: number) => {
    setGoals((prev) => {
      const next = { ...prev, [id]: Math.max(0, Math.round(value)) };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore quota/availability errors */
      }
      return next;
    });
  }, []);

  return { goals, setGoal, hydrated };
}
