import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendPill } from '@/components/shared';
import type { Influencer } from '@/interfaces';
import { formatCurrencyCompact, formatNumber } from '@/lib/format';

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function formatFollowers(value: number): string {
  if (value >= 1_000_000)
    return `${(value / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}

export function InfluencerCard({ influencer }: { influencer: Influencer }) {
  return (
    <Card className="p-5 transition-colors duration-200 hover:border-foreground/20">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarFallback className="bg-primary/10 text-sm text-primary">
            {initials(influencer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">
            {influencer.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {influencer.handle} · {formatFollowers(influencer.followers)}{' '}
            seguidores
          </p>
        </div>
        <Badge variant="secondary">{influencer.niche}</Badge>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Metric
          label="Faturamento"
          value={formatCurrencyCompact(influencer.revenue)}
        />
        <Metric
          label="Recebido"
          value={formatCurrencyCompact(influencer.received)}
        />
        <Metric label="Contratos" value={formatNumber(influencer.contracts)} />
        <Metric
          label="Campanhas ativas"
          value={formatNumber(influencer.activeCampaigns)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-xs text-muted-foreground">
          Evolução vs. mês anterior
        </span>
        <TrendPill value={influencer.growthPercent} />
      </div>
    </Card>
  );
}
