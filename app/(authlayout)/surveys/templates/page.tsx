"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { TemplateGallery } from "@/components/surveys/templates/template-gallery";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  Layout,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Search,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { useRouter } from "next/navigation";
import { useModuleStore } from "@/store/useModuleStore";

function SurveyTemplatesPage() {
  const singularName = useModuleStore((state) => state.surveySingularName);
  const router = useRouter();

  return (
    <EcosystemWrapper anonymized-1="survey-templates">
      <EcosystemHeader
        title="Template Gallery"
        badgeText="Research Acceleration"
        description={`Leverage pre-instantiated architectural ${singularName.toLowerCase()} nodes designed for high engagement and quality community insights.`}
        icon={Sparkles}
        breadcrumbs={[
          { label: "Surveys", href: "/surveys/all" },
          { label: "Templates" },
        ]}
      >
        <CtaButton variant="primary" onClick={() => router.push("/surveys")}>
          <ArrowLeft className="h-4 w-4 text-white" />
          Back to Survey
        </CtaButton>
      </EcosystemHeader>

      <EcosystemContainer className="p-8 lg:p-12">
        <TemplateGallery />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveyTemplatesPage, "SURVEYS", "canRead"),
  "surveys",
);
