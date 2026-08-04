"use client";

import { GitBranch, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { CampaignsList } from "@/components/email/automation/campaigns-list";
import { Button } from "@/components/ui/button";

export default function AutomationPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Campaigns"
        description="Build and manage automated email workflows triggered by member actions."
        icon={GitBranch}
        badgeText="Automation"
        breadcrumbs={[{ label: "Email", href: "/email" }, { label: "Campaigns" }]}
        actions={
          <Button
            size="sm"
            onClick={() => router.push("/email/automation/add")}
            className="h-8 rounded-lg gap-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            New Campaign
          </Button>
        }
      />
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)] bg-muted/50 overflow-hidden">
        <CampaignsList onCreate={() => router.push("/email/automation/add")} />
      </div>
    </EcosystemWrapper>
  );
}
