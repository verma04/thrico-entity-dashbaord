import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignHorizontalSpaceBetween,
  AlignHorizontalSpaceAround,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Rows,
  Columns,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutSettings {
  flexDirection?: "row" | "column";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
  alignItems?: "start" | "center" | "end" | "stretch";
}

interface CommonHeaderSettingsProps {
  title?: string;
  description?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  titleLabel?: string;
  descriptionLabel?: string;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  // Layout controls
  showLayoutControls?: boolean;
  layoutSettings?: LayoutSettings;
  onLayoutChange?: (layout: LayoutSettings) => void;
}

export const CommonHeaderSettings = ({
  title = "",
  description = "",
  onTitleChange,
  onDescriptionChange,
  titleLabel = "Heading / Title",
  descriptionLabel = "Description",
  titlePlaceholder = "Enter module title...",
  descriptionPlaceholder = "Enter short description...",
  showLayoutControls = true,
  layoutSettings = {
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
  },
  onLayoutChange,
}: CommonHeaderSettingsProps) => {
  const handleLayoutChange = (key: keyof LayoutSettings, value: any) => {
    if (onLayoutChange) {
      onLayoutChange({
        ...layoutSettings,
        [key]: value,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Layout Controls */}
      {showLayoutControls && (
        <div className="space-y-2 p-2 border rounded-lg bg-muted/10">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">
            Layout Controls
          </Label>

          {/* Flex Direction */}
          <div className="space-y-1.5">
            <Label className="text-[9px] text-muted-foreground">
              Direction
            </Label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleLayoutChange("flexDirection", "row")}
                className={cn(
                  "flex-1 h-7 flex items-center justify-center gap-1.5 rounded border transition-colors",
                  layoutSettings.flexDirection === "row"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
              >
                <Rows className="h-3.5 w-3.5" />
                <span className="text-[10px]">Row</span>
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange("flexDirection", "column")}
                className={cn(
                  "flex-1 h-7 flex items-center justify-center gap-1.5 rounded border transition-colors",
                  layoutSettings.flexDirection === "column"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
              >
                <Columns className="h-3.5 w-3.5" />
                <span className="text-[10px]">Column</span>
              </button>
            </div>
          </div>

          {/* Justify Content */}
          <div className="space-y-1.5">
            <Label className="text-[9px] text-muted-foreground">
              Justify Content
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleLayoutChange("justifyContent", "start")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors",
                  layoutSettings.justifyContent === "start"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="Start"
              >
                <AlignHorizontalJustifyStart className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange("justifyContent", "center")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors",
                  layoutSettings.justifyContent === "center"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="Center"
              >
                <AlignHorizontalJustifyCenter className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange("justifyContent", "end")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors",
                  layoutSettings.justifyContent === "end"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="End"
              >
                <AlignHorizontalJustifyEnd className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange("justifyContent", "between")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors",
                  layoutSettings.justifyContent === "between"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="Space Between"
              >
                <AlignHorizontalSpaceBetween className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange("justifyContent", "around")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors",
                  layoutSettings.justifyContent === "around"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="Space Around"
              >
                <AlignHorizontalSpaceAround className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Align Items */}
          <div className="space-y-1.5">
            <Label className="text-[9px] text-muted-foreground">
              Align Items
            </Label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleLayoutChange("alignItems", "start")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors",
                  layoutSettings.alignItems === "start"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="Start"
              >
                <AlignVerticalJustifyStart className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange("alignItems", "center")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors",
                  layoutSettings.alignItems === "center"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="Center"
              >
                <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange("alignItems", "end")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors",
                  layoutSettings.alignItems === "end"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="End"
              >
                <AlignVerticalJustifyEnd className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange("alignItems", "stretch")}
                className={cn(
                  "h-7 flex items-center justify-center rounded border transition-colors text-[10px]",
                  layoutSettings.alignItems === "stretch"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                )}
                title="Stretch"
              >
                Stretch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title-input">{titleLabel}</Label>
        <Input
          id="title-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={titlePlaceholder}
        />
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <Label htmlFor="desc-input">{descriptionLabel}</Label>
        <Textarea
          id="desc-input"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={descriptionPlaceholder}
          rows={3}
        />
      </div>
    </div>
  );
};
