import { cn } from "@/lib/utils";
import { NavbarContentConfig } from "@/store/useWebsiteBuilderStore";

interface AuthButtonsProps {
  className?: string;
  content?: NavbarContentConfig;
}


export const AuthButtons = ({ className, content }: AuthButtonsProps) => {
  const showCta = content?.showCtaButton !== false;
  const showSecondary = content?.showSecondaryButton !== false;

  const ctaText = content?.ctaButtonText || "Sign up";
  const secondaryText = content?.secondaryButtonText || "Log in";

  const ctaBg = content?.ctaButtonBg;
  const ctaTextColor = content?.ctaButtonTextColor;
  const secondaryTextColor = content?.secondaryButtonTextColor || content?.textColor;

  const size = content?.ctaButtonSize || "md";
  const radius = content?.ctaButtonRadius || "full";
  const variant = content?.ctaButtonVariant || "solid";

  // Size styling
  const sizeClasses = {
    sm: "h-7 px-3 text-xs",
    md: "h-9 px-4 text-xs font-semibold",
    lg: "h-10 px-5 text-sm font-semibold",
  }[size as "sm" | "md" | "lg"] || "h-9 px-4 text-xs font-semibold";

  const secondarySizeClasses = {
    sm: "h-7 px-2.5 text-xs",
    md: "h-9 px-3 text-xs font-medium",
    lg: "h-10 px-4 text-sm font-medium",
  }[size as "sm" | "md" | "lg"] || "h-9 px-3 text-xs font-medium";

  // Radius styling
  const radiusClass = {
    full: "rounded-full",
    md: "rounded-lg",
    none: "rounded-none",
  }[radius as "full" | "md" | "none"] || "rounded-full";

  // CTA Button dynamic inline styles
  const ctaStyle: React.CSSProperties = {};
  if (variant === "solid") {
    if (ctaBg) ctaStyle.backgroundColor = ctaBg;
    if (ctaTextColor) ctaStyle.color = ctaTextColor;
  } else if (variant === "outline") {
    ctaStyle.backgroundColor = "transparent";
    if (ctaBg) {
      ctaStyle.borderColor = ctaBg;
      ctaStyle.color = ctaBg;
    }
    if (ctaTextColor) ctaStyle.color = ctaTextColor;
  } else if (variant === "ghost") {
    ctaStyle.backgroundColor = "transparent";
    if (ctaTextColor) ctaStyle.color = ctaTextColor;
  }

  // Fallback classes if no custom color is provided
  const ctaFallbackClasses = !ctaBg && !ctaTextColor
    ? variant === "outline"
      ? "border border-primary text-primary hover:bg-primary/10"
      : variant === "ghost"
      ? "text-primary hover:bg-primary/10"
      : "bg-primary text-primary-foreground hover:opacity-90"
    : "hover:opacity-90 transition-opacity";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showSecondary && (
        <button
          type="button"
          className={cn(
            "transition-colors hover:opacity-80 font-medium",
            secondarySizeClasses,
            radiusClass
          )}
          style={secondaryTextColor ? { color: secondaryTextColor } : undefined}
        >
          {secondaryText}
        </button>
      )}

      {showCta && (
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center transition-all shadow-xs cursor-pointer",
            sizeClasses,
            radiusClass,
            variant === "outline" && "border",
            ctaFallbackClasses
          )}
          style={ctaStyle}
        >
          {ctaText}
        </button>
      )}
    </div>
  );
};

