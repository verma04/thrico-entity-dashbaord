"use client";

import { RiskManagement } from "@/components/settings/currency/risk-management";
import { ShieldAlert } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { useModuleStore } from "@/store/useModuleStore";

export default function RiskPage() {
  const currencyModuleName = useModuleStore((state) => state.currencyModuleName);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Anti-Abuse Guardrails"
        badgeText="Risk Management"
        description={`Set daily, monthly, and global caps on ${currencyModuleName.toLowerCase()} generation and allocation.`}
        icon={ShieldAlert}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Currency", href: "/gamification/currency" }, { label: "Anti-Abuse Guardrails" }]}
      />
      <EcosystemContainer className="p-6">
        <div className="space-y-6">
          <RiskManagement />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
