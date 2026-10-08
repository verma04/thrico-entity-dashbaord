import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import * as BrandIcons from "@/components/ui/brand-icons";

interface DynamicIconProps {
  name?: string;
  className?: string;
}

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  if (!name) return null;
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent =
    (BrandIcons as any)[formattedName] ||
    (BrandIcons as any)[name] ||
    (LucideIcons as any)[formattedName] ||
    (LucideIcons as any)[name];

  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export default DynamicIcon;
