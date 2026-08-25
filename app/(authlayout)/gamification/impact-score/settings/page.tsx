"use client";

import React from "react";
import { Gauge } from "lucide-react";
import { TemplateForm } from "@/components/impact/template-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { useGetImpactTemplates } from "@/graphql/actions/impact";

export default function ImpactSettingsPage() {
  const { loading } = useGetImpactTemplates();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Impact Engine Configuration"
        badgeText="Scoring Ruleset"
        description="Manage your impact scoring boundaries, evaluation cycles, and inactivity decay penalties."
        icon={Gauge}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score", href: "/gamification/impact-score" },
          { label: "Settings" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {loading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : (
          <TemplateForm showHeader={false} />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
