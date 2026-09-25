"use client";

import React from "react";
import { Megaphone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { WhatsAppCampaignsHub } from "@/components/whatsapp";
import { CtaButton } from "@/components/ui/cta-button";

export default function WhatsAppCampaignsPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper className="gap-4 m-2">
      <EcosystemHeader
        title="WhatsApp Broadcasts & Dispatches"
        description="Review dispatched message broadcasts, Meta delivery receipts, and recipient read timelines."
        icon={Megaphone}
        badgeText="Broadcasts & Logs"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing/utm" },
          { label: "WhatsApp", href: "/marketing/whatsapp" },
          { label: "Campaigns & Logs" },
        ]}
        actions={
          <CtaButton
            size="sm"
            onClick={() => router.push("/marketing/whatsapp/send")}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold bg-[#25D366] hover:bg-[#1ebe5a] text-white cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            New Broadcast
          </CtaButton>
        }
      />
      <WhatsAppCampaignsHub />
    </EcosystemWrapper>
  );
}
