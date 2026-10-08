import { cn } from "@/lib/utils";
import { MenuItem } from "@/store/useWebsiteBuilderStore";
import { DynamicIcon } from "./dynamic-icon";
import * as LucideIcons from "lucide-react";
import React, { useState } from "react";

interface MenuRendererProps {
  items?: MenuItem[];
  className?: string;
  vertical?: boolean;
  depth?: number;
  textColor?: string;
  linkHoverColor?: string;
}

export const MenuRenderer = ({
  items = [],
  className,
  vertical = false,
  depth = 0,
  textColor,
  linkHoverColor,
}: MenuRendererProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!items || items.length === 0) return null;


  return (
    <ul
      className={cn(
        "flex",
        vertical ? "flex-col space-y-2" : "flex-row gap-6",
        className
      )}
    >
      {items.map((item) => {
        const isHovered = hoveredId === item.id;
        const itemColor = isHovered && linkHoverColor ? linkHoverColor : textColor;

        return (
          <li
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative group text-sm font-medium cursor-pointer"
          >
            <div
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                !linkHoverColor && "hover:text-primary"
              )}
              style={itemColor ? { color: itemColor } : undefined}
            >
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
                  textColor={textColor}
                  linkHoverColor={linkHoverColor}
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
                  textColor={textColor}
                  linkHoverColor={linkHoverColor}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

