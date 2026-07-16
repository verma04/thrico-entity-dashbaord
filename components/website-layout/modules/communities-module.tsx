import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface CommunitiesModuleProps {
  content: ModuleData["content"];
  layout: string;
}

export const CommunitiesModule = ({
  content,
  layout,
}: CommunitiesModuleProps) => {
  const communities = content.communities || [];

  // If no valid communities, View More 6 with defaults
  const displayIndices = [1, 2, 3, 4, 5, 6];

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-gradient-to-b from-background to-muted/20"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />
      <div
        className={cn(
          "gap-4 sm:gap-6",
          layout === "grid" && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          layout === "list" && "flex flex-col space-y-4",
          layout === "cards" &&
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          layout === "masonry" &&
            "columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6",
        )}
      >
        {displayIndices.map((i) => {
          const community = communities[i - 1] || {};
          const imageUrl =
            community.image ||
            `https://images.unsplash.com/photo-${
              1500000000000 + i * 1000000
            }?w=800&h=600&fit=crop`;

          return (
            <div
              key={i}
              className={cn(
                "group bg-card border rounded-xl overflow-hidden transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
                "hover:border-primary/50",
                layout === "grid" && "flex flex-col h-full",
                layout === "list" && "flex flex-col sm:flex-row gap-4",
                layout === "cards" && "flex flex-col",
                layout === "masonry" && "break-inside-avoid",
              )}
            >
              {layout !== "list" && (
                <div
                  className={cn(
                    "relative w-full bg-muted overflow-hidden",
                    layout === "grid" && "h-48 sm:h-56 md:h-64",
                    layout === "cards" && "h-40 sm:h-48",
                    layout === "masonry" &&
                      `h-${[32, 48, 24, 64, 32, 24][i - 1]}`,
                  )}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {!community.image && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              )}
              {layout === "list" && (
                <div className="relative w-full sm:w-24 h-40 sm:h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                  {!community.image && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              )}
              <div className={cn("p-4 sm:p-5", layout === "list" && "flex-1")}>
                <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">
                  {community.name || `Community ${i}`}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {community.description ||
                    "Join our vibrant community and connect with like-minded individuals."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ModuleContainer>
  );
};
