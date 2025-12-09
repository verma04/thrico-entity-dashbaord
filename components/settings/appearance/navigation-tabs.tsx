"use client"

import type React from "react"
import { useState } from "react"
import { Home, Users, Calendar, BookOpen } from "lucide-react"
import type { EntityTheme } from "@/store/ts-types"

interface NavigationTabsProps {
  theme: EntityTheme
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState("feed")

  const tabs = [
    { id: "feed", icon: Home, label: "Feed" },
    { id: "communities", icon: Users, label: "Communities" },
    { id: "events", icon: Calendar, label: "Events" },
    { id: "resources", icon: BookOpen, label: "Resources" },
  ]

  return (
    <div
      className="flex gap-6 pb-4 border-b mb-6"
      style={{
        borderColor: theme.borderColor,
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: isActive ? theme.primaryColor : "transparent",
              color: isActive ? "#ffffff" : theme.textColor,
              borderRadius: `${theme.borderRadius}px`,
              fontSize: `${theme.fontSize}px`,
              fontWeight: isActive ? "600" : "500",
            }}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default NavigationTabs
