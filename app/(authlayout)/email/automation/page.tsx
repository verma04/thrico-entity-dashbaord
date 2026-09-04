"use client";

import React from "react";
import { Zap, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { CampaignsList } from "@/components/email/automation/campaigns-list";
import { Button } from "@/components/ui/button";

function AutomationPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper className="gap-4">
      <EcosystemHeader
        title="Email Automations"
        description="Build and manage event-driven automated email workflows triggered by member actions."
        icon={Zap}
        badgeText="Workflows"
        breadcrumbs={[
          { label: "Email", href: "/email" },
          { label: "Automations" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() => router.push("/email/automation/add")}
            className="h-8 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
          >
            <Plus className="h-3.5 w-3.5" />
            New Campaign
          </Button>
        }
      />
      <CampaignsList onCreate={() => router.push("/email/automation/add")} />
    </EcosystemWrapper>
  );
}

export default withModulePermission(AutomationPage, "EMAIL", "canRead");
