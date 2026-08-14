"use client";

import React from "react";
import { Zap, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreatePointRule } from "@/graphql/actions/gamification/gamification-mutation";
import { useGetEntityGamificationModules } from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PointRuleForm } from "@/components/gamification/points-manager/point-rule-form";
import { useModuleStore } from "@/store/useModuleStore";

export default function CreatePointRulePage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const router = useRouter();
  const { data: moduleData } = useGetEntityGamificationModules();
  const [createPointRule, { loading: isCreating }] = useCreatePointRule();

  const handleCreate = async (values: any) => {
    await createPointRule({
      variables: {
        input: {
          source: values.source,
          module: values.module,
          action: values.action,
          trigger: values.trigger,
          points: Number(values.points),
          dailyCap: values.dailyCap ? Number(values.dailyCap) : null,
          weeklyCap: values.weeklyCap ? Number(values.weeklyCap) : null,
          monthlyCap: values.monthlyCap ? Number(values.monthlyCap) : null,
          description: values.description,
        },
      },
    });
  };

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const integrations =
    moduleData?.getEntityGamificationModules?.integrations || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
  const moduleTriggers =
    moduleData?.getEntityGamificationModules?.moduleTriggers || [];
  const integrationTriggers =
    moduleData?.getEntityGamificationModules?.integrationTriggers || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Point Engine"
        badgeText={`${gamificationModuleName} Studio`}
        description="Define new rules for how members earn points across your community."
        icon={Zap}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Points", href: "/gamification/points-and-badges" },
          { label: "Add Rule" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PointRuleForm
          onSubmit={handleCreate}
          loading={isCreating}
          modules={modules}
          integrations={integrations}
          triggers={triggers}
          moduleTriggers={moduleTriggers}
          integrationTriggers={integrationTriggers}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
