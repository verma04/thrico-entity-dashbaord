"use client";

import React from "react";
import { Send, ArrowLeft, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CtaButton } from "@/components/ui/cta-button";
import { WhatsAppSendWizard } from "@/components/whatsapp";

export default function WhatsAppSendPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper className="animate-in fade-in duration-300 gap-4 m-2">
      <EcosystemHeader
        title="Send WhatsApp Broadcast"
        description="Compose, target opted-in community members, select pre-approved Meta templates, fill variables, and dispatch messages."
        icon={Send}
        badgeText="Broadcast Wizard"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing/utm" },
          { label: "WhatsApp", href: "/marketing/whatsapp" },
          { label: "Campaigns", href: "/marketing/whatsapp/campaigns" },
          { label: "Send Message" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <CtaButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/marketing/whatsapp/campaigns")}
              className="h-8 gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 px-2.5 rounded-lg cursor-pointer"
            >
              <Megaphone className="h-3.5 w-3.5" />
              Dispatches Hub
            </CtaButton>
            <CtaButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/marketing/whatsapp")}
              className="h-8 gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 px-2.5 rounded-lg cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </CtaButton>
          </div>
        }
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 m-0">
        <WhatsAppSendWizard />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
