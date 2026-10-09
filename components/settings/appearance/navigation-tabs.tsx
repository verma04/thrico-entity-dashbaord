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
    { id: "communities", icon: Users, label: "Communities" },
    { id: "events", icon: Calendar, label: "Events" },
    { id: "resources", icon: BookOpen, label: "Resources" },
  ];

  const variant = theme.Navigation?.tabLayoutVariant || "pills";
  const activeColor = theme.Navigation?.tabActiveColor || theme.primaryColor || "#3b82f6";
  const activeBg = theme.Navigation?.tabActiveBg || "rgba(59, 130, 246, 0.1)";
  const inactiveColor = theme.Navigation?.tabInactiveColor || theme.textColor || "#64748b";
  const borderColor = theme.Navigation?.tabBorderColor || theme.borderColor || "#e2e8f0";
  const indicatorColor = theme.Navigation?.tabIndicatorColor || activeColor;

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
          fontSize: `${theme.fontSize}px`,
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
            paddingBottom: "8px",
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
            className="flex items-center gap-2 px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap"
            style={btnStyle}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default NavigationTabs
