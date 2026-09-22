import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import * as BrandIcons from "@/components/ui/brand-icons";

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  const IconComponent = (LucideIcons as any)[name] || (BrandIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};
