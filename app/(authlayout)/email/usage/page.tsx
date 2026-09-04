"use client";

import React from "react";
import { BarChart3, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import UsageDashboard from "@/components/email/usage-dashboard";
import { Button } from "@/components/ui/button";

function UsagePage() {
  const router = useRouter();

  return (
    <EcosystemWrapper className="gap-4">
      <EcosystemHeader
        title="Usage & Activity Logs"
        description="Audit live email transmission events, monitor delivery quotas, and inspect transaction history."
        icon={BarChart3}
        badgeText="Audit & Quotas"
        breadcrumbs={[
          { label: "Email", href: "/email" },
          { label: "Usage & Logs" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() => router.push("/email/send")}
            className="h-[30px] rounded-[4px] gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Send Campaign
          </Button>
        }
      />
      <UsageDashboard />
    </EcosystemWrapper>
  );
}

export default withModulePermission(UsagePage, "EMAIL", "canRead");
