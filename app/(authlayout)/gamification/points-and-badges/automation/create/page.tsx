"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  GamificationModuleType,
  CREATE_POINTS_AUTOMATION_RULE,
  GET_POINTS_AUTOMATION_RULES,
  CREATE_BADGES_AUTOMATION_RULE,
  GET_BADGES_AUTOMATION_RULES,
  CREATE_RANKS_AUTOMATION_RULE,
  GET_RANKS_AUTOMATION_RULES,
  CREATE_LEADERBOARD_AUTOMATION_RULE,
  GET_LEADERBOARD_AUTOMATION_RULES,
  UnifiedGamificationRule,
} from "@/graphql/gamification-automation";
import { GamificationAutomationForm } from "@/components/gamification/automation/gamification-automation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { Zap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CreateGamificationAutomationRuleContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawModule = searchParams.get("module")?.toUpperCase();
  const defaultModule: GamificationModuleType =
    rawModule === "BADGES" ||
    rawModule === "RANKS" ||
    rawModule === "LEADERBOARD"
      ? rawModule
      : "POINTS";

  const [initialDraft, setInitialDraft] =
    useState<UnifiedGamificationRule | null>(null);

  // Load blueprint draft from session storage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("gamification_automation_draft");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setInitialDraft({
            id: "draft",
            name: parsed.title || "New Automation Rule",
            description: parsed.description || "",
            module: parsed.module || defaultModule,
            trigger: parsed.trigger,
            conditions: parsed.conditions || [],
            actions: parsed.actions || [],
            isActive: true,
            priority: 1,
          });
          sessionStorage.removeItem("gamification_automation_draft");
        } catch (e) {
          console.error("Failed to parse blueprint draft", e);
        }
      }
    }
  }, [defaultModule]);

  // Mutations
  const [createPoints, { loading: creatingPoints }] = useMutation(
    CREATE_POINTS_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_POINTS_AUTOMATION_RULES }],
    }
  );

  const [createBadges, { loading: creatingBadges }] = useMutation(
    CREATE_BADGES_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_BADGES_AUTOMATION_RULES }],
    }
  );

  const [createRanks, { loading: creatingRanks }] = useMutation(
    CREATE_RANKS_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_RANKS_AUTOMATION_RULES }],
    }
  );

  const [createLeaderboard, { loading: creatingLeaderboard }] = useMutation(
    CREATE_LEADERBOARD_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_LEADERBOARD_AUTOMATION_RULES }],
    }
  );

  const loading =
    creatingPoints || creatingBadges || creatingRanks || creatingLeaderboard;

  const handleSave = async (payload: {
    module: GamificationModuleType;
    input: any;
  }) => {
    try {
      if (payload.module === "POINTS") {
        await createPoints({ variables: { input: payload.input } });
      } else if (payload.module === "BADGES") {
        await createBadges({ variables: { input: payload.input } });
      } else if (payload.module === "RANKS") {
        await createRanks({ variables: { input: payload.input } });
      } else if (payload.module === "LEADERBOARD") {
        await createLeaderboard({ variables: { input: payload.input } });
      }

      toast.success("Automation rule created successfully!");
      router.push(
        `/gamification/points-and-badges/automation?module=${payload.module.toLowerCase()}`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to create automation rule.");
    }
  };

  const handleCancel = () => {
    router.push("/gamification/points-and-badges/automation");
  };

  return (
    <EcosystemWrapper className="gap-6">
      <EcosystemHeader
        title="Create Gamification Automation"
        badgeText="New Rule"
        description="Set up automatic tier upgrades, email notifications, community joins, badge grants, or points awards on gamification triggers."
        icon={Zap}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          {
            label: "Automation",
            href: "/gamification/points-and-badges/automation",
          },
          { label: "Create Rule" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="h-8 gap-1.5 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Rules
          </Button>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <GamificationAutomationForm
          initialValues={initialDraft}
          defaultModule={defaultModule}
          loading={loading}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={false}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

const CreateGamificationAutomationRulePage = () => {
  return (
    <Suspense fallback={null}>
      <CreateGamificationAutomationRuleContent />
    </Suspense>
  );
};

export default withModulePermission(
  CreateGamificationAutomationRulePage,
  "POINTS_BADGES",
  "canCreate"
);
