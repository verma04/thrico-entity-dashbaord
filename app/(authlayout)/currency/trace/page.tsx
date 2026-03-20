"use client";

import { QuickAuditTrace } from "@/components/settings/currency/quick-audit-trace";
import { List } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function QuickTracePage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Quick Trace"
        badgeText="Currency Audit"
        description="Real-time feed of recent currency movements and conversions."
        icon={List}
      />
      <EcosystemContainer className="p-6">
        <div className="max-w-4xl space-y-6">
          <QuickAuditTrace />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
