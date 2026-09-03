"use client";

import React from "react";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreatePointRule } from "@/graphql/actions/gamification/gamification-mutation";
import { useGetEntityGamificationModules } from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PointRuleForm } from "@/components/gamification/points-manager/point-rule-form";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { useModuleStore } from "@/store/useModuleStore";

export default function CreatePointRulePage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const router = useRouter();
  const { data: moduleData, loading: modulesLoading } =
    useGetEntityGamificationModules();
  const [createPointRule, { loading: isCreating }] = useCreatePointRule();

  const handleCreate = async (values: any) => {
    const tierIds = Array.isArray(values.membershipTierId)
      ? values.membershipTierId
      : values.membershipTierId
        ? [values.membershipTierId]
        : values.eligibleTierIds || [];

    const res = await createPointRule({
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
          memberEligibility: values.memberEligibility || "ALL",
          membershipTierId: tierIds,
          eligibleTierIds: tierIds,
          eligibleUserIds: values.eligibleUserIds || [],
        },
      },
    });

    if (res?.errors && res.errors.length > 0) {
      throw new Error(res.errors[0].message);
    }
  };

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const integrations =
    moduleData?.getEntityGamificationModules?.integrations || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
  const moduleTriggers =
    moduleData?.getEntityGamificationModules?.moduleTriggers || [];
  const integrationTriggers =
    moduleData?.getEntityGamificationModules?.integrationTriggers || [];

  if (modulesLoading) {
    return (
      <EcosystemWrapper className="animate-in fade-in duration-500">
        <EcosystemHeader
          title="Point Engine"
          badgeText={`${gamificationModuleName || "Gamification"} Studio`}
          description="Define new rules for how members earn points across your community."
          icon={Zap}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Points", href: "/gamification/points-and-badges" },
            { label: "Add Rule" },
          ]}
        />
        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-3">
          <PolarisFormSkeleton
            showHeader={false}
            mainCards={[
              { fieldRows: 2, fullWidthRows: 1 },
              { fieldRows: 1, fullWidthRows: 0 },
              { fieldRows: 0, fullWidthRows: 3 },
              { fieldRows: 0, fullWidthRows: 2 },
            ]}
            sidebarSummaryRows={6}
            showSidebarInfo={true}
            showSidebarTip={true}
          />
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper className="animate-in fade-in duration-500">
      <EcosystemHeader
        title="Point Engine"
        badgeText={`${gamificationModuleName || "Gamification"} Studio`}
        description="Define new rules for how members earn points across your community."
        icon={Zap}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Points", href: "/gamification/points-and-badges" },
          { label: "Add Rule" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-3">
        <PointRuleForm
          showHeader={false}
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
