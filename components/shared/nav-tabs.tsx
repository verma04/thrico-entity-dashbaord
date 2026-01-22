"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  href?: string;
  onClick?: () => void;
}

interface NavTabsProps {
  items: TabItem[];
  activeKey?: string;
  onTabChange?: (key: string) => void;
  className?: string;
  variant?: "pill" | "underline" | "glass";
}

export const NavTabs = ({
  items,
  activeKey: manualActiveKey,
  onTabChange,
  className,
  variant = "glass",
}: NavTabsProps) => {
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState(manualActiveKey || items[0]?.key);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);

  // Update internal state when manualActiveKey changes
  useEffect(() => {
    if (manualActiveKey) {
      setActiveKey(manualActiveKey);
    }
  }, [manualActiveKey]);

  // Handle active key detection from pathname if no manual key is provided
  useEffect(() => {
    if (!manualActiveKey && items.some((item) => item.href)) {
      const activeItem = items.find(
        (item) => item.href && pathname === item.href,
      );
      if (activeItem) {
        setActiveKey(activeItem.key);
      }
    }
  }, [pathname, items, manualActiveKey]);

  // Update indicator position
  useEffect(() => {
    const activeIndex = items.findIndex((item) => item.key === activeKey);
    const activeTab = tabsRef.current[activeIndex];

    if (activeTab) {
      setIndicatorStyle({
        width: activeTab.offsetWidth,
        left: activeTab.offsetLeft,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      });
    }
  }, [activeKey, items]);

  const handleTabClick = (item: TabItem) => {
    if (!manualActiveKey) {
      setActiveKey(item.key);
    }
    onTabChange?.(item.key);
    item.onClick?.();
  };

  return (
    <div
      className={cn(
        "relative flex items-center p-1.5 rounded-2xl overflow-x-auto no-scrollbar",
        variant === "glass" &&
          "bg-white/5 backdrop-blur-md border border-white/10 shadow-lg",
        variant === "pill" && "bg-muted/50 p-1",
        className,
      )}
    >
      {/* Active Indicator */}
      <div
        className={cn(
          "absolute h-[calc(100%-12px)] rounded-xl transition-all duration-300 z-0",
          variant === "glass" && "bg-primary/20 border border-primary/30",
          variant === "pill" && "bg-background shadow-sm",
          variant === "underline" && "h-[2px] bottom-0 rounded-none bg-primary",
        )}
        style={indicatorStyle}
      />

      {items.map((item, index) => {
        const isActive = activeKey === item.key;
        const Component = item.href ? Link : "button";
        const props = item.href ? { href: item.href } : { type: "button" };

        return (
          <Component
            key={item.key}
            {...(props as any)}
            ref={(el: any) => (tabsRef.current[index] = el)}
            onClick={() => handleTabClick(item)}
            className={cn(
              "relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap",
              isActive
                ? "text-primary scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            {item.icon && (
              <span
                className={cn(
                  "transition-transform duration-300",
                  isActive && "scale-110",
                )}
              >
                {item.icon}
              </span>
            )}
            {item.label}
            {item.badge !== undefined && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {item.badge}
              </span>
            )}
          </Component>
        );
      })}
    </div>
  );
};
