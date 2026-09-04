"use client";

import React from "react";
import { Megaphone, Plus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { CampaignsHub } from "@/components/email/campaigns/campaigns-hub";
import { Button } from "@/components/ui/button";

function CampaignsPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper className="gap-4">
      <EcosystemHeader
        title="Email Campaigns"
        description="Design, dispatch, and analyze broadcast email announcements with real-time deliverability and click-tracking."
        icon={Megaphone}
        badgeText="Broadcasts & Drops"
        breadcrumbs={[
          { label: "Email", href: "/email" },
          { label: "Campaigns" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() => router.push("/email/send")}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Send Campaign
          </Button>
        }
      />
      <CampaignsHub />
    </EcosystemWrapper>
  );
}

export default withModulePermission(CampaignsPage, "EMAIL", "canRead");
