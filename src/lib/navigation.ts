import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Clapperboard,
  FileText,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
  Target,
  Users,
  Wallet,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Descrição curta usada em tooltips/telas de índice. */
  description?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Estrutura de navegação da plataforma. Centralizada para que a Sidebar e
 * o Header (breadcrumb/título) leiam a mesma fonte de verdade.
 */
export const navSections: NavSection[] = [
  {
    label: 'Principal',
    items: [
      {
        title: 'Visão Geral',
        href: '/',
        icon: LayoutDashboard,
        description: 'Panorama executivo do mês',
      },
      {
        title: 'Comercial',
        href: '/comercial',
        icon: Target,
        description: 'Funil e ranking comercial',
      },
      {
        title: 'Financeiro',
        href: '/financeiro',
        icon: LineChart,
        description: 'Receita, recebimentos e ticket médio',
      },
    ],
  },
  {
    label: 'Operação',
    items: [
      {
        title: 'Produção',
        href: '/producao',
        icon: Clapperboard,
        description: 'Conteúdo, retenção e qualidade',
      },
      {
        title: 'Contratos',
        href: '/contratos',
        icon: FileText,
        description: 'Contratos e risco jurídico',
      },
      {
        title: 'Recebimentos',
        href: '/recebimentos',
        icon: Wallet,
        description: 'Contas a receber e vencidos',
      },
      {
        title: 'Influenciadores',
        href: '/influenciadores',
        icon: Users,
        description: 'Desempenho por influenciador',
      },
      {
        title: 'Marcas',
        href: '/marcas',
        icon: Building2,
        description: 'Desempenho por marca',
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        title: 'Relatórios',
        href: '/relatorios',
        icon: Sparkles,
        description: 'Relatórios e exportações',
      },
      {
        title: 'Configurações',
        href: '/configuracoes',
        icon: Settings,
        description: 'Preferências da conta',
      },
    ],
  },
];

/** Lista achatada — útil para lookup por href. */
export const navItems: NavItem[] = navSections.flatMap((s) => s.items);

/** Resolve o item de navegação ativo a partir do pathname. */
export function resolveActiveNav(pathname: string): NavItem | undefined {
  if (pathname === '/') return navItems.find((i) => i.href === '/');
  // Item mais específico que prefixa o pathname.
  return navItems
    .filter((i) => i.href !== '/' && pathname.startsWith(i.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
