"use client";

import React from "react";
import { PaintBucket, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import TemplateList from "@/components/email/template-list";
import { Button } from "@/components/ui/button";

function TemplatesPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper className="gap-4">
      <EcosystemHeader
        title="Email Templates"
        description="Design and manage reusable responsive layouts for your campaigns and automated announcements."
        icon={PaintBucket}
        badgeText="Template Studio"
        breadcrumbs={[
          { label: "Email", href: "/email" },
          { label: "Templates" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() => router.push("/email/templates/create")}
            className="h-8 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
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

export default withModulePermission(TemplatesPage, "EMAIL", "canRead");
