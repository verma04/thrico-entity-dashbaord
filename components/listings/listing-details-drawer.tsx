"use client"
import { MapPin, Calendar, Tag, Eye } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ListingDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: any
}

export function ListingDetailsDrawer({ open, onOpenChange, listing }: ListingDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Listing Details</SheetTitle>
          <SheetDescription>View and manage listing information</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Image Gallery */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Images</h3>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              {listing.media?.length > 0 && (
                <img
                  src={`https://cdn.thrico.network/${listing.media[0].url}`}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Title and Price */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{listing.title}</h3>
            <p className="text-3xl font-bold text-primary">₹{listing.price?.toLocaleString()}</p>
            <div className="flex gap-2 pt-2">
              <Badge>{listing.status}</Badge>
              {listing.verified && <Badge variant="outline">Verified</Badge>}
            </div>
          </div>

          <Separator />

          {/* Key Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="w-4 h-4" />
              <span>{listing.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{listing.createdAt?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{listing.views} views</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Description</h4>
            <p className="text-sm text-muted-foreground">{listing.description}</p>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Condition</h4>
            <p className="text-sm text-muted-foreground">
              {listing.condition?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
            </p>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              Edit Listing
            </Button>
            <Button variant="destructive" className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
