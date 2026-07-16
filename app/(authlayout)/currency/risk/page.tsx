"use client";

import { RiskManagement } from "@/components/settings/currency/risk-management";
import { ShieldAlert } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function RiskPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Anti-Abuse Guardrails"
        badgeText="Risk Management"
        description="Set daily, monthly, and global caps on TC generation and movement."
        icon={ShieldAlert}
      />
      <EcosystemContainer className="p-6">
        <div className="space-y-6">
          <RiskManagement />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
