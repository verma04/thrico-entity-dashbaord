"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCreateImpactRule,
  useGetImpactTemplates,
} from "@/graphql/actions/impact";
import { useGetEntityGamificationModules } from "@/graphql/actions/gamification/gamification-quiries";
import { GET_IMPACT_RULES } from "@/graphql/quries/impact";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ImpactRuleForm } from "@/components/impact/rule-form";

export default function CreateImpactRulePage() {
  const router = useRouter();
  const { data: moduleData } = useGetEntityGamificationModules();
  const { data: templatesData } = useGetImpactTemplates();
  const [createRule, { loading: isCreating }] = useCreateImpactRule({
    refetchQueries: [{ query: GET_IMPACT_RULES }],
  });

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const integrations = moduleData?.getEntityGamificationModules?.integrations || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
  const moduleTriggers = moduleData?.getEntityGamificationModules?.moduleTriggers || [];
  const integrationTriggers = moduleData?.getEntityGamificationModules?.integrationTriggers || [];
  const templates = templatesData?.impactTemplates || [];

  const handleCreate = async (values: any) => {
    await createRule({
      variables: {
        input: {
          module: values.module,
          action: values.action,
          category: values.category,
          points: Number(values.points),
          dailyLimit: values.dailyLimit ? Number(values.dailyLimit) : 0,
          formula: values.formula || null,
        },
      },
    });
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Scoring Rule"
        badgeText="Impact Studio"
        description="Define a new rule for how member actions affect their reputation score."
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score", href: "/gamification/impact-score" },
          { label: "Rules", href: "/gamification/impact-score/rules" },
          { label: "Create" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <ImpactRuleForm
          onSubmit={handleCreate}
          loading={isCreating}
          modules={modules}
          integrations={integrations}
          triggers={triggers}
          moduleTriggers={moduleTriggers}
          integrationTriggers={integrationTriggers}
          templates={templates}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
