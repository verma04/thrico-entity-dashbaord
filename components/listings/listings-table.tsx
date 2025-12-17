"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye, CheckCircle2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "./data-table"
import { ListingDetailsDrawer } from "./listing-details-drawer"
import { AnalyticsDialog } from "./analytics-dialog"
import Image from "next/image"

interface Listing {
  id: string
  title: string
  price: number
  location: string
  status: string
  verified: boolean
  views: number
  createdAt: Date
  media: Array<{ url: string }>
}

export function ListingsTable({ listings }: { listings: Listing[] }) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)

  const columns: ColumnDef<Listing>[] = [
    {
      accessorKey: "title",
      header: "Listing",
      cell: ({ row }) => {
        const listing = row.original
        return (
          <div className="flex items-center gap-3">
            {listing.media?.length > 0 && (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={`https://cdn.thrico.network/${listing.media[0].url}`}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-foreground truncate max-w-xs">{listing.title}</p>
              <p className="text-xs text-muted-foreground">₹{listing.price.toLocaleString()}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("location")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variants: Record<string, string> = {
          PENDING: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
          APPROVED: "bg-green-500/20 text-green-700 dark:text-green-400",
          REJECTED: "bg-red-500/20 text-red-700 dark:text-red-400",
          DISABLED: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
        }
        return <Badge className={`${variants[status] || variants.PENDING} border-0`}>{status}</Badge>
      },
    },
    {
      accessorKey: "verified",
      header: "Verified",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.getValue("verified") ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("views")}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {(row.getValue("createdAt") as Date).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedListing(row.original)
                  setDetailsOpen(true)
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedListing(row.original)
                  setAnalyticsOpen(true)
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={listings} />

      {selectedListing && (
        <>
          <ListingDetailsDrawer open={detailsOpen} onOpenChange={setDetailsOpen} listing={selectedListing} />
          <AnalyticsDialog open={analyticsOpen} onOpenChange={setAnalyticsOpen} listing={selectedListing} />
        </>
      )}
    </>
  )
}
