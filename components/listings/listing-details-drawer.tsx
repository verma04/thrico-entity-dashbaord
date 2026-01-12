"use client";

import {
  MapPin,
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  MoreVertical,
  Share2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ListingDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: any;
}

export function ListingDetailsDrawer({
  open,
  onOpenChange,
  listing,
}: ListingDetailsDrawerProps) {
  if (!listing) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[540px] p-0 border-l border-border/50 sm:max-w-[540px] gap-0 flex flex-col bg-background"
      >
        <ScrollArea className="h-full w-full flex-1">
          <div className="flex flex-col gap-6 pb-20">
            {/* Hero Image Section */}
            <div className="relative w-full aspect-[4/3] bg-muted group">
              {listing.media?.length > 0 ? (
                <img
                  src={`https://cdn.thrico.network/${listing.media[0].url}`}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-accent/20 text-muted-foreground gap-2">
                  <div className="h-12 w-12 rounded-full bg-background/50 flex items-center justify-center">
                    <Tag className="h-6 w-6 opacity-50" />
                  </div>
                  <span className="text-sm font-medium">No Image</span>
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />

              {/* Top Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit Listing
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Listing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="px-6 space-y-8 -mt-12 relative z-10">
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          listing.status === "active" ? "default" : "secondary"
                        }
                        className="rounded-full px-3 capitalize shadow-sm"
                      >
                        {listing.status}
                      </Badge>
                      {listing.verified && (
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 gap-1 bg-background/50 backdrop-blur-sm border-primary/20 text-primary"
                        >
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-tight">
                      {listing.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    ₹{listing.price?.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    IN R
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-accent/30 rounded-xl p-3 flex items-start gap-3 border border-border/50">
                  <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Category
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {listing.category}
                    </p>
                  </div>
                </div>

                <div className="bg-accent/30 rounded-xl p-3 flex items-start gap-3 border border-border/50">
                  <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {listing.location}
                    </p>
                  </div>
                </div>

                <div className="bg-accent/30 rounded-xl p-3 flex items-start gap-3 border border-border/50">
                  <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Posted
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {/* Assuming listing.createdAt is a string or date, let's keep it simple or format if needed */}
                      {typeof listing.createdAt === "string"
                        ? listing.createdAt
                        : new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-accent/30 rounded-xl p-3 flex items-start gap-3 border border-border/50">
                  <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      Views
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {listing.views}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Condition Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Condition
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium">
                    {listing.condition
                      ?.replace(/_/g, " ")
                      .replace(/\b\w/g, (c: string) => c.toUpperCase()) ||
                      "Not Specified"}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  About this item
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Floating Action Bar */}
        <div className="p-4 border-t border-border bg-background/80 backdrop-blur-md absolute bottom-0 left-0 right-0">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-11 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
              Contact Seller
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
