"use client";

import React from "react";
import { Settings } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { TemplateForm } from "@/components/impact/template-form";

export default function ImpactSettingsPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Impact Engine Settings"
        description="Manage your impact scoring template configuration and decay mechanics."
        badgeText="Configuration"
        icon={Settings}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Settings" }]}
      />
      <EcosystemContainer className="p-6 lg:p-8">
        <div className="max-w-3xl">
          <EcosystemCard
            title="Engine Configuration"
            description="Set up the foundational rules and decay mechanics for impact scoring."
            icon={Settings}
          >
            <div className="mt-6">
              <TemplateForm />
            </div>
          </EcosystemCard>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
