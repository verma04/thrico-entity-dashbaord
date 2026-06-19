"use client";

import React from "react";
import { Shield, FileText } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";

export default function ImpactAuditLogPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Audit Log"
        description="History of configuration changes made to the impact engine."
        badgeText="Security"
        icon={Shield}
      />
      <EcosystemContainer className="p-6 lg:p-8">
        <div className="max-w-4xl">
          <EcosystemCard
            title="System Changes"
            description="Track who made changes to impact rules and templates."
            icon={FileText}
          >
            <div className="mt-6 py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-100 rounded-xl bg-zinc-50/50">
              <FileText className="h-8 w-8 text-zinc-300 mb-3" />
              <p className="text-sm font-semibold text-zinc-700">No audit records found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Configuration changes to templates and rules will appear here.
              </p>
            </div>
          </EcosystemCard>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
