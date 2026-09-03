"use client";

import React, { useMemo, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GamificationModuleType,
  GET_POINTS_AUTOMATION_RULE,
  GET_POINTS_AUTOMATION_RULES,
  UPDATE_POINTS_AUTOMATION_RULE,
  GET_BADGES_AUTOMATION_RULE,
  GET_BADGES_AUTOMATION_RULES,
  UPDATE_BADGES_AUTOMATION_RULE,
  GET_RANKS_AUTOMATION_RULE,
  GET_RANKS_AUTOMATION_RULES,
  UPDATE_RANKS_AUTOMATION_RULE,
  GET_LEADERBOARD_AUTOMATION_RULE,
  GET_LEADERBOARD_AUTOMATION_RULES,
  UPDATE_LEADERBOARD_AUTOMATION_RULE,
  UnifiedGamificationRule,
} from "@/graphql/gamification-automation";
import { GamificationAutomationForm } from "@/components/gamification/automation/gamification-automation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { Zap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EditGamificationAutomationRuleContent = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const ruleId = params.id as string;

  const rawModule = searchParams.get("module")?.toUpperCase();
  const module: GamificationModuleType =
    rawModule === "BADGES" ||
    rawModule === "RANKS" ||
    rawModule === "LEADERBOARD"
      ? rawModule
      : "POINTS";

  // Query individual rule based on module
  const { data: pointsData, loading: loadingPoints } = useQuery(
    GET_POINTS_AUTOMATION_RULE,
    {
      variables: { id: ruleId },
      skip: !ruleId || module !== "POINTS",
      fetchPolicy: "network-only",
    }
  );

  const { data: badgesData, loading: loadingBadges } = useQuery(
    GET_BADGES_AUTOMATION_RULE,
    {
      variables: { id: ruleId },
      skip: !ruleId || module !== "BADGES",
      fetchPolicy: "network-only",
    }
  );

  const { data: ranksData, loading: loadingRanks } = useQuery(
    GET_RANKS_AUTOMATION_RULE,
    {
      variables: { id: ruleId },
      skip: !ruleId || module !== "RANKS",
      fetchPolicy: "network-only",
    }
  );

  const { data: leaderboardData, loading: loadingLeaderboard } = useQuery(
    GET_LEADERBOARD_AUTOMATION_RULE,
    {
      variables: { id: ruleId },
      skip: !ruleId || module !== "LEADERBOARD",
      fetchPolicy: "network-only",
    }
  );

  // Update mutations
  const [updatePoints, { loading: updatingPoints }] = useMutation(
    UPDATE_POINTS_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_POINTS_AUTOMATION_RULES }],
    }
  );

  const [updateBadges, { loading: updatingBadges }] = useMutation(
    UPDATE_BADGES_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_BADGES_AUTOMATION_RULES }],
    }
  );

  const [updateRanks, { loading: updatingRanks }] = useMutation(
    UPDATE_RANKS_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_RANKS_AUTOMATION_RULES }],
    }
  );

  const [updateLeaderboard, { loading: updatingLeaderboard }] = useMutation(
    UPDATE_LEADERBOARD_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_LEADERBOARD_AUTOMATION_RULES }],
    }
  );

  const fetchingRule =
    loadingPoints || loadingBadges || loadingRanks || loadingLeaderboard;
  const updating =
    updatingPoints || updatingBadges || updatingRanks || updatingLeaderboard;

  const unifiedRule: UnifiedGamificationRule | null = useMemo(() => {
    if (module === "POINTS" && pointsData?.getPointsAutomationRule) {
      const r = pointsData.getPointsAutomationRule;
      return {
        ...r,
        module: "POINTS",
        targetId: r.pointRuleId,
        targetName: r.pointRuleName,
      };
    }
    if (module === "BADGES" && badgesData?.getBadgesAutomationRule) {
      const r = badgesData.getBadgesAutomationRule;
      return {
        ...r,
        module: "BADGES",
        targetId: r.badgeId,
        targetName: r.badgeName,
      };
    }
    if (module === "RANKS" && ranksData?.getRanksAutomationRule) {
      const r = ranksData.getRanksAutomationRule;
      return {
        ...r,
        module: "RANKS",
        targetId: r.rankId,
        targetName: r.rankName,
      };
    }
    if (
      module === "LEADERBOARD" &&
      leaderboardData?.getLeaderboardAutomationRule
    ) {
      const r = leaderboardData.getLeaderboardAutomationRule;
      return {
        ...r,
        module: "LEADERBOARD",
        targetId: null,
        targetName: "Global Leaderboard",
      };
    }
    return null;
  }, [module, pointsData, badgesData, ranksData, leaderboardData]);

  const handleSave = async (payload: {
    module: GamificationModuleType;
    input: any;
  }) => {
    try {
      if (payload.module === "POINTS") {
        await updatePoints({
          variables: { id: ruleId, input: payload.input },
        });
      } else if (payload.module === "BADGES") {
        await updateBadges({
          variables: { id: ruleId, input: payload.input },
        });
      } else if (payload.module === "RANKS") {
        await updateRanks({
          variables: { id: ruleId, input: payload.input },
        });
      } else if (payload.module === "LEADERBOARD") {
        await updateLeaderboard({
          variables: { id: ruleId, input: payload.input },
        });
      }

      toast.success("Automation rule updated successfully!");
      router.push(
        `/gamification/points-and-badges/automation?module=${payload.module.toLowerCase()}`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update automation rule.");
    }
  };

  const handleCancel = () => {
    router.push(
      `/gamification/points-and-badges/automation?module=${module.toLowerCase()}`
    );
  };

  if (fetchingRule) {
    return (
      <EcosystemWrapper className="gap-6">
        <EcosystemHeader
          title="Edit Gamification Automation"
          badgeText="Loading"
          description="Fetching rule configuration…"
          icon={Zap}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification/points-and-badges" },
            {
              label: "Automation",
              href: "/gamification/points-and-badges/automation",
            },
            { label: "Edit Rule" },
          ]}
        />
        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
          <div className="max-w-[1040px] mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper className="gap-6">
      <EcosystemHeader
        title={`Edit Rule: ${unifiedRule?.name || "Automation Rule"}`}
        badgeText={`${module} Engine`}
        description="Modify event triggers, criteria conditions, and automated reward actions."
        icon={Zap}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          {
            label: "Automation",
            href: "/gamification/points-and-badges/automation",
          },
          { label: unifiedRule?.name || "Edit Rule" },
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
          initialValues={unifiedRule}
          defaultModule={module}
          loading={updating}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={true}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

const EditGamificationAutomationRulePage = () => {
  return (
    <Suspense fallback={null}>
      <EditGamificationAutomationRuleContent />
    </Suspense>
  );
};

export default withModulePermission(
  EditGamificationAutomationRulePage,
  "POINTS_BADGES",
  "canEdit"
);
