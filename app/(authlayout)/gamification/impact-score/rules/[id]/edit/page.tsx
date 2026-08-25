"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetImpactRuleById,
  useGetImpactTemplates,
} from "@/graphql/actions/impact";
import { useGetEntityGamificationModules } from "@/graphql/actions/gamification/gamification-quiries";
import { useMutation, gql } from "@apollo/client";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { ImpactRuleForm } from "@/components/impact/rule-form";
import { Button } from "@/components/ui/button";

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

  const { data: moduleData, loading: modulesLoading } =
    useGetEntityGamificationModules();
  const { data: templatesData, loading: templatesLoading } =
    useGetImpactTemplates();
  const { data: ruleData, loading: ruleLoading } = useGetImpactRuleById(id);

  const [updateRule, { loading: isUpdating }] = useMutation(
    UPDATE_IMPACT_RULE,
    {
      refetchQueries: ["GetImpactRules", "GetImpactRuleById"],
    },
  );

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const integrations =
    moduleData?.getEntityGamificationModules?.integrations || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
  const moduleTriggers =
    moduleData?.getEntityGamificationModules?.moduleTriggers || [];
  const integrationTriggers =
    moduleData?.getEntityGamificationModules?.integrationTriggers || [];
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

  const isLoading = ruleLoading || modulesLoading || templatesLoading;

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
        {isLoading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !rule ? (
          <div className="min-h-[400px] w-full flex flex-col items-center justify-center space-y-4">
            <h2 className="text-xl font-bold">Rule Not Found</h2>
            <Button
              onClick={() => router.push("/gamification/impact-score/rules")}
            >
              Back to Rules
            </Button>
          </div>
        ) : (
          <ImpactRuleForm
            showHeader={false}
            initialValues={rule}
            onSubmit={handleUpdate}
            loading={isUpdating}
            isEdit={true}
            modules={modules}
            integrations={integrations}
            triggers={triggers}
            moduleTriggers={moduleTriggers}
            integrationTriggers={integrationTriggers}
            templates={templates}
          />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
