"use client";

import { SpinWheelManager } from "@/components/rewards/spin-wheel/spin-wheel-manager";
import { Dices } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function SpinWheelPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Spin Wheel"
        badgeText="Engagement"
        description="Configure spin wheel segments, token costs, and winning probabilities."
        icon={Dices}
      />
      <EcosystemContainer className="p-2 flex-col gap-4 flex">
        <SpinWheelManager />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
