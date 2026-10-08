import React from "react";
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
    <div className="flex items-center bg-[#f6f6f7] dark:bg-zinc-800/80 p-0.5 rounded-lg border border-[#d2d5d9] dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setPreviewDevice("desktop")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
          previewDevice === "desktop"
            ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold"
            : "text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-100"
        )}
        title="Desktop View (100%)"
      >
        <Laptop className="h-3.5 w-3.5" />
        <span className="text-[11px] hidden sm:inline">Desktop</span>
      </button>
      <button
        type="button"
        onClick={() => setPreviewDevice("tablet")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
          previewDevice === "tablet"
            ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold"
            : "text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-100"
        )}
        title="Tablet View (768px)"
      >
        <Tablet className="h-3.5 w-3.5" />
        <span className="text-[11px] hidden sm:inline">Tablet</span>
      </button>
      <button
        type="button"
        onClick={() => setPreviewDevice("mobile")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
          previewDevice === "mobile"
            ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold"
            : "text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-100"
        )}
        title="Mobile View (375px)"
      >
        <Smartphone className="h-3.5 w-3.5" />
        <span className="text-[11px] hidden sm:inline">Mobile</span>
      </button>
    </div>
  );
};
