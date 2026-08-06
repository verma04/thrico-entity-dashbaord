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
    <div className="flex-1 overflow-auto bg-muted/30 p-4">
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
          "mx-auto transition-all duration-300 bg-white shadow-lg overflow-hidden",
          previewDevice === "desktop" && "w-full",
          previewDevice === "tablet" && "w-[768px] rounded-xl border my-4",
          previewDevice === "mobile" &&
            "w-[375px] rounded-2xl border-8 border-slate-800 my-4 shadow-2xl"
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

