import { cn } from "@/lib/utils";
import { Laptop, Smartphone, Tablet } from "lucide-react";

interface DeviceSelectorProps {
  previewDevice: string;
  setPreviewDevice: (device: "desktop" | "tablet" | "mobile") => void;
}

export const DeviceSelector = ({
  previewDevice,
  setPreviewDevice,
}: DeviceSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-muted rounded-lg p-1">
        <button
          onClick={() => setPreviewDevice("desktop")}
          className={cn(
            "p-1.5 rounded-md transition-all",
            previewDevice === "desktop"
              ? "bg-white shadow text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Laptop className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPreviewDevice("tablet")}
          className={cn(
            "p-1.5 rounded-md transition-all",
            previewDevice === "tablet"
              ? "bg-white shadow text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Tablet className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPreviewDevice("mobile")}
          className={cn(
            "p-1.5 rounded-md transition-all",
            previewDevice === "mobile"
              ? "bg-white shadow text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Smartphone className="h-4 w-4" />
        </button>
      </div>
      <span className="text-xs text-muted-foreground ml-2">
        {previewDevice === "desktop"
          ? "1280px"
          : previewDevice === "tablet"
          ? "768px"
          : "375px"}
      </span>
    </div>
  );
};
