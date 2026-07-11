import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="text-6xl font-semibold tracking-tight text-foreground">
          404
        </p>
        <h1 className="text-lg font-medium text-foreground">
          Página não encontrada
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Voltar para a Visão Geral
        </Link>
      </Button>
    </div>
  );
}
