import React from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { LogoRenderer } from "./logo-renderer";
import { MenuRenderer } from "./menu-renderer";
import { AuthButtons } from "./auth-buttons";
import { NavbarContentConfig } from "@/store/useWebsiteBuilderStore";

interface LivePreviewNavbarProps {
  content?: NavbarContentConfig;
  layout: string;
  previewDevice: string;
}


export const LivePreviewNavbar = ({
  content = {},
  layout = "simple",
  previewDevice,
}: LivePreviewNavbarProps) => {
  const backgroundType = content.backgroundType || "solid";
  const customBg = content.backgroundColor || content.containerSettings?.background;
  const textColor = content.textColor || content.containerSettings?.textColor;
  const linkHoverColor = content.linkHoverColor;
  const heightSetting = content.height || "default";
  const maxWidth = content.maxWidth || "full";
  const borderStyle = content.borderStyle || "bottom";
  const borderColor = content.borderColor;
  const shadow = content.shadow || "none";
  const backgroundBlur = content.backgroundBlur || "md";

  // Height mappings based on layout and user height setting
  const getHeightClass = () => {
    if (previewDevice === "mobile") {
      return heightSetting === "compact" ? "h-14" : heightSetting === "tall" ? "h-20" : "h-16";
    }

    if (layout === "centered") {
      return heightSetting === "compact" ? "h-20" : heightSetting === "tall" ? "h-28" : "h-24";
    }
    if (layout === "stacked") {
      return heightSetting === "compact" ? "h-24" : heightSetting === "tall" ? "h-32" : "h-28";
    }

    return heightSetting === "compact" ? "h-14" : heightSetting === "tall" ? "h-20" : "h-16";
  };

  // Blur classes
  const blurClass = {
    none: "",
    sm: "backdrop-blur-xs",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-xl",
  }[backgroundBlur as "none" | "sm" | "md" | "lg"] || "backdrop-blur-md";

  // Shadow classes
  const shadowClass = {
    none: "",
    sm: "shadow-xs",
    md: "shadow-md",
    lg: "shadow-lg",
  }[shadow as "none" | "sm" | "md" | "lg"] || "";

  // Dynamic inline styles for nav bar surface
  const navStyle: React.CSSProperties = {};
  if (backgroundType === "transparent") {
    navStyle.backgroundColor = "transparent";
  } else if (backgroundType === "glass") {
    if (customBg) {
      // Use hex with alpha if hex is provided
      if (customBg.startsWith("#") && customBg.length === 7) {
        navStyle.backgroundColor = `${customBg}cc`; // ~80% opacity
      } else {
        navStyle.backgroundColor = customBg;
      }
    }
  } else if (backgroundType === "gradient") {
    if (customBg) {
      navStyle.background = `linear-gradient(180deg, ${customBg} 0%, transparent 100%)`;
    }
  } else if (customBg) {
    navStyle.backgroundColor = customBg;
  }

  if (textColor) {
    navStyle.color = textColor;
  }
  if (borderColor) {
    navStyle.borderColor = borderColor;
  }

  const isSticky = content.isSticky !== false;

  const innerLayoutClasses = cn(
    "w-full flex",
    previewDevice === "mobile"
      ? "items-center justify-between"
      : [
          layout === "simple" && "items-center justify-between",
          layout === "centered" && "flex-col justify-center items-center py-3 gap-2 relative",
          layout === "minimal" && "items-center justify-between",
          layout === "stacked" && "flex-col justify-between py-3",
          layout === "split" && "items-center justify-between",
          layout === "default" && "items-center justify-between",
        ]
  );

  return (
    <nav
      className={cn(
        "w-full transition-all duration-200 z-50 px-6 md:px-8",
        isSticky && "sticky top-0",
        borderStyle === "bottom" && "border-b",
        borderStyle === "subtle" && "border-b border-border/40",
        borderStyle === "none" && "border-b-0",
        backgroundType === "glass" && blurClass,
        !customBg && backgroundType !== "transparent" && "bg-background/95",
        shadowClass,
        getHeightClass()
      )}
      style={navStyle}
    >
      <div
        className={cn(
          "h-full",
          maxWidth === "container" ? "max-w-7xl mx-auto" : "w-full",
          innerLayoutClasses
        )}
      >
        {previewDevice === "mobile" ? (
          <>
            <LogoRenderer content={content} />
            <div className="flex items-center gap-3">
              <AuthButtons content={content} />
              <Menu
                className="h-6 w-6 cursor-pointer transition-colors"
                style={textColor ? { color: textColor } : undefined}
              />
            </div>
          </>
        ) : (
          <>
            {/* VARIANT: SIMPLE (Logo Left, Menu Center, Auth Right) */}
            {layout === "simple" && (
              <>
                <div className="flex items-center">
                  <LogoRenderer content={content} />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <MenuRenderer
                    items={content.menuItems}
                    textColor={textColor}
                    linkHoverColor={linkHoverColor}
                  />
                </div>
                <div className="flex items-center">
                  <AuthButtons content={content} />
                </div>
              </>
            )}

            {/* VARIANT: CENTERED (Logo Center, Menu Below, Auth Absolute Right) */}
            {layout === "centered" && (
              <>
                <div className="absolute right-6 md:right-8 top-3">
                  <AuthButtons content={content} />
                </div>
                <div className="flex items-center justify-center">
                  <LogoRenderer content={content} />
                </div>
                <div className="flex items-center justify-center">
                  <MenuRenderer
                    items={content.menuItems}
                    textColor={textColor}
                    linkHoverColor={linkHoverColor}
                  />
                </div>
              </>
            )}

            {/* VARIANT: MINIMAL (Logo Left, Auth + Burger Right) */}
            {layout === "minimal" && (
              <>
                <div className="flex items-center">
                  <LogoRenderer content={content} />
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-4">
                  <AuthButtons content={content} />
                  <div
                    className="h-6 w-px bg-border/60 mx-1"
                    style={borderColor ? { backgroundColor: borderColor } : undefined}
                  />
                  <Menu
                    className="h-6 w-6 cursor-pointer transition-colors"
                    style={textColor ? { color: textColor } : undefined}
                  />
                </div>
              </>
            )}

            {/* VARIANT: STACKED (Logo + Auth Top, Menu Bottom) */}
            {layout === "stacked" && (
              <>
                <div className="w-full flex justify-between items-center px-2">
                  <LogoRenderer content={content} />
                  <AuthButtons content={content} />
                </div>
                <div
                  className="w-full h-px bg-border/50 my-1"
                  style={borderColor ? { backgroundColor: borderColor } : undefined}
                />
                <div className="w-full flex justify-center">
                  <MenuRenderer
                    items={content.menuItems}
                    textColor={textColor}
                    linkHoverColor={linkHoverColor}
                  />
                </div>
              </>
            )}

            {/* VARIANT: SPLIT (Menu Left, Logo Center, Auth Right) */}
            {layout === "split" && (
              <>
                <div className="flex-1 flex justify-start items-center">
                  <MenuRenderer
                    items={content.menuItems}
                    textColor={textColor}
                    linkHoverColor={linkHoverColor}
                  />
                </div>
                <div className="flex-1 flex justify-center items-center">
                  <LogoRenderer content={content} />
                </div>
                <div className="flex-1 flex justify-end gap-2 items-center">
                  <AuthButtons content={content} />
                </div>
              </>
            )}

            {/* Default Fallback */}
            {layout === "default" && (
              <>
                <div className="flex items-center">
                  <LogoRenderer content={content} />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <MenuRenderer
                    items={content.menuItems}
                    textColor={textColor}
                    linkHoverColor={linkHoverColor}
                  />
                </div>
                <div className="flex items-center">
                  <AuthButtons content={content} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

