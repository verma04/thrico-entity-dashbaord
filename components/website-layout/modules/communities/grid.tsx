import { cn } from "@/lib/utils";

interface CommunitiesGridProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const CommunitiesGrid = ({
  content,
  previewDevice,
}: CommunitiesGridProps) => {
  return (
    <div
      className={cn(
        "grid gap-6",
        previewDevice === "mobile"
          ? "grid-cols-1"
          : "grid-cols-2 lg:grid-cols-4"
      )}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const imageUrl = `https://images.unsplash.com/photo-${
          1500000000000 + i * 100000
        }?auto=format&fit=crop&w=400&q=80`;
        return (
          <div
            key={i}
            className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div
              className="h-32 bg-muted bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div className="p-4">
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
