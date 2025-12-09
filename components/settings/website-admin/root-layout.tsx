"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import PagesItemsLayout from "./pages-items-layout"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PagesItemsLayout>
        <Card className="m-6 border-border/50">{children}</Card>
      </PagesItemsLayout>
    </div>
  )
}
