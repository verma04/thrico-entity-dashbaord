import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const PlanCardSkeleton = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-32 ml-4" />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="relative w-full max-w-xs bg-background border rounded-xl shadow-sm flex flex-col p-6"
          >
            <Skeleton className="absolute top-2 right-2 h-6 w-20" />

            <div className="text-center mb-4">
              <Skeleton className="h-7 w-32 mx-auto mb-2" />
              <Skeleton className="h-10 w-40 mx-auto mt-4" />
              <Skeleton className="h-4 w-28 mx-auto mt-2" />
            </div>

            <div className="flex flex-col gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex flex-col gap-2 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-1" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>

            <Skeleton className="h-10 w-full mt-auto" />
          </div>
        ))}
      </div>
    </>
  );
};
