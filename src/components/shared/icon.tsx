import {
  Clock,
  Flag,
  Gauge,
  FileSignature,
  Receipt,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Wallet,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

/**
 * Mapa nome → ícone. Permite que a camada de dados referencie ícones por
 * string (serializável) sem acoplar componentes React aos mocks/API.
 */
const ICONS: Record<string, LucideIcon> = {
  trophy: Trophy,
  target: Target,
  gauge: Gauge,
  flag: Flag,
  'trending-up': TrendingUp,
  wallet: Wallet,
  clock: Clock,
  receipt: Receipt,
  'file-signature': FileSignature,
  sparkles: Sparkles,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component {...props} />;
}
