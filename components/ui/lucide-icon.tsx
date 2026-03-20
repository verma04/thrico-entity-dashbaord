"use client";

import type React from "react";

import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideIcons.LucideProps {
  name: string;
  fallback?: string;
}

export function LucideIcon({ name, fallback, ...props }: DynamicIconProps) {
  // Improved toPascalCase to match Lucide's PascalCase
  const toPascalCase = (str: string) => {
    if (!str) return "";
    return str
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  };

  const formattedName = toPascalCase(name);
  const IconComponent = (
    LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>
  )[formattedName];

  if (!IconComponent) {
    // Fallback logic
    if (fallback) {
      const FallbackIcon = (
        LucideIcons as unknown as Record<
          string,
          React.ComponentType<LucideProps>
        >
      )[toPascalCase(fallback)];
      if (FallbackIcon) return <FallbackIcon {...props} />;
    }
    // Check if the name already is PascalCase (standard in Lucide React)
    const DirectComponent = (LucideIcons as any)[name];
    if (DirectComponent && typeof DirectComponent === "function") {
      return <DirectComponent {...props} />;
    }

    return <LucideIcons.Box {...props} />;
  }

  return <IconComponent {...props} />;
}
