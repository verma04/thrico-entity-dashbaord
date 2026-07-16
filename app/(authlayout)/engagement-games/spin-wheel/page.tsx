"use client";

import { SpinWheelManager } from "@/components/rewards/spin-wheel/spin-wheel-manager";
import { Dices } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

export default function SpinWheelPage() {
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName = currencyConfig?.getEntityCurrencyConfig?.currencyName || "tokens";

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Spin Wheel"
        badgeText="Engagement"
        description={`Configure spin wheel segments, ${currencyName} costs, and winning probabilities.`}
        icon={Dices}
      />

      <SpinWheelManager />
    </EcosystemWrapper>
  );
}
