import { cn } from "@/lib/utils";

interface CommunitiesCardsProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const CommunitiesCards = ({
  content,
  previewDevice,
}: CommunitiesCardsProps) => {
  return (
    <div
      className={cn(
        "grid gap-6",
        previewDevice === "mobile"
          ? "grid-cols-1"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => {
        const imageUrl = `https://images.unsplash.com/photo-${
          1500000000000 + i * 100000
        }?auto=format&fit=crop&w=400&q=80`;
        return (
          <div
            key={i}
            className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            <div
              className="h-48 bg-muted bg-cover bg-center group-hover:scale-105 transition-transform"
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">
                {(content.communities || [])[i - 1]?.name || `Community ${i}`}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {(content.communities || [])[i - 1]?.description ||
                  "Detailed community description with more content"}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                  {Math.floor(Math.random() * 500) + 100} members
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
