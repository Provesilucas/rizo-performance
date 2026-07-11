import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

/** Usuário autenticado (mock). Substituir pela sessão real na integração. */
const CURRENT_USER = {
  name: 'Lucas Provesi',
  email: 'lucas@rizo.com.br',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header user={CURRENT_USER} />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
