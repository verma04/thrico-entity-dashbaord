import { Skeleton } from "@/components/ui/skeleton";

export function ClassificationSkeletonGrid({ 
  count = 8,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
}: { 
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="border rounded-xl p-4 shadow-sm space-y-3 bg-card"
        >
          <div className="flex items-center gap-2 border-b pb-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-1/2" />
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton
                  key={j}
                  className="h-6 w-6 rounded-full border-2 border-background"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
