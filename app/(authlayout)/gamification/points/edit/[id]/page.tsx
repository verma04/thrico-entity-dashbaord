"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Zap, ChevronRight, Loader2 } from "lucide-react";
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

export default function EditPointRulePage() {
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
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];

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
        badgeText="Gamification Studio"
        description="Update the economic parameters and frequency caps for this scoring rule."
        icon={Zap}
      />

      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Gamification</span>
          <ChevronRight className="h-3 w-3" />
          <span>Points</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Edit Rule</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <PointRuleForm
        initialValues={rule}
        onSubmit={handleUpdate}
        loading={isUpdating}
        isEdit={true}
        modules={modules}
        triggers={triggers}
      />
    </EcosystemWrapper>
  );
}
