import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/** Placeholder de carregamento da Visão Geral. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="mt-4 h-4 w-24" />
            <Skeleton className="mt-2 h-7 w-28" />
            <Skeleton className="mt-3 h-4 w-32" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-6 h-[320px] w-full" />
        <Skeleton className="mt-6 h-24 w-full" />
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-6 h-[240px] w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
