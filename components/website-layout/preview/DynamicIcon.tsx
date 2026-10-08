import React from "react";
import * as LucideIcons from "lucide-react";
import * as BrandIcons from "@/components/ui/brand-icons";

export const isValidIcon = (comp: any): boolean => {
  if (!comp) return false;
  if (
    comp === (LucideIcons as any).useLucideContext ||
    comp === (LucideIcons as any).LucideProvider ||
    comp === (LucideIcons as any).createLucideIcon
  ) {
    return false;
  }
  if (typeof comp === "function") {
    if (comp.name && comp.name.startsWith("use")) return false;
    return true;
  }
  if (typeof comp === "object" && (comp.$$typeof || comp.render)) {
    return true;
  }
  return false;
};

interface DynamicIconProps {
  name?: string;
  className?: string;
  fallback?: React.ComponentType<any>;
}

export const DynamicIcon = ({
  name,
  className,
  fallback: Fallback,
}: DynamicIconProps) => {
  if (name === "none") return null;
  if (!name || typeof name !== "string") {
    return Fallback && isValidIcon(Fallback) ? (
      <Fallback className={className} />
    ) : null;
  }
  const trimmed = name.trim();
  if (trimmed === "none") return null;
  const formattedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  const IconComponent =
    (BrandIcons as any)[formattedName] ||
    (BrandIcons as any)[trimmed] ||
    (LucideIcons as any)[formattedName] ||
    (LucideIcons as any)[trimmed];

  if (IconComponent && isValidIcon(IconComponent)) {
    return <IconComponent className={className} />;
  }
  if (Fallback && isValidIcon(Fallback)) {
    return <Fallback className={className} />;
  }
  return null;
};

export default DynamicIcon;
