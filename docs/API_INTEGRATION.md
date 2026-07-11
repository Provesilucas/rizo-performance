# Integração com a API oficial da RIZO

Este documento explica **exatamente onde e como** conectar a plataforma ao
sistema oficial da RIZO. A interface do usuário **não muda** — toda a troca
acontece na camada de dados.

## Visão geral da arquitetura de dados

```
 Server Components / Pages
          │
          ▼
   src/services  ────────────►  Fachada de negócio (cache/orquestração)
          │
          ▼
 src/providers/index.ts  ────►  Adapter/Factory (escolhe a implementação)
          │
   ┌──────┴───────┐
   ▼              ▼
MockProvider   ApiProvider  ──►  src/providers/http-client.ts ──► API RIZO
(src/mocks)    (REST)
```

- A UI depende **apenas** do contrato `DataProvider`
  ([`src/providers/data-provider.ts`](../src/providers/data-provider.ts)).
- `getDataProvider()`
  ([`src/providers/index.ts`](../src/providers/index.ts)) devolve `MockProvider`
  ou `ApiProvider` conforme `NEXT_PUBLIC_DATA_PROVIDER`.

## Passo a passo

### 1. Variáveis de ambiente

```bash
NEXT_PUBLIC_DATA_PROVIDER=api
NEXT_PUBLIC_API_BASE_URL=https://api.rizo.com.br/v1
RIZO_API_TOKEN=seu_token_secreto
NEXT_PUBLIC_API_TIMEOUT=15000
```

### 2. Onde a API é conectada

O único arquivo que fala com a API é
[`src/providers/api-provider.ts`](../src/providers/api-provider.ts). Cada método
mapeia para um endpoint REST:

| Método (`DataProvider`)  | Endpoint sugerido               | Retorno esperado                |
| ------------------------ | ------------------------------- | ------------------------------- |
| `getDashboardOverview`   | `GET /dashboard/overview`       | `DataResult<DashboardOverview>` |
| `getCommercialData`      | `GET /commercial`               | `DataResult<CommercialData>`    |
| `getFinancialData`       | `GET /financial`                | `DataResult<FinancialData>`     |
| `getContracts`           | `GET /contracts`                | `DataResult<Contract[]>`        |
| `getReceivables`         | `GET /receivables`              | `DataResult<Receivable[]>`      |
| `getInfluencers`         | `GET /influencers`              | `DataResult<Influencer[]>`      |
| `getBrands`              | `GET /brands`                   | `DataResult<Brand[]>`           |
| `getContentProduction`   | `GET /production`               | `DataResult<ContentProduction>` |

Todos recebem `?period=this-month|last-month|quarter|year`.

### 3. Autenticação

Centralizada em
[`src/providers/http-client.ts`](../src/providers/http-client.ts): injeta
`Authorization: Bearer <RIZO_API_TOKEN>`, aplica timeout e trata erros
(`ApiError`). Para outro esquema de auth (OAuth, cookie, API key), ajuste apenas
este arquivo.

### 4. Formato de resposta

Cada endpoint deve devolver o envelope:

```jsonc
{
  "data": { /* payload conforme a interface da entidade */ },
  "syncedAt": "2026-07-10T09:42:00.000Z"
}
```

As interfaces de todas as entidades estão em
[`src/interfaces`](../src/interfaces). Exemplo (`DashboardOverview`) em
[`src/interfaces/dashboard.ts`](../src/interfaces/dashboard.ts).

### 5. Quando o payload da API for diferente

Se a API real não devolver exatamente o formato das interfaces, **não altere a
UI**. Adicione um _adapter_ dentro do `ApiProvider`:

```ts
async getDashboardOverview(period: PeriodRange) {
  const raw = await apiFetch<RawOverview>(`/dashboard/overview?period=${period}`);
  return {
    data: mapOverview(raw),   // ← converte o payload da API p/ DashboardOverview
    syncedAt: raw.updated_at,
  };
}
```

Regras de negócio já disponíveis para reaproveitar caso a API entregue apenas
números brutos:

- `computeGoalSummary` / `buildGoalEvolutionSeries` em
  [`src/utils/goal.ts`](../src/utils/goal.ts) — ritmo esperado, projeção e a
  mensagem automática da "Evolução da Meta".
- `percentChange`, `resolveTrend` em
  [`src/utils/trend.ts`](../src/utils/trend.ts) — variações e tendências.

### 6. Checklist de validação

- [ ] `NEXT_PUBLIC_DATA_PROVIDER=api` e token configurados.
- [ ] Endpoints respondendo no formato `DataResult<T>`.
- [ ] Campos alinhados às interfaces (ou adapter implementado).
- [ ] `npm run typecheck`, `npm run lint` e `npm run build` sem erros.
- [ ] Estados de erro/carregamento verificados (o `ApiError` cai no
      `error.tsx` do painel).

> Dica: valide um endpoint por vez trocando o método correspondente no
> `ApiProvider`, mantendo os demais no mock durante a transição.
