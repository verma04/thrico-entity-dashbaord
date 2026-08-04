"use client";

import { BarChart3, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import UsageDashboard from "@/components/email/usage-dashboard";
import { Button } from "@/components/ui/button";

export default function UsagePage() {
  const router = useRouter();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Usage & Billing"
        description="Monitor email quota consumption, purchase top-ups, and track billing history."
        icon={BarChart3}
        badgeText="Email Usage"
        breadcrumbs={[{ label: "Email", href: "/email" }, { label: "Usage & Billing" }]}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/email/send")}
            className="h-8 rounded-lg gap-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Credits
          </Button>
        }
      />
      <UsageDashboard />
    </EcosystemWrapper>
  );
}
