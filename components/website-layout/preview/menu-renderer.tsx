import { cn } from "@/lib/utils";
import { MenuItem } from "@/store/useWebsiteBuilderStore";
import { DynamicIcon } from "./dynamic-icon";
import * as LucideIcons from "lucide-react";

export const MenuRenderer = ({
  items,
  className,
  vertical = false,
  depth = 0,
}: {
  items: MenuItem[];
  className?: string;
  vertical?: boolean;
  depth?: number;
}) => {
  if (!items || items.length === 0) return null;

  return (
    <ul
      className={cn(
        "flex",
        vertical ? "flex-col space-y-2" : "flex-row gap-6",
        className
      )}
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="relative group text-sm font-medium cursor-pointer"
        >
          <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <DynamicIcon name={item.icon} className="h-4 w-4" />
            <span>{item.label}</span>
            {item.children && item.children.length > 0 && (
              <LucideIcons.ChevronDown className="h-3 w-3 opacity-50" />
            )}
          </div>

          {/* Simplified Dropdown Simulation */}
          {item.children && item.children.length > 0 && !vertical && (
            <div className="absolute top-full left-0 mt-2 min-w-[160px] bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
              <MenuRenderer
                items={item.children}
                vertical={true}
                className="gap-2"
                depth={depth + 1}
              />
            </div>
          )}
          {item.children && item.children.length > 0 && vertical && (
            <div className="pl-4 pt-1">
              <MenuRenderer
                items={item.children}
                vertical={true}
                className="gap-1"
                depth={depth + 1}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
