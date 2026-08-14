"use client";

import React from "react";
import { Trophy, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetImpactRuleById,
  useGetImpactTemplates,
} from "@/graphql/actions/impact";
import { useMutation, gql } from "@apollo/client";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ImpactRuleForm } from "@/components/impact/rule-form";

const UPDATE_IMPACT_RULE = gql`
  mutation UpdateImpactRule($id: ID!, $input: CreateImpactRuleInput!) {
    updateImpactRule(id: $id, input: $input) {
      id
      module
      action
      points
      category
      dailyLimit
      formula
      enabled
    }
  }
`;

export default function EditImpactRulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: moduleData } = useGetEntityGamificationModules();
  const { data: templatesData } = useGetImpactTemplates();
  const { data: ruleData, loading: ruleLoading } = useGetImpactRuleById(id);

  const [updateRule, { loading: isUpdating }] = useMutation(
    UPDATE_IMPACT_RULE,
    {
      refetchQueries: ["GetImpactRules", "GetImpactRuleById"],
    },
  );

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const integrations = moduleData?.getEntityGamificationModules?.integrations || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
  const moduleTriggers = moduleData?.getEntityGamificationModules?.moduleTriggers || [];
  const integrationTriggers = moduleData?.getEntityGamificationModules?.integrationTriggers || [];
  const templates = templatesData?.impactTemplates || [];

  const rule = ruleData?.getImpactRuleById;

  const handleUpdate = async (values: any) => {
    await updateRule({
      variables: {
        id,
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

  if (ruleLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900 dark:text-zinc-100" />
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Rule not found.
      </div>
    );
  }

  const templateId = rule.templateId || templates[0]?.id || "";

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Edit Scoring Rule"
        badgeText="Impact Studio"
        description="Modify how member actions affect their reputation score."
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score", href: "/gamification/impact-score" },
          { label: "Rules", href: "/gamification/impact-score/rules" },
          { label: "Edit" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <ImpactRuleForm
          initialValues={{
            templateId,
            module: rule.module,
            action: rule.action,
            category: rule.category,
            points: rule.points,
            dailyLimit: rule.dailyLimit,
            formula: rule.formula || "",
            description: "",
          }}
          isEdit
          onSubmit={handleUpdate}
          loading={isUpdating}
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
