import { cn } from "@/lib/utils";

interface CommunitiesListProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const CommunitiesList = ({
  content,
  previewDevice,
}: CommunitiesListProps) => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => {
        const imageUrl = `https://images.unsplash.com/photo-${
          1500000000000 + i * 100000
        }?auto=format&fit=crop&w=400&q=80`;
        return (
          <div
            key={i}
            className={cn(
              "bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer",
              previewDevice === "mobile" ? "flex-col" : "flex"
            )}
          >
            <div
              className={cn(
                "bg-muted bg-cover bg-center",
                previewDevice === "mobile" ? "h-40 w-full" : "w-24 h-24"
              )}
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div className={cn("p-4", previewDevice !== "mobile" && "flex-1")}>
              <h3 className="font-semibold text-base sm:text-lg">
                {(content.communities || [])[i - 1]?.name || `Community ${i}`}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {(content.communities || [])[i - 1]?.description ||
                  "Community description"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
