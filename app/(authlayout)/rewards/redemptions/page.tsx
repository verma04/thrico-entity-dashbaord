"use client";

import React from "react";
import { Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RedemptionsTable } from "@/components/rewards/redemptions/redemptions-table";
import { useGetRedemptions } from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function RedemptionsPage() {
  const { data, loading } = useGetRedemptions();
  const redemptions = data?.getRedemptions || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Redemption History"
        badgeText="Vouchers"
        description="Track all reward redemptions and fulfillment statuses across the platform."
        icon={History}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              {redemptions.length} records
            </span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          All Redemptions
        </h2>

        <RedemptionsTable redemptions={redemptions} isLoading={loading} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
