"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutTemplate, ArrowLeft } from "lucide-react";
import { UnlayerEmailEditor } from "@/components/email/unlayer-editor";
import { useGetEmailTemplate } from "@/graphql/actions/email";
import { STARTER_TEMPLATES } from "@/lib/email-templates";
import { TemplateChooser } from "@/components/email/template-chooser/template-chooser";
import { STARTER_KEY_MAP } from "@/components/email/template-chooser/template-data";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { Button } from "@/components/ui/button";

// ─── Page entry point ─────────────────────────────────────────────────────────
function CreateTemplateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  const [chosenStarter, setChosenStarter] = useState<string | null>(
    id || type ? (type ?? "blank") : null,
  );

  const { data, loading } = useGetEmailTemplate(id || "");

  const initialData = useMemo(() => {
    if (id && data?.getEmailTemplate) return data.getEmailTemplate;
    const starterKey = chosenStarter ?? type;
    if (starterKey && starterKey !== "blank") {
      const mappedKey =
        STARTER_KEY_MAP[starterKey] ??
        (starterKey.toUpperCase() as keyof typeof STARTER_TEMPLATES);
      const starter = STARTER_TEMPLATES[mappedKey];
      if (starter) {
        return {
          id: "",
          name: starter.name,
          subject: starter.subject,
          json: JSON.stringify(starter.blocks),
          html: "",
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return undefined;
  }, [id, data, type, chosenStarter]);

  if (id && loading) {
    return (
      <EcosystemWrapper className="animate-in fade-in duration-500 gap-4">
        <EcosystemHeader
          title="Edit Email Template"
          badgeText="Template Studio"
          description="Loading template configuration, design blocks, and layout settings…"
          icon={LayoutTemplate}
          breadcrumbs={[
            { label: "Email", href: "/email" },
            { label: "Templates", href: "/email/templates" },
            { label: "Loading Template…" },
          ]}
          actions={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/email/templates")}
              className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-semibold text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              All Templates
            </Button>
          }
        />
        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-3">
          <PolarisFormSkeleton
            showHeader={false}
            mainCards={[
              { fieldRows: 2, fullWidthRows: 2 },
              { fieldRows: 0, fullWidthRows: 3 },
            ]}
            sidebarSummaryRows={4}
            showSidebarInfo={true}
            showSidebarTip={true}
          />
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  if (!id && !chosenStarter) {
    return <TemplateChooser onSelect={setChosenStarter} />;
  }

  return <UnlayerEmailEditor id={id || undefined} initialData={initialData} />;
}

function CreateTemplatePage() {
  return (
    <Suspense fallback={<TemplateChooser onSelect={() => {}} loading={true} />}>
      <CreateTemplateContent />
    </Suspense>
  );
}

export default withModulePermission(CreateTemplatePage, "EMAIL", "canCreate");
