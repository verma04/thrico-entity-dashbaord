import { cn } from "@/lib/utils";

interface PreviewContainerProps {
  previewDevice: string;
  fontFamily: string;
  zoomLevel: number;
  children: React.ReactNode;
  className?: string;
}

export const PreviewContainer = ({
  previewDevice,
  fontFamily,
  zoomLevel,
  children,
  className,
}: PreviewContainerProps) => {
  const baseScale = previewDevice === "tablet" ? 0.9 : previewDevice === "mobile" ? 0.85 : 1;
  const finalScale = baseScale * (zoomLevel / 100);

  return (
    <div className="flex-1 overflow-auto bg-[#f6f6f7] dark:bg-zinc-950 p-4 sm:p-6">
      {/* Scoped style: forces all preview children to inherit the selected font.
          #id selector (1,0,0) beats Tailwind's .font-sans (0,1,0) specificity,
          so this works even with @theme inline in globals.css. */}
      <style>{`
        #website-preview-container,
        #website-preview-container * {
          font-family: inherit;
        }
      `}</style>
      <div
        id="website-preview-container"
        className={cn(
          "mx-auto transition-all duration-300 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden",
          previewDevice === "desktop" && "w-full rounded-lg border border-[#d2d5d9]/60 dark:border-zinc-800",
          previewDevice === "tablet" && "w-[768px] rounded-2xl border-4 border-zinc-800 dark:border-zinc-700 my-4 shadow-2xl",
          previewDevice === "mobile" &&
            "w-[375px] rounded-[36px] border-[8px] border-zinc-900 dark:border-zinc-700 my-4 shadow-2xl ring-1 ring-black/20"
        )}
        style={{
          width: previewDevice === "desktop" ? "100%" : undefined,
          maxWidth: previewDevice === "desktop" ? "100%" : undefined,
          transform: `scale(${finalScale})`,
          transformOrigin: "top center",
          fontFamily,
        }}
      >
        <div
          className={cn("w-full overflow-auto", className)}
          style={{
            maxHeight:
              previewDevice === "mobile"
                ? "667px"
                : previewDevice === "tablet"
                ? "1024px"
                : "none",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

