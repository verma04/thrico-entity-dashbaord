"use client";

import React from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import {
  useCreateImpactRule,
  useGetImpactTemplates,
} from "@/graphql/actions/impact";
import { GET_IMPACT_RULES } from "@/graphql/quries/impact";
import { useGetEntityGamificationModules } from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { ImpactRuleForm } from "@/components/impact/rule-form";

export default function CreateImpactRulePage() {
  const router = useRouter();
  const { data: moduleData } = useGetEntityGamificationModules();
  const { data: templatesData } = useGetImpactTemplates();
  const [createRule, { loading: isCreating }] = useCreateImpactRule({
    refetchQueries: [{ query: GET_IMPACT_RULES }],
  });

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
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
      />

      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Impact Score</span>
          <ChevronRight className="h-3 w-3" />
          <span>Rules</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Create Rule</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <ImpactRuleForm
        onSubmit={handleCreate}
        loading={isCreating}
        modules={modules}
        triggers={triggers}
        templates={templates}
      />
    </EcosystemWrapper>
  );
}
