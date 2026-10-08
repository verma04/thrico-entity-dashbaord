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
    fontFamily: "var(--font-inter), sans-serif",
  },
  {
    id: "roboto",
    name: "Roboto",
    description: "Classic, readable",
    preview: "Google's signature font",
    fontFamily: "var(--font-roboto), sans-serif",
  },
  {
    id: "open-sans",
    name: "Open Sans",
    description: "Neutral, versatile",
    preview: "Optimized for legibility",
    fontFamily: "var(--font-open-sans), sans-serif",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    description: "Geometric, modern",
    preview: "Urban typography",
    fontFamily: "var(--font-montserrat), sans-serif",
  },
  {
    id: "lato",
    name: "Lato",
    description: "Humanist, warm",
    preview: "Friendly and serious",
    fontFamily: "var(--font-lato), sans-serif",
  },
  {
    id: "poppins",
    name: "Poppins",
    description: "Friendly, rounded",
    preview: "Geometric sans-serif",
    fontFamily: "var(--font-poppins), sans-serif",
  },
  {
    id: "nunito",
    name: "Nunito",
    description: "Rounded, friendly",
    preview: "Well-balanced curves",
    fontFamily: "var(--font-nunito), sans-serif",
  },
  {
    id: "source-sans",
    name: "Source Sans Pro",
    description: "UI optimized",
    preview: "Works well in user interfaces",
    fontFamily: "var(--font-source-sans-3), sans-serif",
  },
  {
    id: "work-sans",
    name: "Work Sans",
    description: "Display, functional",
    preview: "Optimized for screen usage",
    fontFamily: "var(--font-work-sans), sans-serif",
  },
  {
    id: "ubuntu",
    name: "Ubuntu",
    description: "Humanist, distinctive",
    preview: "Modern and unique style",
    fontFamily: "var(--font-ubuntu), sans-serif",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    description: "Serif, traditional",
    preview: "Designed for screens",
    fontFamily: "var(--font-merriweather), serif",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    description: "Elegant, serif",
    preview: "High-contrast serif",
    fontFamily: "var(--font-playfair), serif",
  },
  {
    id: "lora",
    name: "Lora",
    description: "Calligraphic, serif",
    preview: "Roots in calligraphy",
    fontFamily: "var(--font-lora), serif",
  },
  {
    id: "cormorant",
    name: "Cormorant Garamond",
    description: "Classic, elegant",
    preview: "Inspired by Garamond",
    fontFamily: "var(--font-cormorant-garamond), serif",
  },
  {
    id: "bitter",
    name: "Bitter",
    description: "Slab serif",
    preview: "Designed for reading",
    fontFamily: "var(--font-bitter), serif",
  },
  {
    id: "oswald",
    name: "Oswald",
    description: "Condensed, display",
    preview: "Reworking of classic gothic",
    fontFamily: "var(--font-oswald), sans-serif",
  },
  {
    id: "raleway",
    name: "Raleway",
    description: "Elegant, thin",
    preview: "Elegant sans-serif",
    fontFamily: "var(--font-raleway), sans-serif",
  },
  {
    id: "bebas-neue",
    name: "Bebas Neue",
    description: "Display, caps",
    preview: "Popular display font",
    fontFamily: "var(--font-bebas-neue), sans-serif",
  },
  {
    id: "cinzel",
    name: "Cinzel",
    description: "Cinematic, serif",
    preview: "Inspired by roman inscriptions",
    fontFamily: "var(--font-cinzel), serif",
  },
  {
    id: "pacifico",
    name: "Pacifico",
    description: "Handwriting, fun",
    preview: "Brush script font",
    fontFamily: "var(--font-pacifico), cursive",
  },
  {
    id: "fira-code",
    name: "Fira Code",
    description: "Monospaced, developer",
    preview: "Code-friendly font",
    fontFamily: "var(--font-fira-code), monospace",
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-[#616161] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Type className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
          Typography
        </h3>
      </div>

      {/* Current Font Display */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative group",
              isPremium ? "cursor-pointer" : "cursor-not-allowed opacity-80",
            )}
            onClick={() => isPremium && setIsExpanded(!isExpanded)}
          >
            <div
              className={cn(
                "flex items-center gap-2.5 p-2 rounded-[8px] border transition-all duration-150 bg-white dark:bg-zinc-900",
                isPremium
                  ? "border-[#d2d5d9] dark:border-zinc-800 hover:border-[#303030] dark:hover:border-zinc-500 shadow-2xs"
                  : "border-[#d2d5d9] dark:border-zinc-800 grayscale",
              )}
            >
              <div className="shrink-0 p-1.5 rounded-[5px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700">
                <Type className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block"
                  style={{ fontFamily: currentFontData.fontFamily }}
                >
                  {currentFontData.name}
                </span>
                <p className="text-[10.5px] text-[#616161] dark:text-zinc-400 truncate leading-tight">
                  {currentFontData.description}
                </p>
              </div>
              {!isPremium ? (
                <Lock className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              ) : (
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-muted-foreground transition-transform duration-150 shrink-0",
                    isExpanded && "rotate-180",
                  )}
                />
              )}
            </div>
          </div>
        </TooltipTrigger>
        {!isPremium && (
          <TooltipContent side="right" className="max-w-xs text-xs">
            <div className="space-y-1">
              <p className="font-semibold">Premium Feature</p>
              <p className="text-[11px] text-muted-foreground">
                Upgrade to access {FONTS.length} professional font families for your website.
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Upgrade Prompt for Non-Premium Users */}
      {!isPremium && (
        <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <p className="text-[10.5px] font-medium text-indigo-950 dark:text-indigo-200 mb-1.5">
            ✨ Unlock {FONTS.length} premium fonts
          </p>
          <Button
            type="button"
            onClick={() => openDrawer()}
            size="sm"
            className="w-full h-6.5 text-[10px] font-semibold bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs cursor-pointer"
          >
            Upgrade Plan
          </Button>
        </div>
      )}

      {/* Font Options Grid */}
      <div
        className={cn(
          "grid gap-2 transition-all duration-200 overflow-hidden",
          isExpanded
            ? "grid-rows-[1fr] opacity-100 pt-1"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-1.5 max-h-[260px] overflow-y-auto pr-1 pb-1">
            {FONTS.map((fontOption) => {
              const isSelected = font === fontOption.id;

              return (
                <button
                  key={fontOption.id}
                  type="button"
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
                    "flex items-center gap-2 p-2 rounded-[6px] border text-left transition-all cursor-pointer w-full",
                    isSelected
                      ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-[4px] border shrink-0 transition-colors",
                      isSelected
                        ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                    )}
                  >
                    <Type className="h-3 w-3" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block"
                        style={{ fontFamily: fontOption.fontFamily }}
                      >
                        {fontOption.name}
                      </span>
                      {isSelected && (
                        <Check className="h-3 w-3 text-[#303030] dark:text-zinc-100 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#616161] dark:text-zinc-400 truncate mt-0.5">
                      {fontOption.preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
