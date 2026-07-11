import Link from 'next/link';

import { env } from '@/lib/env';
import { Logo } from './logo';
import { SidebarNav } from './sidebar-nav';

/** Rodapé da sidebar indicando a origem dos dados (mock x API). */
function DataSourceBadge() {
  const isApi = env.dataProvider === 'api';
  return (
    <div className="mx-3 mb-4 flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-background/60 px-3 py-2.5">
      <span
        className={`relative flex h-2 w-2 ${isApi ? 'text-success' : 'text-warning'}`}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-medium text-foreground">
          {isApi ? 'API RIZO' : 'Dados simulados'}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {isApi ? 'Conectado' : 'Ambiente demo'}
        </span>
      </div>
    </div>
  );
}

/** Sidebar fixa (desktop). No mobile é substituída pelo drawer no Header. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
      </div>
      <SidebarNav />
      <DataSourceBadge />
    </aside>
  );
}
