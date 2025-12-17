import { Card } from "@/components/ui/card";
import { useGetListingStats } from "@/graphql/actions/listing";

export function ListingStats() {
  const { data } = useGetListingStats();

  const stats = data?.getListingStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {(Array.isArray(stats) ? stats : []).map((stat, i) => {
        return (
          <Card key={i} className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.change}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
