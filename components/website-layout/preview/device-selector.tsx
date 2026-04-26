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
    <div className="flex bg-muted/60 rounded-md p-0.5">
      <button
        onClick={() => setPreviewDevice("desktop")}
        className={cn(
          "p-1.5 rounded transition-all",
          previewDevice === "desktop"
            ? "bg-background shadow-sm text-primary"
            : "text-muted-foreground/60 hover:text-foreground"
        )}
      >
        <Laptop className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setPreviewDevice("tablet")}
        className={cn(
          "p-1.5 rounded transition-all",
          previewDevice === "tablet"
            ? "bg-background shadow-sm text-primary"
            : "text-muted-foreground/60 hover:text-foreground"
        )}
      >
        <Tablet className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setPreviewDevice("mobile")}
        className={cn(
          "p-1.5 rounded transition-all",
          previewDevice === "mobile"
            ? "bg-background shadow-sm text-primary"
            : "text-muted-foreground/60 hover:text-foreground"
        )}
      >
        <Smartphone className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
