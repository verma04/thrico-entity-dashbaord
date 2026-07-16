"use client";

import { ScratchCardManager } from "@/components/rewards/scratch-card/scratch-card-manager";
import { RectangleHorizontal } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

export default function ScratchCardPage() {
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName = currencyConfig?.getEntityCurrencyConfig?.currencyName || "tokens";

  return (
    <EcosystemWrapper className="flex-col gap-4 flex">
      <EcosystemHeader
        title="Scratch Card"
        badgeText="Engagement"
        description={`Configure scratch card reward tiers, ${currencyName} costs, probability weights, and campaign windows.`}
        icon={RectangleHorizontal}
      />

      <ScratchCardManager />
    </EcosystemWrapper>
  );
}
