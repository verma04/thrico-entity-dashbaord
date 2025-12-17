import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export function ListingPreview({ data }: { data: any }) {
  return (
    <Card className="overflow-hidden border-border">
      <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
        {data.media?.length > 0 ? (
          <img
            src={data.media[0].thumbUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          "Image preview"
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{data.title}</h3>
          <p className="text-2xl font-bold text-primary mt-2">₹{data.price?.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4" />
          {data.location}
        </div>

        <div className="flex gap-2">
          <Badge variant="outline">{data.category}</Badge>
          <Badge variant="outline">
            {["NEW", "USED_LIKE_NEW", "USED_LIKE_GOOD", "USED_LIKE_FAIR"].includes(data.condition)
              ? {
                  NEW: "New",
                  USED_LIKE_NEW: "Like New",
                  USED_LIKE_GOOD: "Good",
                  USED_LIKE_FAIR: "Fair",
                }[data.condition]
              : data.condition}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Description</p>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
      </div>
    </Card>
  )
}
