"use client";

import React from "react";
import { Shield, FileText } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";

export default function ImpactAuditLogPage() {
  return (
    <ModuleAuditLog
      moduleKey="IMPACT_SCORE"
      title="Audit Log"
      description="History of configuration changes made to the impact engine."
      breadcrumbs={[
        { label: "Gamification", href: "/gamification" },
        { label: "Impact Score", href: "/impact-score" },
        { label: "Audit Log" },
      ]}
    />
  );
}
