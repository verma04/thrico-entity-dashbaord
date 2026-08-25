"use client";

import React from "react";
import Link from "next/link";
import { Store, Eye, CheckCircle, Clock, XCircle, PauseCircle } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Card, CardContent } from "@/components/ui/card";

interface ListingItem {
  id: string;
  title: string;
  category?: string;
  condition?: string;
  price?: number;
  status?: string;
  numberOfViews?: number;
}

interface ListingsRecentCatalogProps {
  loading: boolean;
  listings: ListingItem[];
}

export function ListingsRecentCatalog({
  loading,
  listings,
}: ListingsRecentCatalogProps) {
  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || "approved";
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    if (s === "blocked") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle className="w-3 h-3" />
          Blocked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
        <PauseCircle className="w-3 h-3" />
        {status || "Inactive"}
      </span>
    );
  };

  return (
    <section className="space-y-3">
      <DashboardSectionHeading
        title="Recent Catalog Performance"
        icon={<Store className="h-3.5 w-3.5 text-muted-foreground" />}
        rightElement={
          <Link href="/listing/all">
            <span className="text-xs text-primary font-medium hover:underline cursor-pointer">
              View all
            </span>
          </Link>
        }
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-muted/50 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Store className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-xs font-medium">No recent marketplace listings recorded</p>
            </div>
          ) : (
            <div className="space-y-2">
              {listings.slice(0, 5).map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xs transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/listing/${listing.id}/manage`}
                      className="text-xs font-semibold text-foreground hover:text-primary transition-colors block truncate"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {listing.category || "General"} {listing.condition ? `• ${listing.condition}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-10 shrink-0 ml-3">
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground tabular-nums">
                        ${Number(listing.price || 0).toLocaleString()}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase font-medium">
                        Price
                      </p>
                    </div>

                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-foreground tabular-nums flex items-center justify-end gap-1">
                        <Eye size={11} className="text-muted-foreground" />
                        {Number(listing.numberOfViews || 0).toLocaleString()}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase font-medium">
                        Views
                      </p>
                    </div>

                    <div className="w-24 flex justify-end">
                      {getStatusBadge(listing.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
