"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useGetEntityTheme } from "@/graphql/actions";

export function BrandStyles() {
  const { theme } = useTheme();
  const { data } = useGetEntityTheme();

  useEffect(() => {
    if (theme === "brand" && data?.getEntityTheme) {
      const themeData = data.getEntityTheme;
      const root = document.documentElement;

      // Map EntityAppearanceTheme to CSS variables
      // Note: globals.css uses oklch, but we can provide hex/rgb and it should work
      // if the variables are used directly as colors.

      const styles: Record<string, string> = {
        "--background": themeData.backgroundColor || "#ffffff",
        "--foreground": themeData.textColor || "#020617",
        "--primary": themeData.primaryColor || "#0f172a",
        "--primary-foreground": "#ffffff", // Default to white for text on primary
        "--secondary": themeData.secondaryColor || "#334155",
        "--secondary-foreground": "#ffffff",
        "--accent": themeData.buttonColor || "#3b82f6",
        "--accent-foreground": "#ffffff",
        "--border": themeData.borderColor || "#e2e8f0",
        "--input": themeData.inputBorderColor || "#cbd5e1",
        "--radius": `${themeData.borderRadius || 6}px`,
      };

      Object.entries(styles).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Also set button specific styles if needed
      if (themeData.Button) {
        root.style.setProperty("--tc-primary", themeData.Button.colorPrimary);
      }
    } else if (theme !== "brand") {
      // Clear inline styles when switching back to light/dark/system
      const root = document.documentElement;
      const keysToClear = [
        "--background",
        "--foreground",
        "--primary",
        "--primary-foreground",
        "--secondary",
        "--secondary-foreground",
        "--accent",
        "--accent-foreground",
        "--border",
        "--input",
        "--radius",
        "--tc-primary",
      ];
      keysToClear.forEach((key) => root.style.removeProperty(key));
    }
  }, [theme, data]);

  return null;
}
