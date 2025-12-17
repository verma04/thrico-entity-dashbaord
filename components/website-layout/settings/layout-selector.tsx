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
  default: {
    icon: Layout,
    description: "Standard layout",
    color: "text-gray-500",
  },
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">
          Layout Style
        </Label>
        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {currentTheme}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {availableLayouts.map((layout) => {
          const { icon: Icon, description, color } = getLayoutInfo(layout);
          const isSelected = currentLayout === layout;

          return (
            <div
              key={layout}
              onClick={() => onLayoutChange(layout)}
              className={cn(
                "group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ease-out",
                "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 bg-card/50 hover:bg-card"
              )}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "mb-2 transition-transform duration-300 group-hover:scale-110",
                  isSelected ? color : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 mx-auto" strokeWidth={2} />
              </div>

              {/* Layout name */}
              <div
                className={cn(
                  "text-xs font-medium text-center capitalize mb-1 transition-colors",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {layout.replace(/-/g, " ")}
              </div>

              {/* Description */}
              <div className="text-[10px] text-center text-muted-foreground">
                {description}
              </div>

              {/* Hover effect overlay */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                  "bg-gradient-to-br from-primary/5 to-transparent",
                  !isSelected && "group-hover:opacity-100"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
