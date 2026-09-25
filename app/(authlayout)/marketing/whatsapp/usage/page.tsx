"use client";

import React from "react";
import { BarChart3, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { WhatsAppUsageHealth } from "@/components/whatsapp";
import { CtaButton } from "@/components/ui/cta-button";

export default function WhatsAppUsagePage() {
  const router = useRouter();

  return (
    <EcosystemWrapper className="gap-4 m-2">
      <EcosystemHeader
        title="WhatsApp Quotas, Health & Webhooks"
        description="Audit Meta Cloud API messaging limits, tier utilization, phone number quality rating, and integration credentials."
        icon={BarChart3}
        badgeText="Quotas & Health"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing/utm" },
          { label: "WhatsApp", href: "/marketing/whatsapp" },
          { label: "Usage & Health" },
        ]}
        actions={
          <CtaButton
            size="sm"
            onClick={() => router.push("/marketing/whatsapp/send")}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold  text-white cursor-pointer shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Send Message
          </CtaButton>
        }
      />
      <WhatsAppUsageHealth />
    </EcosystemWrapper>
  );
}
