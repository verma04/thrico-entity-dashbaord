import { cn } from "@/lib/utils";

interface CommunitiesMasonryProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const CommunitiesMasonry = ({
  content,
  previewDevice,
}: CommunitiesMasonryProps) => {
  return (
    <div
      className={cn(
        "gap-4",
        previewDevice === "mobile"
          ? "grid grid-cols-1"
          : "columns-2 lg:columns-4 space-y-4"
      )}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
        const imageUrl = `https://images.unsplash.com/photo-${
          1500000000000 + i * 100000
        }?auto=format&fit=crop&w=400&q=80`;
        const height = ["h-48", "h-64", "h-56", "h-40"][i % 4];
        return (
          <div
            key={i}
            className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer break-inside-avoid mb-4"
          >
            <div
              className={cn("bg-muted bg-cover bg-center", height)}
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div className="p-4">
              <h3 className="font-semibold text-sm">
                {(content.communities || [])[i - 1]?.name || `Community ${i}`}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
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
