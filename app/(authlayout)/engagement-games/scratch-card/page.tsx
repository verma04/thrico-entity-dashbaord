"use client";

import { ScratchCardManager } from "@/components/rewards/scratch-card/scratch-card-manager";
import { RectangleHorizontal } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function ScratchCardPage() {
  return (
    <EcosystemWrapper className="flex-col gap-4 flex">
      <EcosystemHeader
        title="Scratch Card"
        badgeText="Engagement"
        description="Configure scratch card reward tiers, probability weights, and campaign windows."
        icon={RectangleHorizontal}
      />
      <EcosystemContainer className="p-2 flex-col gap-4 flex">
        <ScratchCardManager />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
