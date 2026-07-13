import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Influencer } from '@/interfaces';
import { formatCurrencyCompact } from '@/lib/format';

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/** Ranking compacto dos principais influenciadores por receita. */
export function TopInfluencers({
  influencers,
  limit = 5,
}: {
  influencers: Influencer[];
  limit?: number;
}) {
  const top = [...influencers]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);

  return (
    <ul className="space-y-3">
      {top.map((influencer, index) => (
        <li key={influencer.id} className="flex items-center gap-3">
          <span className="w-4 text-xs font-medium tabular-nums text-muted-foreground">
            {index + 1}
          </span>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-secondary font-medium text-muted-foreground">
              {initials(influencer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {influencer.name}
            </p>
            <p className="truncate text-xs text-success">
              {formatCurrencyCompact(influencer.revenue)} de receita
            </p>
          </div>
          <Badge variant="secondary" className="tabular-nums">
            {influencer.contracts}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
