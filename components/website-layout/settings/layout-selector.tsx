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
  Columns3,
  Building2,
  Mail,
  Rows,
  AlignCenter,
  Code2,
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
  { icon: LucideIcon; description: string }
> = {
  columns: {
    icon: Columns3,
    description: "Multi-column grid",
  },
  simple: {
    icon: AlignCenter,
    description: "Centered inline layout",
  },
  minimal: {
    icon: Rows,
    description: "Compact single bar",
  },
  corporate: {
    icon: Building2,
    description: "Enterprise heavy base",
  },
  newsletter: {
    icon: Mail,
    description: "Email capture centric",
  },
  carousel: {
    icon: Circle,
    description: "Rotating slides",
  },
  video: {
    icon: Square,
    description: "Video background",
  },
  "saas-modern": {
    icon: Sparkles,
    description: "Modern SaaS",
  },
  "bento-grid": {
    icon: LayoutGrid,
    description: "Grid layout",
  },
  "single-image": {
    icon: Square,
    description: "Single hero image",
  },
  split: {
    icon: Boxes,
    description: "Split layout",
  },
  "fullwidth-embed": {
    icon: Layout,
    description: "Full width embed",
  },
  contained: {
    icon: Square,
    description: "Contained box",
  },
  direct: {
    icon: Sparkles,
    description: "Inline HTML",
  },
  iframe: {
    icon: Boxes,
    description: "Sandboxed iframe",
  },
  "custom-html": {
    icon: Code2,
    description: "Manual / Custom HTML",
  },
  default: {
    icon: Layout,
    description: "Standard layout",
  },
};

const layoutDisplayNames: Record<string, string> = {
  columns: "Multi-Column",
  simple: "Centered Simple",
  minimal: "Minimal Clean Bar",
  corporate: "Corporate Base",
  newsletter: "Newsletter Focus",
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
    <div className="space-y-2 pb-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
          Layout Variant
        </Label>
        <span className="text-[10px] text-muted-foreground capitalize font-medium">
          {currentTheme} Theme
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {availableLayouts.map((layout) => {
          const { icon: Icon, description } = getLayoutInfo(layout);
          const isSelected = currentLayout === layout;

          return (
            <button
              type="button"
              key={layout}
              onClick={() => onLayoutChange(layout)}
              className={cn(
                "relative flex items-start gap-2.5 p-2 rounded-xl border text-left transition-all duration-150 cursor-pointer shadow-2xs group",
                isSelected
                  ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/20"
                  : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/60"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg border transition-colors shrink-0 mt-0.5",
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80"
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0 pr-3">
                <div
                  className={cn(
                    "text-xs font-semibold truncate capitalize",
                    isSelected
                      ? "text-indigo-950 dark:text-indigo-100"
                      : "text-[#303030] dark:text-zinc-100"
                  )}
                >
                  {layoutDisplayNames[layout] || layout.replace(/-/g, " ")}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight truncate mt-0.5">
                  {description}
                </div>
              </div>

              {isSelected && (
                <span className="absolute top-2 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-white shrink-0">
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
