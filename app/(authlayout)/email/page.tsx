"use client";

import { Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import EmailDashboard from "@/components/email/email-dashboard";
import { Button } from "@/components/ui/button";

export default function EmailPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Email Campaigns"
        description="Overview of your email communications and campaign performance."
        icon={Mail}
        badgeText="Email Hub"
        breadcrumbs={[{ label: "Email" }]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/email/usage")}
              className="h-8 rounded-lg text-xs"
            >
              Usage Analytics
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/email/send")}
              className="h-8 rounded-lg gap-2 text-xs"
            >
              <Send className="h-3.5 w-3.5" />
              New Campaign
            </Button>
          </>
        }
      />
      <EmailDashboard />
    </EcosystemWrapper>
  );
}
