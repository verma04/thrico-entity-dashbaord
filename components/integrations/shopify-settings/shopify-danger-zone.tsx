"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";

interface ShopifyDangerZoneProps {
  shopDomain?: string;
  onOpenDisconnect: () => void;
}

export function ShopifyDangerZone({
  shopDomain,
  onOpenDisconnect,
}: ShopifyDangerZoneProps) {
  return (
    <PolarisFormCard
      step={4}
      title="Danger Zone & Integration Revocation"
      description="Disconnect or revoke Shopify store integration permissions and stop all automated data syncs."
      badge="Danger Zone"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/[0.02]">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Disconnect Shopify Store
          </span>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Unlinking will stop automatic background syncs and notifications for{" "}
            <strong>{shopDomain || "your store"}</strong>.
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onOpenDisconnect}
          className="h-8 px-3 text-xs font-semibold rounded-lg shrink-0"
        >
          Disconnect Store
        </Button>
      </div>
    </PolarisFormCard>
  );
}
