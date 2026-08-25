"use client";

import { RiskManagement } from "@/components/settings/currency/risk-management";
import { ShieldAlert } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { useModuleStore } from "@/store/useModuleStore";

import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";

export default function RiskPage() {
  const currencyModuleName = useModuleStore((state) => state.currencyModuleName || "Currency");

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Anti-Abuse Guardrails"
        badgeText="Risk Management"
        description={`Set daily, monthly, and global caps on ${currencyModuleName.toLowerCase()} generation and allocation.`}
        icon={ShieldAlert}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Currency", href: "/gamification/currency" },
          { label: "Anti-Abuse Guardrails" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <RiskManagement />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
