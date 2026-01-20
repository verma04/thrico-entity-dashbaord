"use client";

import React from "react";
import { OffersManager } from "@/components/offers/offers-manager";
import { Tag } from "lucide-react";

export default function AllOffersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Tag className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Offers</h1>
          <p className="text-sm text-muted-foreground">
            Manage all active and inactive offers across the platform.
          </p>
        </div>
      </div>

      <OffersManager />
    </div>
  );
}
