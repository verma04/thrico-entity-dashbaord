"use client";

import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleIconProps {
  name: string;
  fallback?: string;
  className?: string;
  iconClassName?: string;
}

export const ModuleIcon = ({
  name,
  fallback,
  className,
  iconClassName,
}: ModuleIconProps) => {
  const renderIcon = (iconName: string, iconClass: string) => {
    if (!iconName) return null;
    // Attempt to get the icon from LucideIcons by name
    // We try the fallback (which might be "Users") or the name itself
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={iconClass} /> : null;
  };

  // Try rendering with the fallback string first (if it's a valid Lucide icon name)
  const IconComponent = renderIcon(
    fallback || "",
    cn("w-4 h-4", iconClassName)
  );

  if (IconComponent) {
    return (
      <span
        className={cn(
          "text-primary flex items-center justify-center",
          className
        )}
      >
        {IconComponent}
      </span>
    );
  }

  // Fallback to name-based logic or simple text
  return (
    <span
      className={cn(
        "text-lg opacity-70 flex items-center justify-center",
        className
      )}
    >
      {fallback && fallback.length > 2
        ? fallback
        : name.charAt(0).toUpperCase()}
    </span>
  );
};
