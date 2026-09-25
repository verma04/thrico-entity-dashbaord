"use client";

import React, { useState } from "react";
import { PaintBucket, Send, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { WhatsAppTemplatesStudio } from "@/components/whatsapp";
import { CtaButton } from "@/components/ui/cta-button";
import { Button } from "@/components/ui/button";

export default function WhatsAppTemplatesPage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <EcosystemWrapper className="gap-4 m-2">
      <EcosystemHeader
        title="WhatsApp Message Templates"
        description="Manage and sync pre-approved Meta Cloud API message templates for transactional notices, updates, and marketing broadcasts."
        icon={PaintBucket}
        badgeText="Template Studio"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing/utm" },
          { label: "WhatsApp", href: "/marketing/whatsapp" },
          { label: "Templates" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="h-8 rounded-lg gap-1.5 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              New Template
            </Button>
            <CtaButton
              size="sm"
              onClick={() => router.push("/marketing/whatsapp/send")}
              className="h-8 rounded-lg gap-1.5 text-xs font-semibold text-white cursor-pointer shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              Send Message
            </CtaButton>
          </div>
        }
      />
      <WhatsAppTemplatesStudio
        isCreateOpen={isCreateOpen}
        onOpenCreateChange={setIsCreateOpen}
      />
    </EcosystemWrapper>
  );
}
