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

export default function CreatePointRulePage() {
  const router = useRouter();
  const { data: moduleData } = useGetEntityGamificationModules();
  const [createPointRule, { loading: isCreating }] = useCreatePointRule();

  const handleCreate = async (values: any) => {
    await createPointRule({
      variables: {
        input: {
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
  const triggers = moduleData?.getEntityGamificationModules?.triggers || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Point Engine"
        badgeText="Gamification Studio"
        description="Define new rules for how members earn points across your community."
        icon={Zap}
      />

      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Gamification</span>
          <ChevronRight className="h-3 w-3" />
          <span>Points</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Create Rule</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <PointRuleForm
        onSubmit={handleCreate}
        loading={isCreating}
        modules={modules}
        triggers={triggers}
      />
    </EcosystemWrapper>
  );
}
