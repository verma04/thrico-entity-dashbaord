"use client";

import { QuickAuditTrace } from "@/components/settings/currency/quick-audit-trace";
import { Activity } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { useModuleStore } from "@/store/useModuleStore";

export default function QuickTracePage() {
  const currencyModuleName = useModuleStore((state) => state.currencyModuleName);
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Quick Trace"
        badgeText={currencyModuleName}
        description={`Overview of gamification ${currencyModuleName.toLowerCase()} earned by members.`}
        icon={Activity}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Currency", href: "/gamification/currency" },
          { label: "Quick Trace" },
        ]}
      />

      <QuickAuditTrace />
    </EcosystemWrapper>
  );
}
