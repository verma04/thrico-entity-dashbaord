"use client"

import type React from "react"
import type { EntityTheme } from "@/store/ts-types"
import TrendingTopics from "./trending-topics"
import ActiveMembers from "./active-members"

interface SidebarProps {
  theme: EntityTheme
}

const Sidebar: React.FC<SidebarProps> = ({ theme }) => {
  return (
    <div className="space-y-4">
      <TrendingTopics theme={theme} />
      <ActiveMembers theme={theme} />
    </div>
  )
}

export default Sidebar
