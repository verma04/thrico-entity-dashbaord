"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useListingDetails } from "@/graphql/actions/listing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  DollarSign,
  Eye,
  CheckCircle2,
  Loader2,
  Tag,
  ShoppingBag,
  Activity,
  Star,
} from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

export default function ListingManagePage() {
  const singularName = useModuleStore((state) => state.listingSingularName);
  const pathname = usePathname();
  const id = pathname?.split("/")[2];

  const { data, loading } = useListingDetails({
    variables: {
      input: {
        listingId: id,
      },
    },
    skip: !id,
  });

  const listing = data?.getListingDetailsByID;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {singularName} not found.
      </div>
    );
  }

  const stats = [
    {
      label: "Views",
      value: listing.numberOfViews ?? 0,
      icon: Eye,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      label: "Condition",
      value: listing.condition?.replace("USED_LIKE_", "Like ") || "Unknown",
      icon: Activity,
      gradient: "from-violet-500/10 to-violet-600/5",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
      isText: true,
    },
    {
      label: "Status",
      value: listing.status,
      icon: CheckCircle2,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      isText: true,
    },
    {
      label: "Verification",
      value: listing.verification?.isVerified ? "Verified" : "Unverified",
      icon: Star,
      gradient: "from-amber-500/10 to-amber-600/5",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      isText: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden bg-gradient-to-br ${stat.gradient}`}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={`p-2.5 rounded-xl ${stat.iconBg} ring-1 ring-black/[0.04]`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p
                  className={`font-bold ${stat.isText ? "text-sm capitalize" : "text-2xl"} tracking-tight`}
                >
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Listing Overview */}
      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            {singularName} Overview
          </CardTitle>
          <CardDescription>Details about this marketplace {singularName.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              listing.category && {
                icon: ShoppingBag,
                label: "Category",
                value: listing.category,
              },
              listing.location?.name && {
                icon: MapPin,
                label: "Location",
                value: listing.location.name,
              },
              listing.price && {
                icon: DollarSign,
                label: "Price",
                value: `${listing.currency || "₹"}${listing.price}`,
              },
              listing.condition && {
                icon: Tag,
                label: "Condition",
                value: listing.condition.replace(/_/g, " "),
              },
            ]
              .filter(Boolean)
              .map((item: any) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate capitalize">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {listing.description && (
            <>
              <Separator className="bg-border/40" />
              <div>
                <p className="text-sm font-semibold mb-3">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </>
          )}

          {listing.tag && listing.tag.length > 0 && (
            <>
              <Separator className="bg-border/40" />
              <div>
                <p className="text-sm font-semibold mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {listing.tag.map((t: string) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="rounded-lg px-3 py-1 text-xs font-medium"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
