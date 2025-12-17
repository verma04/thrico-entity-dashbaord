import { ThemeType, FontFamily } from "@/store/useWebsiteBuilderStore";

export const THEME_FONT_MAP: Record<ThemeType, string> = {
  academia: "var(--font-playfair)", // Serif
  enterprise: "var(--font-inter)", // Clean Sans
  creator: "var(--font-space-grotesk)", // Default / Grotesk
  association: "var(--font-inter)", // Clean Sans
  startup: "var(--font-outfit)", // Modern Sans
  "dark-mode": "var(--font-inter)",
};

export const FONT_FAMILY_MAP: Record<
  FontFamily,
  { name: string; className: string; cssVar: string; webFont: string }
> = {
  inter: {
    name: "Inter",
    className: "font-sans",
    cssVar: "var(--font-inter)",
    webFont: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  playfair: {
    name: "Playfair Display",
    className: "font-serif",
    cssVar: "var(--font-playfair)",
    webFont: "'Playfair Display', Georgia, serif",
  },
  "space-grotesk": {
    name: "Space Grotesk",
    className: "font-mono",
    cssVar: "var(--font-space-grotesk)",
    webFont: "'Space Grotesk', 'Courier New', monospace",
  },
  outfit: {
    name: "Outfit",
    className: "font-sans",
    cssVar: "var(--font-outfit)",
    webFont: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  poppins: {
    name: "Poppins",
    className: "font-sans",
    cssVar: "var(--font-poppins)",
    webFont: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  roboto: {
    name: "Roboto",
    className: "font-sans",
    cssVar: "var(--font-roboto)",
    webFont: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  montserrat: {
    name: "Montserrat",
    className: "font-sans",
    cssVar: "var(--font-montserrat)",
    webFont: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  "open-sans": {
    name: "Open Sans",
    className: "font-sans",
    cssVar: "var(--font-open-sans)",
    webFont: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

export const getThemeFont = (theme: ThemeType): string => {
  const fontMap: Record<ThemeType, string> = {
    academia: "font-serif",
    enterprise: "font-sans",
    creator: "font-mono",
    association: "font-sans",
    startup: "font-sans",
    "dark-mode": "font-sans",
  };
  return fontMap[theme] || "font-sans";
};

export const getFontFamily = (fontFamily: FontFamily): string => {
  return FONT_FAMILY_MAP[fontFamily]?.className || "font-sans";
};

export const getFontFamilyName = (fontFamily: FontFamily): string => {
  return FONT_FAMILY_MAP[fontFamily]?.name || "Inter";
};
