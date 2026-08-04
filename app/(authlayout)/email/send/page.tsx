"use client";

import { Send } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import SendEmail from "@/components/email/send-email";

export default function SendEmailPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Send Email"
        description="Compose and send email campaigns to your community members."
        icon={Send}
        badgeText="Compose"
        breadcrumbs={[{ label: "Email", href: "/email" }, { label: "Send Email" }]}
      />
      <SendEmail />
    </EcosystemWrapper>
  );
}
