# RIZO Performance — Handoff interativo (HTML)

Reprodução de todas as telas do dashboard em **HTML + CSS + JavaScript puro**
(sem dependências, sem build, sem Node). Cada arquivo é **autossuficiente**
(CSS e JS embutidos) — basta abrir no navegador com duplo-clique.

## Funcionalidades (iguais ao app)

- 🌗 **Dark mode** — botão de tema no cabeçalho (persiste em `localStorage`).
- 📈 **Evolução da Meta** — filtro **Mês / Trimestre / Semestre / Ano**,
  **navegação entre períodos** (‹ ›, incl. 2025 para comparativo) e botão
  **Comparar** com o mesmo período do ano anterior. O gráfico é desenhado
  dinamicamente em SVG.
- 🎯 **Metas dos comerciais editáveis** — clique na meta, edite e salve
  (recalcula % e barra; persiste em `localStorage`).
- 💰 **Faturamento** — botão **Comparar 2025** sobrepõe o ano anterior.
- 🔎 **Tabelas** (Contratos, Recebimentos) — abas de filtro por status + busca.
- 📅 Seletor de período no cabeçalho.

> A **implementação real** (fonte da verdade) é o app Next.js + TypeScript +
> Tailwind neste mesmo repositório, publicado em https://rizo-performance.vercel.app

## Como usar

Abra **`index.html`** no navegador (duplo-clique). A sidebar navega entre todas
as telas:

| Arquivo | Tela |
| --- | --- |
| `index.html` | Visão Geral |
| `comercial.html` | Comercial (metas, funil, breakdown) |
| `financeiro.html` | Financeiro |
| `producao.html` | Produção de conteúdo |
| `contratos.html` | Contratos + risco jurídico |
| `recebimentos.html` | Recebimentos |
| `influenciadores.html` | Influenciadores |
| `marcas.html` | Marcas |
| `relatorios.html` | Relatórios |
| `configuracoes.html` | Configurações |

## Identidade (tokens)

Definidos no topo de `assets/rizo.css` e espelham 1:1 os do app
(`src/app/globals.css`):

- **Magenta RIZO** `#BA4073` (principal) · Off-white `#EDEDE8` · Preto profundo
  `#272727` · Azul `#5206FA` · Violeta `#A957D1` · Laranja `#E58A32`
- Fontes: **Unbounded** (display/logo) + **Lexend** (corpo)

## Observações

- Valores exibidos são os **dados simulados** (mock) atuais do app.
- A lógica (JS) e os estilos (CSS) ficam em `assets/rizo.js` e `assets/rizo.css`
  e são **embutidos** em cada página na geração.
- `_build.py` regenera todos os HTMLs a partir do template + assets + dados
  (`python3 handoff/_build.py`). Os dados da Evolução da Meta e da Receita são
  computados em Python e injetados como JSON em cada página.
- **Fonte da verdade:** a implementação real (Next.js + TS + Tailwind + Recharts)
  neste repositório — o handoff é uma referência fiel de UI e comportamento.
