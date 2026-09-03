"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetPointRuleById,
  useGetEntityGamificationModules,
} from "@/graphql/actions/gamification/gamification-quiries";
import { useUpdatePointRule } from "@/graphql/actions/gamification/gamification-mutation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PointRuleForm } from "@/components/gamification/points-manager/point-rule-form";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { useModuleStore } from "@/store/useModuleStore";

export default function EditPointRulePage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const params = useParams();
  const router = useRouter();
  const ruleId = params?.id as string;

  const { data, loading: fetchLoading } = useGetPointRuleById({
    variables: { id: ruleId },
    skip: !ruleId,
  });
  const { data: moduleData } = useGetEntityGamificationModules();
  const [updatePointRule, { loading: isUpdating }] = useUpdatePointRule();

  const rule = data?.getPointRuleById;

  const handleUpdate = async (values: any) => {
    const tierIds = Array.isArray(values.membershipTierId)
      ? values.membershipTierId
      : values.membershipTierId
        ? [values.membershipTierId]
        : values.eligibleTierIds || [];

    const res = await updatePointRule({
      variables: {
        id: ruleId,
        input: {
          points: Number(values.points),
          dailyCap: values.dailyCap ? Number(values.dailyCap) : null,
          weeklyCap: values.weeklyCap ? Number(values.weeklyCap) : null,
          monthlyCap: values.monthlyCap ? Number(values.monthlyCap) : null,
          description: values.description,
          isActive: values.isActive,
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

  if (fetchLoading) {
    return (
      <EcosystemWrapper className="animate-in fade-in duration-500">
        <EcosystemHeader
          title="Edit Point Rule"
          badgeText={`${gamificationModuleName || "Gamification"} Studio`}
          description="Update the economic parameters and frequency caps for this scoring rule."
          icon={Zap}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Points", href: "/gamification/points-and-badges" },
            { label: "Edit Rule" },
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

  if (!rule) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center space-y-4 bg-[#f6f6f7] dark:bg-zinc-950 p-6 text-center">
        <h2 className="text-xl font-bold text-[#303030] dark:text-zinc-100">Rule Not Found</h2>
        <p className="text-sm text-[#616161] dark:text-zinc-400">
          The requested point rule could not be located or may have been deleted.
        </p>
        <Button onClick={() => router.push("/gamification/points-and-badges/points")}>
          Back to Point Rules
        </Button>
      </div>
    );
  }

  return (
    <EcosystemWrapper className="animate-in fade-in duration-500">
      <EcosystemHeader
        title="Edit Point Rule"
        badgeText={`${gamificationModuleName || "Gamification"} Studio`}
        description="Update the economic parameters and frequency caps for this scoring rule."
        icon={Zap}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Points", href: "/gamification/points-and-badges" },
          { label: "Edit Rule" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-3">
        <PointRuleForm
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
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
