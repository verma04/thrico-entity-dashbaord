"use client";

import { PaintBucket, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import TemplateList from "@/components/email/template-list";
import { Button } from "@/components/ui/button";

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Email Templates"
        description="Design and manage reusable branded email layouts for your campaigns."
        icon={PaintBucket}
        badgeText="Template Studio"
        breadcrumbs={[{ label: "Email", href: "/email" }, { label: "Templates" }]}
        actions={
          <Button
            size="sm"
            onClick={() => router.push("/email/templates/create")}
            className="h-8 rounded-lg gap-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            New Template
          </Button>
        }
      />
      <TemplateList />
    </EcosystemWrapper>
  );
}
