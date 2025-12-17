import * as LucideIcons from "lucide-react";

export const DynamicIcon = ({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) => {
  if (!name) return null;
  // Capitalize first letter to match Lucide export convention if user types lowercase
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent =
    (LucideIcons as any)[formattedName] || (LucideIcons as any)[name];

  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};
