import { env } from '@/lib/env';

/** Erro tipado emitido pela camada HTTP. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Cliente HTTP mínimo para a API oficial da RIZO.
 *
 * Centraliza base URL, autenticação (Bearer), timeout e tratamento de erro.
 * Substituível por qualquer client (axios, ky) mantendo esta assinatura.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.apiTimeout);

  const url = `${env.apiBaseUrl}${path}`;

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(env.apiToken ? { Authorization: `Bearer ${env.apiToken}` } : {}),
        ...init.headers,
      },
      // Revalidação a cada 60s no App Router (ajustável por endpoint).
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new ApiError(
        `Falha ao consultar a API (${response.status})`,
        response.status,
        url,
      );
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
