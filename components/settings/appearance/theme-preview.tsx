"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import type { EntityTheme } from "@/store/ts-types"
import WebsiteHeader from "./website-header"
import NavigationTabs from "./navigation-tabs"
import PostsFeed from "./posts-feed"
import Sidebar from "./sidebar"

interface ThemePreviewProps {
  theme: EntityTheme
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  return (
    <Card className="p-0 overflow-hidden border">
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: theme.backgroundColor,
          borderRadius: `${theme.borderRadius}px`,
          borderWidth: `${theme.borderWidth}px`,
          borderStyle: theme.borderStyle as any,
          borderColor: theme.borderColor,
          boxShadow: theme.boxShadow,
        }}
      >
        <div className="flex flex-col">
          <WebsiteHeader theme={theme} />
          <div className="p-6">
            <NavigationTabs theme={theme} />
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <PostsFeed theme={theme} />
              </div>
              <Sidebar theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ThemePreview
