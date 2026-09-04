"use client";

import React from "react";
import { Send, ArrowLeft, Megaphone } from "lucide-react";
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
    <EcosystemWrapper className="animate-in fade-in duration-300 gap-4">
      <EcosystemHeader
        title="Send Email Broadcast"
        description="Compose, target audience segments, customize templates, and broadcast email campaigns."
        icon={Send}
        badgeText="Campaign Wizard"
        breadcrumbs={[
          { label: "Email", href: "/email" },
          { label: "Campaigns", href: "/email/campaigns" },
          { label: "Send Campaign" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/email/campaigns")}
              className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
            >
              <Megaphone className="h-3 w-3" />
              Campaigns Hub
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/email")}
              className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              Dashboard
            </Button>
          </div>
        }
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 m-0">
        <SendEmail />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(SendEmailPage, "EMAIL", "canRead");

