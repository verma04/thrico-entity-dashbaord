"use client";

import React, { useState } from "react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminVerifiedBadge,
} from "@/components/shared/admin-table/admin-table";
import {
  MoreHorizontal,
  Eye,
  TrendingUp,
  MapPin,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ListingDetailsDrawer } from "./listing-details-drawer";
import { AnalyticsDialog } from "./analytics-dialog";
import Image from "next/image";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

interface Listing {
  id: string;
  title: string;
  price: number;
  location:
    | {
        name?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
      }
    | string;
  status: string;
  verified: boolean;
  views: number;
  createdAt: Date;
  media: Array<{ url: string }>;
  addedBy?: string;
  postedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

export function ListingsTable({ listings }: { listings: Listing[] }) {
  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const columns = [
    {
      key: "title",
      header: `${singularName} Info`,
      cell: (listing: Listing) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-border/10">
            {listing.media?.length > 0 ? (
              <Image
                src={`https://cdn.thrico.network/${listing?.media[0]?.url}`}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                {listing.title.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm truncate max-w-[200px]">
                {listing.title}
              </span>
              {listing.verified && <AdminVerifiedBadge />}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] font-bold text-emerald-600">
                ₹{listing.price.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <MapPin className="h-2.5 w-2.5 opacity-50" />
                {typeof listing.location === "object"
                  ? listing.location?.name || listing.location?.address || "—"
                  : listing.location || "—"}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (listing: Listing) => (
        <AdminStatusBadge status={listing.status}>
          {listing.status}
        </AdminStatusBadge>
      ),
    },
    {
      key: "creator",
      header: "Creator",
      cell: (listing: Listing) => {
        if (!listing.postedBy) {
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 rounded-full border border-border/60">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                  EN
                </AvatarFallback>
              </Avatar>
              <span className="text-[12px] font-semibold text-muted-foreground">
                Entity
              </span>
            </div>
          );
        }

        return (
          <UserProfileHoverCard user={listing.postedBy}>
            <div className="flex items-center gap-2 cursor-pointer group">
              <Avatar className="h-6 w-6 rounded-full border border-border/60">
                <AvatarImage
                  src={
                    listing.postedBy.avatar
                      ? listing.postedBy.avatar.startsWith("http")
                        ? listing.postedBy.avatar
                        : `https://cdn.thrico.network/${listing.postedBy.avatar}`
                      : ""
                  }
                  alt={`${listing.postedBy.firstName} ${listing.postedBy.lastName}`}
                />
                <AvatarFallback className="text-[10px] bg-muted">
                  {listing.postedBy.firstName?.charAt(0)}
                  {listing.postedBy.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[12px] font-medium group-hover:text-primary transition-colors truncate max-w-[100px]">
                {listing.postedBy.firstName} {listing.postedBy.lastName}
              </span>
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "engagement",
      header: "Views",
      cell: (listing: Listing) => (
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-indigo-500 opacity-60" />
          <span className="text-sm font-semibold text-foreground">
            {listing.views}
          </span>
        </div>
      ),
    },
    {
      key: "created",
      header: "Posted",
      cell: (listing: Listing) => (
        <span className="text-[11px] text-muted-foreground font-medium">
          {moment(listing.createdAt).fromNow()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (listing: Listing) => (
        <div className="flex justify-end pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted rounded-lg"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[180px] rounded-xl shadow-xl"
            >
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-3 py-2">
                Operations
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="rounded-lg mx-1 cursor-pointer gap-2"
                onClick={() => {
                  window.location.href = `/listing/${listing.id}/manage`;
                }}
              >
                <Settings className="w-3.5 h-3.5" />
                Manage {singularName}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg mx-1 cursor-pointer gap-2"
                onClick={() => {
                  setSelectedListing(listing);
                  setDetailsOpen(true);
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg mx-1 cursor-pointer gap-2"
                onClick={() => {
                  window.location.href = `/listing/${listing.id}/audit-log`;
                }}
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                Audit Log
              </DropdownMenuItem>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem className="rounded-lg mx-1 cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/5">
                Remove {singularName}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        data={listings || []}
        keyExtractor={(item) => item.id}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Your marketplace is waiting for its first item."
      />

      {selectedListing && (
        <>
          <ListingDetailsDrawer
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            listing={selectedListing}
          />
          <AnalyticsDialog
            open={analyticsOpen}
            onOpenChange={setAnalyticsOpen}
            listing={selectedListing}
          />
        </>
      )}
    </>
  );
}
