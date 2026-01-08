import { cn } from "@/lib/utils";

interface PreviewContainerProps {
  previewDevice: string;
  fontFamily: string;
  children: React.ReactNode;
  className?: string;
}

export const PreviewContainer = ({
  previewDevice,
  fontFamily,
  children,
  className,
}: PreviewContainerProps) => {
  return (
    <div className="flex-1 overflow-auto bg-muted/30 p-4">
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
          transform:
            previewDevice === "tablet"
              ? "scale(0.9)"
              : previewDevice === "mobile"
              ? "scale(0.85)"
              : "scale(1)",
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
