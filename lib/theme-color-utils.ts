/**
 * Theme Color Utilities
 *
 * Utilities for color conversion, manipulation, and accessibility checking
 * for the website theme customization system.
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Convert RGB to OKLCH (approximation for Tailwind CSS v4)
 * Note: This is a simplified conversion. For production, consider using a library like culori
 */
export function rgbToOklch(r: number, g: number, b: number): string {
  // Normalize RGB values to 0-1 range
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Convert to linear RGB
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rLin = toLinear(rNorm);
  const gLin = toLinear(gNorm);
  const bLin = toLinear(bNorm);

  // Convert to XYZ (D65 illuminant)
  const x = rLin * 0.4124564 + gLin * 0.3575761 + bLin * 0.1804375;
  const y = rLin * 0.2126729 + gLin * 0.7151522 + bLin * 0.072175;
  const z = rLin * 0.0193339 + gLin * 0.119192 + bLin * 0.9503041;

  // Simplified OKLCH approximation
  // L (lightness): 0-1
  const L = Math.cbrt(y);

  // C (chroma): 0-0.4 typically
  const a = Math.cbrt(x) - L;
  const b_val = L - Math.cbrt(z);
  const C = Math.sqrt(a * a + b_val * b_val);

  // H (hue): 0-360 degrees
  let H = Math.atan2(b_val, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return `${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(3)}`;
}

/**
 * Convert hex color to OKLCH format for Tailwind CSS v4
 */
export function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "0.5 0 0"; // fallback to gray
  return rgbToOklch(rgb.r, rgb.g, rgb.b);
}

/**
 * Calculate relative luminance for WCAG contrast ratio
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard (4.5:1 for normal text)
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA"
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === "AA" ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Generate a foreground color (text color) based on background color
 * Returns white or black depending on which has better contrast
 */
export function generateForegroundColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, "#ffffff");
  const blackContrast = getContrastRatio(backgroundColor, "#000000");

  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * (percent / 100)));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * (percent / 100)));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * (percent / 100)));

  return rgbToHex(r, g, b);
}

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.max(0, Math.floor(rgb.r * (1 - percent / 100)));
  const g = Math.max(0, Math.floor(rgb.g * (1 - percent / 100)));
  const b = Math.max(0, Math.floor(rgb.b * (1 - percent / 100)));

  return rgbToHex(r, g, b);
}

/**
 * Generate a color scale from a base color
 * Returns shades from 50 (lightest) to 950 (darkest)
 */
export function generateColorScale(baseColor: string): Record<number, string> {
  return {
    50: lightenColor(baseColor, 90),
    100: lightenColor(baseColor, 80),
    200: lightenColor(baseColor, 60),
    300: lightenColor(baseColor, 40),
    400: lightenColor(baseColor, 20),
    500: baseColor,
    600: darkenColor(baseColor, 20),
    700: darkenColor(baseColor, 40),
    800: darkenColor(baseColor, 60),
    900: darkenColor(baseColor, 80),
    950: darkenColor(baseColor, 90),
  };
}

/**
 * Apply custom theme colors to CSS variables
 * @param colors - Custom color values
 * @param containerId - Optional container ID to scope colors to (defaults to website preview)
 */
export function applyCustomTheme(
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    muted?: string;
    border?: string;
    borderRadius?: number;
    spacing?: number;
    fontSize?: number;
  },
  containerId: string = "website-preview-container"
): void {
  // Find the container element, fallback to creating a style element
  const container = document.getElementById(containerId);

  if (!container) {
    console.warn(
      `Container #${containerId} not found. Custom colors will not be applied.`
    );
    return;
  }

  if (colors.primary) {
    const primaryOklch = hexToOklch(colors.primary);
    const primaryForeground = generateForegroundColor(colors.primary);
    const primaryForegroundOklch = hexToOklch(primaryForeground);

    container.style.setProperty("--primary", `oklch(${primaryOklch})`);
    container.style.setProperty(
      "--primary-foreground",
      `oklch(${primaryForegroundOklch})`
    );
  }

  if (colors.secondary) {
    const secondaryOklch = hexToOklch(colors.secondary);
    const secondaryForeground = generateForegroundColor(colors.secondary);
    const secondaryForegroundOklch = hexToOklch(secondaryForeground);

    container.style.setProperty("--secondary", `oklch(${secondaryOklch})`);
    container.style.setProperty(
      "--secondary-foreground",
      `oklch(${secondaryForegroundOklch})`
    );
  }

  if (colors.accent) {
    const accentOklch = hexToOklch(colors.accent);
    const accentForeground = generateForegroundColor(colors.accent);
    const accentForegroundOklch = hexToOklch(accentForeground);

    container.style.setProperty("--accent", `oklch(${accentOklch})`);
    container.style.setProperty(
      "--accent-foreground",
      `oklch(${accentForegroundOklch})`
    );
  }

  if (colors.background) {
    const backgroundOklch = hexToOklch(colors.background);
    const foreground = generateForegroundColor(colors.background);
    const foregroundOklch = hexToOklch(foreground);

    container.style.setProperty("--background", `oklch(${backgroundOklch})`);
    container.style.setProperty("--foreground", `oklch(${foregroundOklch})`);
  }

  if (colors.muted) {
    const mutedOklch = hexToOklch(colors.muted);
    const mutedForeground = generateForegroundColor(colors.muted);
    const mutedForegroundOklch = hexToOklch(mutedForeground);

    container.style.setProperty("--muted", `oklch(${mutedOklch})`);
    container.style.setProperty(
      "--muted-foreground",
      `oklch(${mutedForegroundOklch})`
    );
  }

  if (colors.border) {
    const borderOklch = hexToOklch(colors.border);
    container.style.setProperty("--border", `oklch(${borderOklch})`);
    container.style.setProperty("--input", `oklch(${borderOklch})`);
  }

  // Apply border radius customization
  if (colors.borderRadius !== undefined) {
    container.style.setProperty("--radius", `${colors.borderRadius}px`);
  }

  // Apply spacing customization
  if (colors.spacing !== undefined) {
    // Apply spacing multiplier to common spacing values
    const baseSpacing = 4; // 4px base (1 = 0.25rem)
    container.style.setProperty(
      "--spacing-unit",
      `${baseSpacing * colors.spacing}px`
    );
  }

  // Apply font size customization
  if (colors.fontSize !== undefined) {
    container.style.setProperty("--font-size-base", `${colors.fontSize}px`);
  }

  // Mark that custom theme is active
  container.setAttribute("data-custom-theme", "true");
}

/**
 * Reset custom theme colors to defaults
 * @param containerId - Optional container ID to reset colors for
 */
export function resetCustomTheme(
  containerId: string = "website-preview-container"
): void {
  const container = document.getElementById(containerId);

  if (!container) {
    console.warn(`Container #${containerId} not found.`);
    return;
  }

  // Remove custom properties
  const customProps = [
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--accent",
    "--accent-foreground",
    "--background",
    "--foreground",
    "--muted",
    "--muted-foreground",
    "--border",
    "--input",
    "--radius",
    "--spacing-unit",
    "--font-size-base",
  ];

  customProps.forEach((prop) => {
    container.style.removeProperty(prop);
  });

  // Remove custom theme marker
  container.removeAttribute("data-custom-theme");
}

/**
 * Validate hex color format
 */
export function isValidHexColor(hex: string): boolean {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}
