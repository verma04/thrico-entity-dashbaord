"use client";

import { RedemptionLogic } from "@/components/settings/currency/redemption-logic";
import { ScrollText } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function RedemptionPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Redemption Logic"
        badgeText="Checkout Rules"
        description="Define checkout spending rules and the 70/30 local earning policy."
        icon={ScrollText}
      />
      <EcosystemContainer className="p-6">
        <div className="space-y-6">
          <RedemptionLogic />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
