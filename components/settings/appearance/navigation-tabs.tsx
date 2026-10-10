"use client"

import type React from "react"
import { useState } from "react"
import { Home, Users, Calendar, BookOpen } from "lucide-react"
import type { EntityTheme } from "@/store/ts-types"

interface NavigationTabsProps {
  theme: EntityTheme
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState("feed");

  const tabs = [
    { id: "feed", icon: Home, label: "Feed" },
    { id: "communities", icon: Users, label: "Communities", badge: 4 },
    { id: "events", icon: Calendar, label: "Events", badge: 2 },
    { id: "resources", icon: BookOpen, label: "Resources" },
  ];

  const variant = theme.Navigation?.tabLayoutVariant || "pills";
  const tabSize = theme.Navigation?.tabSize || "md";
  const activeColor = theme.Navigation?.tabActiveColor || theme.primaryColor || "#3b82f6";
  const activeBg = theme.Navigation?.tabActiveBg || "rgba(59, 130, 246, 0.1)";
  const inactiveColor = theme.Navigation?.tabInactiveColor || theme.textColor || "#64748b";
  const borderColor = theme.Navigation?.tabBorderColor || theme.borderColor || "#e2e8f0";
  const indicatorColor = theme.Navigation?.tabIndicatorColor || activeColor;
  const badgeBg = theme.Navigation?.tabBadgeBg || "#ef4444";
  const badgeColor = theme.Navigation?.tabBadgeColor || "#ffffff";

  const sizeConfig = {
    sm: {
      padding: "px-2.5 py-1 gap-1.5 text-xs",
      iconSize: 14,
      badge: "text-[9px] min-w-3.5 h-3.5 px-1",
    },
    md: {
      padding: "px-3.5 py-1.5 gap-2 text-sm",
      iconSize: 16,
      badge: "text-[10px] min-w-4 h-4 px-1.5",
    },
    lg: {
      padding: "px-4.5 py-2.5 gap-2.5 text-base",
      iconSize: 18,
      badge: "text-[11px] min-w-4.5 h-4.5 px-2",
    },
  }[tabSize] || {
    padding: "px-3.5 py-1.5 gap-2 text-sm",
    iconSize: 16,
    badge: "text-[10px] min-w-4 h-4 px-1.5",
  };

  return (
    <div
      className="flex gap-2 sm:gap-4 pb-3 border-b mb-6 overflow-x-auto"
      style={{
        borderColor,
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        // Dynamic styling depending on variant
        let btnStyle: React.CSSProperties = {
          fontWeight: isActive ? "600" : "500",
        };

        if (variant === "pills") {
          btnStyle = {
            ...btnStyle,
            backgroundColor: isActive ? activeColor : "transparent",
            color: isActive ? "#ffffff" : inactiveColor,
            borderRadius: `${theme.borderRadius}px`,
          };
        } else if (variant === "underline") {
          btnStyle = {
            ...btnStyle,
            backgroundColor: "transparent",
            color: isActive ? activeColor : inactiveColor,
            borderBottom: isActive ? `2px solid ${indicatorColor}` : "2px solid transparent",
            borderRadius: 0,
            paddingBottom: tabSize === "lg" ? "10px" : tabSize === "sm" ? "6px" : "8px",
          };
        } else if (variant === "segmented") {
          btnStyle = {
            ...btnStyle,
            backgroundColor: isActive ? activeBg : "transparent",
            color: isActive ? activeColor : inactiveColor,
            borderRadius: `${theme.borderRadius}px`,
          };
        } else {
          // bordered
          btnStyle = {
            ...btnStyle,
            backgroundColor: isActive ? activeBg : "transparent",
            color: isActive ? activeColor : inactiveColor,
            border: `1px solid ${isActive ? activeColor : borderColor}`,
            borderRadius: `${theme.borderRadius}px`,
          };
        }

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center transition-all cursor-pointer whitespace-nowrap ${sizeConfig.padding}`}
            style={btnStyle}
          >
            <Icon size={sizeConfig.iconSize} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 rounded-full font-semibold flex items-center justify-center leading-none ${sizeConfig.badge}`}
                style={{
                  backgroundColor: badgeBg,
                  color: badgeColor,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NavigationTabs
