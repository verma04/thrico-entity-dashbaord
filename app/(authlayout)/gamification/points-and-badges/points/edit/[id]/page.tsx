"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetPointRules,
  useGetEntityGamificationModules,
} from "@/graphql/actions/gamification/gamification-quiries";
import { useUpdatePointRule } from "@/graphql/actions/gamification/gamification-mutation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PointRuleForm } from "@/components/gamification/points-manager/point-rule-form";
import { useModuleStore } from "@/store/useModuleStore";

export default function EditPointRulePage() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const params = useParams();
  const router = useRouter();
  const ruleId = params?.id as string;

  const { data, loading: fetchLoading } = useGetPointRules();
  const { data: moduleData } = useGetEntityGamificationModules();
  const [updatePointRule, { loading: isUpdating }] = useUpdatePointRule();

  const rule = useMemo(() => {
    return data?.getPointRules?.find((r) => r.id === ruleId);
  }, [data, ruleId]);

  const handleUpdate = async (values: any) => {
    await updatePointRule({
      variables: {
        id: ruleId,
        input: {
          points: Number(values.points),
          dailyCap: values.dailyCap ? Number(values.dailyCap) : null,
          weeklyCap: values.weeklyCap ? Number(values.weeklyCap) : null,
          monthlyCap: values.monthlyCap ? Number(values.monthlyCap) : null,
          description: values.description,
          isActive: values.isActive,
        },
      },
    });
  };

  const modules = moduleData?.getEntityGamificationModules?.modules || [];
  const integrations = moduleData?.getEntityGamificationModules?.integrations || [];
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];
  const moduleTriggers = moduleData?.getEntityGamificationModules?.moduleTriggers || [];
  const integrationTriggers = moduleData?.getEntityGamificationModules?.integrationTriggers || [];

  if (fetchLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Rule Not Found</h2>
        <Button onClick={() => router.push("/gamification/points")}>
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Edit Point Rule"
        badgeText={`${gamificationModuleName} Studio`}
        description="Update the economic parameters and frequency caps for this scoring rule."
        icon={Zap}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Points", href: "/gamification/points-and-badges" },
          { label: "Edit Rule" },
        ]}
      />
      <EcosystemContainer className="p-0 bg-transparent border-none shadow-none ring-0">
        <PointRuleForm
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
