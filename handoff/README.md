# RIZO Performance — Handoff estático (HTML)

Reprodução **estática** (HTML + CSS puro) de todas as telas do dashboard, para
referência de layout/identidade do desenvolvedor. **Não precisa de build nem
Node** — cada arquivo é autossuficiente (CSS embutido); basta abrir no navegador.

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

- Os **gráficos** são SVGs de referência (formato/estilo). No app são
  interativos (Recharts) e alimentados por dados reais.
- Valores exibidos são os **dados simulados** (mock) atuais do app.
- `_build.py` regenera todos os HTMLs a partir do template + `assets/rizo.css`
  (`python3 handoff/_build.py`).
