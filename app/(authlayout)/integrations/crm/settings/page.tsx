"use client";

import React from "react";
import {
  Settings,
  ShieldCheck,
  Zap,
  Globe,
  Contact2,
  RefreshCw,
  Info,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CRMIntegrationCard } from "@/components/settings/integrations";
import { CRMProvider, CRM_PROVIDERS_CONFIG } from "@/graphql/actions";

export default function CRMSettingsPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="CRM Platform Settings & Connections"
        description="Manage API credentials, OAuth tokens, connection health, and real-time synchronization schedules for your CRM instances."
        breadcrumbs={[
          { label: "Integrations", href: "/settings/integrations" },
          { label: "CRM Hub", href: "/integrations/crm" },
          { label: "Settings" },
        ]}
        icon={Settings}
        badgeText="API Connections"
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-6 space-y-6">
          {/* Provider Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.values(CRMProvider).map((providerKey) => (
              <CRMIntegrationCard key={providerKey} providerKey={providerKey} />
            ))}
          </div>

          {/* Security & Sync Architecture Notice */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/20 border border-border/40 text-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="space-y-1 text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground text-[13px]">
                Enterprise Multi-Tenant CRM Security
              </p>
              <p className="text-[12px] leading-[1.6]">
                CRM tokens, PKCE authorization states, and REST client secrets are encrypted using AES-256-GCM. Synchronizations run in isolated background workers adhering strictly to entity tenant boundaries and API rate limits.
              </p>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
