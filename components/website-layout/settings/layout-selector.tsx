import { Label } from "@/components/ui/label";
import {
  LayoutType,
  ThemeType,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import {
  Layout,
  LayoutGrid,
  Square,
  Circle,
  Boxes,
  Sparkles,
  Check,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutSelectorProps {
  currentTheme: ThemeType;
  currentLayout: LayoutType;
  availableLayouts: LayoutType[];
  onLayoutChange: (layout: LayoutType) => void;
  type?: string;
}

// Layout icons and descriptions mapping
const layoutMetadata: Record<
  string,
  { icon: LucideIcon; description: string; color: string }
> = {
  carousel: {
    icon: Circle,
    description: "Rotating slides",
    color: "text-blue-500",
  },
  video: {
    icon: Square,
    description: "Video background",
    color: "text-red-500",
  },
  "saas-modern": {
    icon: Sparkles,
    description: "Modern SaaS",
    color: "text-purple-500",
  },
  "bento-grid": {
    icon: LayoutGrid,
    description: "Grid layout",
    color: "text-green-500",
  },
  newsletter: {
    icon: Layout,
    description: "Email signup",
    color: "text-orange-500",
  },
  "single-image": {
    icon: Square,
    description: "Single hero image",
    color: "text-cyan-500",
  },
  split: {
    icon: Boxes,
    description: "Split layout",
    color: "text-pink-500",
  },
  "fullwidth-embed": {
    icon: Layout,
    description: "Full width embed",
    color: "text-indigo-500",
  },
  contained: {
    icon: Square,
    description: "Contained box",
    color: "text-emerald-500",
  },
  direct: {
    icon: Sparkles,
    description: "Inline HTML",
    color: "text-violet-500",
  },
  iframe: {
    icon: Boxes,
    description: "Sandboxed iframe",
    color: "text-amber-500",
  },
  "custom-html": {
    icon: LayoutGrid,
    description: "Custom HTML",
    color: "text-blue-500",
  },
  default: {
    icon: Layout,
    description: "Standard layout",
    color: "text-gray-500",
  },
};

const layoutDisplayNames: Record<string, string> = {
  "fullwidth-embed": "Full Width Embed",
  contained: "Contained Box",
  direct: "Direct HTML",
  iframe: "Sandboxed IFrame",
  "custom-html": "Custom HTML",
};

const getLayoutInfo = (layout: LayoutType) => {
  return (
    layoutMetadata[layout] || {
      icon: Layout,
      description: "Custom layout",
      color: "text-gray-500",
    }
  );
};

export const LayoutSelector = ({
  currentTheme,
  currentLayout,
  availableLayouts,
  onLayoutChange,
  type,
}: LayoutSelectorProps) => {
  const { globalHeader, globalFooter } = useWebsiteBuilderStore();

  // Override currentLayout for navbar/footer
  if (type === "navbar" && globalHeader?.layout) {
    currentLayout = globalHeader.layout;
  }

  if (type === "footer" && globalFooter?.layout) {
    currentLayout = globalFooter.layout;
  }

  return (
    <div className="space-y-3 pb-2">
      <div className="flex items-center justify-between">
        <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
          Layout
        </Label>
        <span className="text-[9px] text-muted-foreground/50 capitalize font-medium">
          {currentTheme} Theme
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {availableLayouts.map((layout) => {
          const { icon: Icon, description, color } = getLayoutInfo(layout);
          const isSelected = currentLayout === layout;

          return (
            <button
              key={layout}
              onClick={() => onLayoutChange(layout)}
              className={cn(
                "flex items-center gap-2 p-1.5 rounded-md border text-left transition-all duration-150 group",
                isSelected
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                  : "border-transparent hover:bg-muted/40 hover:border-border/40 bg-muted/20"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-md transition-colors",
                  isSelected ? "bg-primary/15" : "bg-muted/60 group-hover:bg-card"
                )}
              >
                <Icon
                  className={cn(
                    "h-3 w-3",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={2}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "text-[10px] font-medium truncate capitalize",
                    isSelected ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                  )}
                >
                  {layoutDisplayNames[layout] || layout.replace(/-/g, " ")}
                </div>
              </div>
              
              {isSelected && <Check className="h-2.5 w-2.5 text-primary shrink-0 mr-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
