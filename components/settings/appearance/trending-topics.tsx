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

  return (
    <Card
      className="p-4"
      style={{
        backgroundColor: theme.inputBackground,
        borderColor: theme.borderColor,
        borderRadius: `${theme.borderRadius}px`,
        boxShadow: theme.boxShadow,
      }}
    >
      <h3
        className="font-semibold mb-4"
        style={{
          color: theme.textColor,
          fontSize: `${theme.fontSize}px`,
          fontWeight: theme.fontWeight as any,
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
              borderBottom: index < topics.length - 1 ? `1px solid ${theme.borderColor}` : "none",
            }}
          >
            <p style={{ color: theme.primaryColor, cursor: "pointer" }}>#{item.topic}</p>
            <Badge style={{ backgroundColor: theme.primaryColor, color: "#fff" }}>{item.posts}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default TrendingTopics
