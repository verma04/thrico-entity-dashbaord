"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EntityTheme } from "@/store/ts-types"

interface TrendingTopicsProps {
  theme: EntityTheme
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ theme }) => {
  const topics = [
    { topic: "React Hooks", posts: 24 },
    { topic: "TypeScript", posts: 18 },
    { topic: "Next.js", posts: 15 },
    { topic: "GraphQL", posts: 12 },
  ]

  const sidebarBg = theme.Sidebar?.sidebarBg || theme.inputBackground || "#ffffff";
  const sidebarTextColor = theme.Sidebar?.sidebarTextColor || theme.textColor || "#0f172a";
  const sidebarBorderColor = theme.Sidebar?.sidebarBorderColor || theme.borderColor || "#e2e8f0";
  const sidebarActiveColor = theme.Sidebar?.sidebarActiveColor || theme.primaryColor || "#3b82f6";
  const sidebarActiveBg = theme.Sidebar?.sidebarActiveBg || `${sidebarActiveColor}15`;

  return (
    <Card
      className="p-4"
      style={{
        backgroundColor: sidebarBg,
        borderColor: sidebarBorderColor,
        borderRadius: `${theme.borderRadius}px`,
        boxShadow: theme.boxShadow,
      }}
    >
      <h3
        className="font-semibold mb-4"
        style={{
          color: sidebarTextColor,
          fontSize: `${theme.fontSize}px`,
          fontWeight: theme.fontWeight,
        }}
      >
        Trending Topics
      </h3>
      <div className="space-y-3">
        {topics.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center pb-3"
            style={{
              borderBottom: index < topics.length - 1 ? `1px solid ${sidebarBorderColor}` : "none",
            }}
          >
            <p style={{ color: sidebarActiveColor, cursor: "pointer" }}>#{item.topic}</p>
            <Badge style={{ backgroundColor: sidebarActiveBg, color: sidebarActiveColor }}>{item.posts}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default TrendingTopics
