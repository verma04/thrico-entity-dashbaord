"use client";

import React from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import SendEmail from "@/components/email/send-email";

function SendEmailPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper className="animate-in fade-in duration-500 gap-4">
      <EcosystemHeader
        title="Send Email Campaign"
        description="Compose, target audience segments, customize templates, and broadcast emails."
        icon={Send}
        badgeText="Broadcast"
        breadcrumbs={[
          { label: "Email", href: "/email" },
          { label: "Send Campaign" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/email")}
            className="h-8 rounded-lg gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        }
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-2">
        <SendEmail />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(SendEmailPage, "EMAIL", "canRead");
