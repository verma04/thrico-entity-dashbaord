import { cn } from "@/lib/utils";

export interface LogoContentConfig {
  logoType?: "text" | "image";
  logoImage?: string;
  logoHeight?: number;
  logoTextColor?: string;
  textColor?: string;
  logoText?: string;
}

interface LogoRendererProps {
  content?: LogoContentConfig;
  className?: string;
}

export const LogoRenderer = ({ content, className }: LogoRendererProps) => {
  const logoHeight = content?.logoHeight || 32;
  const textColor = content?.logoTextColor || content?.textColor;

  if (content?.logoType === "image" && content?.logoImage) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={content.logoImage}
        alt="Logo"
        className={cn("object-contain transition-all", className)}
        style={{ height: `${logoHeight}px`, maxHeight: "60px" }}
      />
    );
  }


  return (
    <div
      className={cn("font-bold text-xl tracking-tight transition-colors", className)}
      style={textColor ? { color: textColor } : undefined}
    >
      {content?.logoText || "Brand"}
    </div>
  );
};

