"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import PagesItemsLayout from "./pages-items-layout"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/50/30">
      <PagesItemsLayout>
        {children}
      </PagesItemsLayout>
    </div>
  )
}
