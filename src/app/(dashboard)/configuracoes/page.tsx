import { Database, Palette, UserCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/shared';
import { AppearanceSettings } from '@/features/settings/appearance-settings';
import { env } from '@/lib/env';

export const metadata = { title: 'Configurações' };

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const isApi = env.dataProvider === 'api';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SectionHeader
        title="Configurações"
        description="Gerencie perfil, aparência e integrações da plataforma."
      />

      <Card>
        <CardHeader className="flex-row items-center gap-3 border-b border-border/60">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserCircle className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Informações da sua conta.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome">
              <Input defaultValue="Lucas Provesi" />
            </Field>
            <Field label="E-mail">
              <Input defaultValue="lucas@rizo.com.br" type="email" />
            </Field>
          </div>
          <Field label="Cargo">
            <Input defaultValue="Diretoria" />
          </Field>
          <div className="flex justify-end">
            <Button>Salvar alterações</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 border-b border-border/60">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Escolha o tema da interface.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <AppearanceSettings />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 border-b border-border/60">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Integração de dados</CardTitle>
            <CardDescription>
              Origem dos dados exibidos na plataforma.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Provedor atual
              </p>
              <p className="text-xs text-muted-foreground">
                {isApi
                  ? 'Conectado à API oficial da RIZO.'
                  : 'Dados simulados para demonstração.'}
              </p>
            </div>
            <Badge variant={isApi ? 'success' : 'warning'}>
              {isApi ? 'API RIZO' : 'Mock'}
            </Badge>
          </div>
          <div className="rounded-lg border border-border/60 px-4 py-3">
            <p className="text-sm font-medium text-foreground">Endpoint base</p>
            <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">
              {env.apiBaseUrl}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Para conectar ao sistema real, defina{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono">
              NEXT_PUBLIC_DATA_PROVIDER=api
            </code>{' '}
            e o token de acesso nas variáveis de ambiente. Consulte o README.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
