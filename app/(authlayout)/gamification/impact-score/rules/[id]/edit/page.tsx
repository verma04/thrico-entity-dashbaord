"use client";

import React from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  useGetImpactRuleById,
  useGetImpactTemplates,
} from "@/graphql/actions/impact";
import { useMutation, gql } from "@apollo/client";
import { useGetEntityGamificationModules } from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
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
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
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
      <div className="p-8 text-center text-sm text-zinc-500">
        Loading rule details...
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

  // Find the template ID for this rule, or default to the first template since backend drops templateId in update
  const templateId = rule.templateId || templates[0]?.id || "";

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Edit Scoring Rule"
        badgeText="Impact Studio"
        description="Modify how member actions affect their reputation score."
        icon={Trophy}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Impact Score", href: "/impact-score" }, { label: "Rules", href: "/impact-score/rules" }, { label: "Edit" }]}
      />

      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Impact Score</span>
          <ChevronRight className="h-3 w-3" />
          <span>Rules</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Edit Rule</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <ImpactRuleForm
        initialValues={{
          templateId,
          module: rule.module,
          action: rule.action,
          category: rule.category,
          points: rule.points,
          dailyLimit: rule.dailyLimit,
          formula: rule.formula || "",
          description: "", // Rules don't have description in backend yet
        }}
        isEdit
        onSubmit={handleUpdate}
        loading={isUpdating}
        modules={modules}
        triggers={triggers}
        templates={templates}
      />
    </EcosystemWrapper>
  );
}
