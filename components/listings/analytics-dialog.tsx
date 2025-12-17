"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Eye, TrendingUp, Users } from "lucide-react"

interface AnalyticsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: any
}

export function AnalyticsDialog({ open, onOpenChange, listing }: AnalyticsDialogProps) {
  const mockStats = {
    views: listing.views || 0,
    uniqueViews: Math.floor((listing.views || 0) * 0.8),
    clicks: Math.floor((listing.views || 0) * 0.15),
    thisWeek: Math.floor((listing.views || 0) * 0.6),
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{listing.title}</DialogTitle>
          <DialogDescription>Analytics for this listing</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground mt-2">{mockStats.views}</p>
                <p className="text-xs text-muted-foreground mt-2">+{Math.floor(mockStats.views * 0.1)} this week</p>
              </div>
              <Eye className="w-5 h-5 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Views</p>
                <p className="text-2xl font-bold text-foreground mt-2">{mockStats.uniqueViews}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  +{Math.floor(mockStats.uniqueViews * 0.2)} from last month
                </p>
              </div>
              <Users className="w-5 h-5 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contact Clicks</p>
                <p className="text-2xl font-bold text-foreground mt-2">{mockStats.clicks}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((mockStats.clicks / mockStats.views) * 100)}% click rate
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-foreground mt-2">{mockStats.thisWeek}</p>
                <p className="text-xs text-muted-foreground mt-2">views this week</p>
              </div>
              <TrendingUp className="w-5 h-5 text-primary/60" />
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
