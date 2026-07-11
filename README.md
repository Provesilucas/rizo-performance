# RIZO Performance

Plataforma executiva de gestão e performance da agência **RIZO** — comercial,
financeiro e influenciadores em um só lugar. Um dashboard premium inspirado nos
melhores produtos SaaS do mercado (Stripe, Linear, Vercel, Notion), construído
para uso diário pela diretoria.

Funciona com **dados simulados** por padrão e já está **preparada para conectar
ao sistema oficial da RIZO** via API REST — trocando apenas uma variável de
ambiente, sem alterar a interface.

---

## ✨ Destaques

- **Visão Geral executiva** enxuta — 4 KPIs em destaque + leitura visual que
  cruza comercial, financeiro, produção e jurídico: Evolução da Meta, receita
  mensal, produção & retenção, risco jurídico dos contratos e receita por marca.
- **Evolução da Meta** — gráfico com meta acumulada, realizado e projeção, além
  de cálculo automático de ritmo esperado × realizado e mensagem interpretativa
  (acima / dentro / abaixo do esperado).
- **Comercial** — funil enxuto (Prospecção → Reunião → Proposta → Negociação →
  Fechado + perdidos) e ranking comercial ordenável.
- **Financeiro** — receita mensal (recebido × previsto), contratos, ticket médio,
  receita por influenciador e por marca, contas a receber e vencidos.
- **Produção de conteúdo** (Rizo Director AI) — vídeos entregues, nota de
  retenção prevista (0-10), aprovação no controle de qualidade (9 checagens),
  produção por criador (Lucas, Yasmin, RIZO) e temas mais recorrentes.
- **Contratos com risco jurídico** (Validador de Contratos) — status Aprovado /
  Ressalvas / Reprovado, risk score, issues críticos/importantes e sinalização
  de "requer revisão jurídica".
- **Recebimentos / Influenciadores / Marcas** — tabelas com filtros e visões
  de desempenho por entidade.
- **UX premium** — modo claro (padrão) e escuro, responsivo (desktop → mobile),
  skeletons, empty/error states, animações suaves e acessibilidade.

---

## 🧱 Stack

| Camada        | Tecnologia                                    |
| ------------- | --------------------------------------------- |
| Framework     | Next.js 14 (App Router) + React 18            |
| Linguagem     | TypeScript (strict)                           |
| Estilo        | Tailwind CSS + design tokens (CSS variables)  |
| Componentes   | shadcn/ui (Radix UI) + CVA                     |
| Gráficos      | Recharts                                      |
| Ícones        | lucide-react                                  |
| Formulários   | React Hook Form + Zod                         |
| Tema          | next-themes                                   |
| Qualidade     | ESLint + Prettier                             |

Renderização com **Server Components** por padrão; componentes de cliente apenas
onde há interatividade (gráficos, filtros, menus).

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── (dashboard)/            # Grupo de rotas com sidebar + header
│   │   ├── layout.tsx          # Layout do painel
│   │   ├── page.tsx            # Visão Geral
│   │   ├── comercial/          # Funil + ranking
│   │   ├── financeiro/         # Gráficos financeiros
│   │   ├── producao/           # Produção de conteúdo (Rizo Director AI)
│   │   ├── contratos/          # Contratos + risco jurídico
│   │   ├── recebimentos/       # Contas a receber
│   │   ├── influenciadores/    # Cards de influenciadores
│   │   ├── marcas/             # Cards de marcas
│   │   ├── relatorios/         # Relatórios/exportações
│   │   ├── configuracoes/      # Preferências e integração
│   │   └── error.tsx           # Error boundary do painel
│   ├── layout.tsx              # Layout raiz (fontes, providers)
│   ├── globals.css             # Sistema de cores e tipografia
│   └── not-found.tsx           # Página 404
│
├── components/
│   ├── ui/                     # Primitivos shadcn/ui (Button, Card, …)
│   ├── layout/                 # Sidebar, Header, navegação, tema
│   ├── charts/                 # Gráficos e tooltip reutilizáveis
│   ├── shared/                 # StatCard, estados, indicadores
│   └── providers/              # Theme + Tooltip providers
│
├── features/                   # Componentes por domínio (dashboard, commercial…)
├── hooks/                      # Hooks reutilizáveis (sortable, query param)
├── interfaces/                 # Interfaces de TODAS as entidades do domínio
├── lib/                        # utils, format, env, navegação, períodos
├── services/                   # Fachada de negócio consumida pela UI
├── providers/                  # Camada de dados (Mock/API + adapter)
├── mocks/                      # Dados simulados (só o MockProvider os usa)
└── utils/                      # Regras de negócio puras (metas, tendências)
```

### Princípios de arquitetura

- **Nenhum mock dentro de componentes.** Dados vêm sempre da camada de serviços.
- **UI desacoplada da origem dos dados** — a interface conhece apenas o contrato
  `DataProvider`; a implementação (mock ou API) é escolhida em runtime.
- **Regras de negócio puras e testáveis** em `src/utils` (ex.: cálculo de ritmo
  de meta e projeção), reutilizáveis tanto pelo mock quanto pela API.
- **Componentes reutilizáveis** e tipagem forte de ponta a ponta.

---

## 🚀 Instalação e uso

Pré-requisitos: **Node.js 18.18+** (recomendado 20+).

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis (opcional — o padrão já usa mocks)
cp .env.example .env.local

# 3. Ambiente de desenvolvimento
npm run dev
# → http://localhost:3000
```

### Scripts

| Comando             | Descrição                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento                |
| `npm run build`     | Build de produção                          |
| `npm run start`     | Servir o build de produção                 |
| `npm run lint`      | ESLint                                     |
| `npm run typecheck` | Checagem de tipos (tsc)                    |
| `npm run format`    | Formatação com Prettier                    |

---

## 🔐 Variáveis de ambiente

Veja `.env.example`. Todas são opcionais em modo mock.

| Variável                     | Padrão                        | Descrição                                   |
| ---------------------------- | ----------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_DATA_PROVIDER`  | `mock`                        | `mock` (simulado) ou `api` (sistema real)   |
| `NEXT_PUBLIC_API_BASE_URL`   | `https://api.rizo.com.br/v1`  | URL base da API oficial                     |
| `RIZO_API_TOKEN`             | —                             | Token Bearer (apenas servidor, não exposto) |
| `NEXT_PUBLIC_API_TIMEOUT`    | `15000`                       | Timeout das requisições (ms)                |

> `RIZO_API_TOKEN` **não** tem prefixo `NEXT_PUBLIC_`: fica restrita ao servidor.
> Como o consumo de dados ocorre em Server Components, o token nunca chega ao
> navegador.

---

## 🔌 Integração com a API oficial da RIZO

A troca de dados simulados para a API real é feita **sem alterar a UI**.

1. Defina as variáveis:
   ```bash
   NEXT_PUBLIC_DATA_PROVIDER=api
   NEXT_PUBLIC_API_BASE_URL=https://api.rizo.com.br/v1
   RIZO_API_TOKEN=seu_token_secreto
   ```
2. Ajuste, se necessário, os endpoints em
   [`src/providers/api-provider.ts`](src/providers/api-provider.ts).
3. Se o payload da API divergir das interfaces em `src/interfaces`, adicione o
   mapeamento (adapter) dentro do próprio `ApiProvider` — a interface continua
   intacta.

Detalhes completos (contrato, endpoints, formato de resposta e checklist) em
**[`docs/API_INTEGRATION.md`](docs/API_INTEGRATION.md)**.

---

## ☁️ Deploy na Vercel

1. Faça o push do repositório para o GitHub/GitLab.
2. Importe o projeto na [Vercel](https://vercel.com/new) — o framework Next.js é
   detectado automaticamente.
3. Configure as variáveis de ambiente no painel (Project → Settings →
   Environment Variables).
4. Deploy. Nenhuma configuração adicional é necessária.

---

## ♿ Acessibilidade & Performance

- Navegação por teclado, `aria-*`, foco visível e contraste adequado.
- Server Components + `Suspense` por rota, `optimizePackageImports` para
  `lucide-react`/`recharts`, memoização em listas ordenáveis e code-splitting
  automático do App Router.

---

## 📄 Licença

Projeto proprietário — RIZO. Uso interno.
