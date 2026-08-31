"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { Suspense } from "react";
import { TemplateGallery } from "@/components/surveys/templates/template-gallery";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Sparkles, ArrowLeft } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { useRouter } from "next/navigation";
import { useModuleStore } from "@/store/useModuleStore";

function SurveyTemplatesPage() {
  const singularName = useModuleStore((state) => state.surveySingularName);
  const router = useRouter();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Template Gallery"
        badgeText="Pre-Built Blueprints"
        description={`Accelerate research with curated ${singularName.toLowerCase()} templates designed for community feedback, ratings, and market insights.`}
        icon={Sparkles}
        breadcrumbs={[
          { label: "Surveys", href: "/surveys/all" },
          { label: "Templates" },
        ]}
        actions={
          <CtaButton onClick={() => router.push("/surveys/all")}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Surveys
          </CtaButton>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <Suspense fallback={null}>
          <TemplateGallery />
        </Suspense>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveyTemplatesPage, "SURVEYS", "canRead"),
  "surveys",
);
