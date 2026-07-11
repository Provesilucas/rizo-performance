'use client';

import { useEffect } from 'react';

import { ErrorState } from '@/components/shared';

/** Error boundary do grupo de rotas do dashboard. */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ponto de instrumentação: enviar para observabilidade (Sentry etc.).
    console.error(error);
  }, [error]);

  return (
    <div className="py-10">
      <ErrorState
        title="Algo deu errado"
        description="Não foi possível carregar esta seção. Tente novamente."
        onRetry={reset}
      />
    </div>
  );
}
