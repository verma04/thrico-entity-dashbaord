import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { DynamicIcon } from "../preview/DynamicIcon";

interface ContainerSettings {
  fullWidth?: boolean; // Container width toggle
  background?: string; // Background color
  backgroundImage?: string; // Background image URL
  opacity?: number; // 0-100
  button?: {
    enabled: boolean;
    text: string; // Preset or custom text
    icon?: string; // Optional icon name (lucide-react)
    iconPosition?: "left" | "right"; // Icon position relative to text
    linkType?: "internal" | "external"; // Link type selector
    link?: string; // Page slug for internal, URL for external
    target?: "_self" | "_blank"; // Open in same/new tab
    style: "primary" | "secondary" | "outline" | "ghost";
    position: "left" | "center" | "right";
  };
}

interface ModuleContainerProps {
  children: ReactNode;
  containerSettings?: ContainerSettings;
  className?: string;
}

export const ModuleContainer = ({
  children,
  containerSettings,
  className,
}: ModuleContainerProps) => {
  console.log(containerSettings?.backgroundImage);
  const fullWidth = containerSettings?.fullWidth ?? false;
  const background = containerSettings?.background || "bg-background";
  const backgroundImage = containerSettings?.backgroundImage;
  const opacity = containerSettings?.opacity ?? 100;
  const button = containerSettings?.button;

  // Check if background is a custom color (hex, rgb, etc.), gradient, or a Tailwind class
  const isCustomColor =
    background &&
    (background.startsWith("#") ||
      background.startsWith("rgb") ||
      background.startsWith("hsl") ||
      background.startsWith("linear-gradient"));

  // Convert hex to rgba if needed for opacity
  const applyOpacity = (color: string, opacity: number): string => {
    const alpha = opacity / 100;

    // Handle hex colors
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Handle rgb colors - convert to rgba
    if (color.startsWith("rgb(")) {
      return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    }

    // Handle rgba colors - replace existing alpha
    if (color.startsWith("rgba(")) {
      return color.replace(/[\d.]+\)$/, `${alpha})`);
    }

    // Handle hsl colors - convert to hsla
    if (color.startsWith("hsl(")) {
      return color.replace("hsl(", "hsla(").replace(")", `, ${alpha})`);
    }

    return color;
  };

  // Separate background class and inline style
  let backgroundClass = isCustomColor ? "" : background;
  let inlineStyle: React.CSSProperties = {};

  if (isCustomColor) {
    if (background.startsWith("linear-gradient")) {
      inlineStyle.background = background;
    } else {
      // Apply opacity to custom color
      inlineStyle.backgroundColor = applyOpacity(background, opacity);
    }
  } else if (opacity < 100) {
    // Apply Tailwind opacity class for Tailwind backgrounds
    const opacityClass = `bg-opacity-${Math.round(opacity / 10) * 10}`;
    backgroundClass = `${backgroundClass} ${opacityClass}`;
  }

  // Handle background image
  if (backgroundImage) {
    inlineStyle.backgroundImage = `url(${backgroundImage})`;
    inlineStyle.backgroundSize = "cover";
    inlineStyle.backgroundPosition = "center";
    inlineStyle.backgroundRepeat = "no-repeat";
  }

  // Container width classes
  const containerWidthClass = fullWidth ? "w-full" : "max-w-7xl";
  const paddingClass = "py-16 px-8 sm:px-10"; // Default padding

  // Filter out background-related classes from className to prevent override
  const filteredClassName = className
    ?.split(" ")
    .filter((c) => !c.startsWith("bg-") && !c.includes("background"))
    .join(" ");

  // Apply containerSettings background only if explicitly set, otherwise use default from className
  const shouldUseContainerBackground =
    containerSettings?.background !== undefined;
  const finalBackgroundClass = shouldUseContainerBackground
    ? backgroundClass
    : "";

  // Button style classes
  const getButtonStyles = (style: string) => {
    const baseStyles =
      "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-sm";
    const styles = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      outline:
        "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      ghost: "hover:bg-muted text-foreground hover:text-primary",
    };
    return cn(
      baseStyles,
      styles[style as keyof typeof styles] || styles.primary
    );
  };

  // Button position classes
  const getPositionClass = (position: string) => {
    const positions = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };
    return positions[position as keyof typeof positions] || positions.right;
  };

  return (
    <div
      className={cn(
        paddingClass,
        filteredClassName,
        finalBackgroundClass // containerSettings background comes last to take precedence
      )}
      style={inlineStyle}
    >
      <div className={cn("mx-auto", containerWidthClass)}>
        {children}

        {/* Optional CTA Button */}
        {button?.enabled && (
          <div className={cn("mt-8 flex", getPositionClass(button.position))}>
            {button.link ? (
              <a href={button.link} className={getButtonStyles(button.style)}>
                {button.icon && button.iconPosition === "left" && (
                  <DynamicIcon name={button.icon} className="w-4 h-4 mr-2" />
                )}
                {button.text}
                {button.icon && button.iconPosition === "right" && (
                  <DynamicIcon name={button.icon} className="w-4 h-4 ml-2" />
                )}
              </a>
            ) : (
              <button className={getButtonStyles(button.style)}>
                {button.icon && button.iconPosition === "left" && (
                  <DynamicIcon name={button.icon} className="w-4 h-4 mr-2" />
                )}
                {button.text}
                {button.icon && button.iconPosition === "right" && (
                  <DynamicIcon name={button.icon} className="w-4 h-4 ml-2" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
