import React from "react";
import {
  FontType,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Type, Check, ChevronDown, Lock } from "lucide-react";
import { useIsPremium } from "@/hooks/useIsPremium";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useDrawerStore } from "@/store/drawerStore";
import { useGetWebsite, useUpdateWebsiteFont } from "@/graphql/actions/website";

const FONTS: {
  id: FontType;
  name: string;
  description: string;
  preview: string;
  fontFamily: string;
}[] = [
  {
    id: "inter",
    name: "Inter",
    description: "Modern, clean",
    preview: "Perfect for modern websites",
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: "roboto",
    name: "Roboto",
    description: "Classic, readable",
    preview: "Google's signature font",
    fontFamily: "'Roboto', sans-serif",
  },
  {
    id: "poppins",
    name: "Poppins",
    description: "Friendly, rounded",
    preview: "Geometric sans-serif",
    fontFamily: "'Poppins', sans-serif",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    description: "Elegant, serif",
    preview: "High-contrast serif",
    fontFamily: "'Playfair Display', serif",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    description: "Geometric, modern",
    preview: "Urban typography",
    fontFamily: "'Montserrat', sans-serif",
  },
  {
    id: "lato",
    name: "Lato",
    description: "Humanist, warm",
    preview: "Friendly and serious",
    fontFamily: "'Lato', sans-serif",
  },
  {
    id: "open-sans",
    name: "Open Sans",
    description: "Neutral, versatile",
    preview: "Optimized for legibility",
    fontFamily: "'Open Sans', sans-serif",
  },
  {
    id: "raleway",
    name: "Raleway",
    description: "Elegant, thin",
    preview: "Elegant sans-serif",
    fontFamily: "'Raleway', sans-serif",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    description: "Serif, traditional",
    preview: "Designed for screens",
    fontFamily: "'Merriweather', serif",
  },
  {
    id: "nunito",
    name: "Nunito",
    description: "Rounded, friendly",
    preview: "Well-balanced curves",
    fontFamily: "'Nunito', sans-serif",
  },
  {
    id: "sans-serif",
    name: "Sans Serif",
    description: "System default",
    preview: "Clean system font",
    fontFamily: "sans-serif",
  },
  {
    id: "verdana",
    name: "Verdana",
    description: "Wide, readable",
    preview: "Designed for screens",
    fontFamily: "Verdana, Geneva, sans-serif",
  },
  {
    id: "georgia",
    name: "Georgia",
    description: "Classic serif",
    preview: "Elegant and readable",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "comic-sans",
    name: "Comic Sans MS",
    description: "Casual, playful",
    preview: "Informal and friendly",
    fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
  },
  {
    id: "arial-narrow",
    name: "Arial Narrow",
    description: "Condensed, narrow",
    preview: "Space-efficient",
    fontFamily: "'Arial Narrow', Arial, sans-serif",
  },
  {
    id: "impact",
    name: "Impact",
    description: "Bold, wide",
    preview: "Strong and attention-grabbing",
    fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  },
];

const FontSelector = () => {
  const { openDrawer } = useDrawerStore();

  const { font, setFont } = useWebsiteBuilderStore();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { isPremium } = useIsPremium();

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const [updateFontMutation] = useUpdateWebsiteFont();

  const currentFontData = FONTS.find((f) => f.id === font) || FONTS[0];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          Font Family
        </h3>
        <span className="text-xs text-muted-foreground">
          {FONTS.length} options
        </span>
      </div>

      {/* Current Font Display */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative group",
              isPremium ? "cursor-pointer" : "cursor-not-allowed opacity-80"
            )}
            onClick={() => isPremium && setIsExpanded(!isExpanded)}
          >
            <div
              className={cn(
                "flex items-center gap-3 bg-card p-4 rounded-xl border-2 transition-all duration-200",
                isPremium
                  ? "border-primary/30 hover:border-primary/50 group-hover:shadow-md"
                  : "border-muted-foreground/20 grayscale"
              )}
            >
              <div className="shrink-0 p-2 rounded-lg bg-primary/10">
                <Type className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-semibold text-foreground"
                    style={{ fontFamily: currentFontData.fontFamily }}
                  >
                    {currentFontData.name}
                  </span>
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentFontData.description}
                </p>
              </div>
              {!isPremium ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
            </div>
          </div>
        </TooltipTrigger>
        {!isPremium && (
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">Premium Feature</p>
              <p className="text-xs">
                Upgrade to access {FONTS.length} professional font families for
                your website.
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Upgrade Prompt for Non-Premium Users */}
      {!isPremium && (
        <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-xs text-muted-foreground mb-2">
            ✨ Unlock {FONTS.length} premium fonts
          </p>
          <Button
            onClick={() => openDrawer()}
            size="sm"
            variant="outline"
            className="w-full h-7 text-xs"
          >
            Upgrade Subscription
          </Button>
        </div>
      )}

      {/* Font Options Grid */}
      <div
        className={cn(
          "grid gap-2 transition-all duration-300 overflow-hidden",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-2 pb-2">
            {FONTS.map((fontOption) => {
              const isSelected = font === fontOption.id;

              return (
                <button
                  key={fontOption.id}
                  onClick={() => {
                    setFont(fontOption.id);
                    setIsExpanded(false);
                    if (websiteId) {
                      updateFontMutation({
                        variables: {
                          websiteId,
                          font: fontOption.id,
                        },
                      });
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left group hover:scale-[1.01] active:scale-[0.99]",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20"
                      : "border-border/30 bg-card hover:bg-muted/50 hover:border-border/60"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      isSelected ? "bg-primary/20" : "bg-muted"
                    )}
                  >
                    <Type
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                        style={{ fontFamily: fontOption.fontFamily }}
                      >
                        {fontOption.name}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {fontOption.preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Font Info */}
      <div className="pt-2 pb-1">
        <p className="text-xs text-muted-foreground text-center italic">
          Font applies to all pages and modules
        </p>
      </div>
    </div>
  );
};

export default FontSelector;
