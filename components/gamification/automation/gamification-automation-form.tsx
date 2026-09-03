"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  GamificationModuleType,
  AnyGamificationTrigger,
  AnyGamificationActionType,
  GamificationActionInputPayload,
  GamificationRuleConditionInput,
  UnifiedGamificationRule,
  getPointRuleDisplay,
} from "@/graphql/gamification-automation";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  Plus,
  Trash2,
  Sparkles,
  Coins,
  Medal,
  Crown,
  Trophy,
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import { GET_EMAIL_TEMPLATES } from "@/graphql/quries/email";
import { GET_COMMUNITIES } from "@/graphql/quries/group/approval";
import {
  useGetPointRules,
  useGetBadges,
  useGetRanks,
} from "@/graphql/actions/gamification/gamification-quiries";
import { GamificationFlowBuilder } from "./flow/gamification-flow-builder";

interface GamificationAutomationFormProps {
  initialValues?: UnifiedGamificationRule | null;
  defaultModule?: GamificationModuleType;
  onSave: (payload: {
    module: GamificationModuleType;
    input: any;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export const GamificationAutomationForm: React.FC<
  GamificationAutomationFormProps
> = ({
  initialValues,
  defaultModule = "POINTS",
  onSave,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  // 1. Module selection
  const [module, setModule] = useState<GamificationModuleType>(
    initialValues?.module || defaultModule
  );
  const [viewMode, setViewMode] = useState<"flow" | "form">("flow");

  // 2. Rule Info
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [isActive, setIsActive] = useState(
    initialValues ? initialValues.isActive : true
  );
  const [priority, setPriority] = useState<number>(
    initialValues?.priority ?? 1
  );

  // 3. Scoped Target Entity (pointRuleId, badgeId, rankId)
  const [targetId, setTargetId] = useState<string>(
    initialValues?.targetId || ""
  );

  // 4. Trigger
  const defaultTriggerMap: Record<GamificationModuleType, AnyGamificationTrigger> = {
    POINTS: "POINTS_EARNED",
    BADGES: "BADGE_EARNED",
    RANKS: "RANK_PROMOTED",
    LEADERBOARD: "LEADERBOARD_TOP_POSITION",
    CURRENCY: "EC_EARNED",
  };

  const [trigger, setTrigger] = useState<AnyGamificationTrigger>(
    initialValues?.trigger || defaultTriggerMap[module]
  );

  // 5. Conditions
  const [conditionOperator, setConditionOperator] = useState<"AND" | "OR">(
    (initialValues?.conditionOperator as "AND" | "OR") || "AND"
  );
  const [conditions, setConditions] = useState<GamificationRuleConditionInput[]>(
    initialValues?.conditions
      ? initialValues.conditions.map((c) => ({
          field: c.field,
          operator: c.operator,
          value: c.value,
        }))
      : []
  );

  // 6. Actions
  const [actions, setActions] = useState<GamificationActionInputPayload[]>(
    initialValues?.actions && initialValues.actions.length > 0
      ? initialValues.actions.map((a) => ({
          type: a.type,
          tier: a.tier?.tierId ? { tierId: a.tier.tierId } : undefined,
          tierId: a.tier?.tierId || a.tierId || undefined,
          email: a.email
            ? {
                templateId: a.email.templateId || undefined,
                subject: a.email.subject || undefined,
                body: a.email.body || undefined,
              }
            : undefined,
          emailSubject: a.email?.subject || a.emailSubject || undefined,
          emailBody: a.email?.body || a.emailBody || undefined,
          templateId: a.email?.templateId || a.templateId || undefined,
          notification: a.notification
            ? {
                message: a.notification.message || undefined,
                pushTitle: a.notification.pushTitle || undefined,
                pushBody: a.notification.pushBody || undefined,
                push: a.notification.push ?? true,
              }
            : undefined,
          push: a.notification?.push ?? a.push ?? true,
          pushTitle: a.notification?.pushTitle || a.pushTitle || undefined,
          pushBody: a.notification?.pushBody || a.pushBody || undefined,
          notificationMessage:
            a.notification?.message || a.notificationMessage || undefined,
          community: a.community?.communityId
            ? { communityId: a.community.communityId }
            : undefined,
          communityId: a.community?.communityId || a.communityId || undefined,
          tag: a.tag?.tags ? { tags: [...a.tag.tags] } : undefined,
          tags: a.tag?.tags ? [...a.tag.tags] : a.tags ? [...a.tags] : undefined,
          points: a.points?.points ? { points: a.points.points } : undefined,
          badge: a.badge?.badgeId ? { badgeId: a.badge.badgeId } : undefined,
          badgeId: a.badge?.badgeId || a.badgeId || undefined,
        }))
      : [
          {
            type: "ASSIGN_MEMBERSHIP_TIER",
            tier: { tierId: "" },
          },
        ]
  );

  // External queries for select inputs
  const { data: tiersData } = useQuery(GET_MEMBERSHIP_TIERS);
  const tiers: any[] = tiersData?.getMembershipTiers || [];

  const { data: emailsData } = useQuery(GET_EMAIL_TEMPLATES);
  const emailTemplates: any[] = emailsData?.getEmailTemplates || [];

  const { data: communitiesData } = useQuery(GET_COMMUNITIES, {
    variables: { input: {} },
  });
  const communities: any[] =
    communitiesData?.getCommunities?.data ||
    communitiesData?.getAllCommunities ||
    [];

  const { data: pointRulesData } = useGetPointRules();
  const pointRules: any[] = pointRulesData?.getPointRules || [];

  const { data: badgesData } = useGetBadges();
  const badgesList: any[] = badgesData?.getBadges || [];

  const { data: ranksData } = useGetRanks();
  const ranksList: any[] = ranksData?.getRanks || [];

  // When module changes, update trigger and default actions if needed
  const handleModuleChange = (newModule: GamificationModuleType) => {
    setModule(newModule);
    setTrigger(defaultTriggerMap[newModule]);
    setTargetId("");
  };

  // Supported Triggers based on Module
  const availableTriggers = useMemo(() => {
    switch (module) {
      case "POINTS":
        return [
          { value: "POINTS_EARNED", label: "Points Earned" },
          { value: "POINTS_THRESHOLD_REACHED", label: "Points Threshold Reached" },
          { value: "DAILY_CAP_REACHED", label: "Daily Cap Hit" },
          { value: "WEEKLY_CAP_REACHED", label: "Weekly Cap Hit" },
          { value: "MONTHLY_CAP_REACHED", label: "Monthly Cap Hit" },
        ];
      case "BADGES":
        return [
          { value: "BADGE_EARNED", label: "Badge Earned" },
          { value: "BADGE_PROGRESS_UPDATED", label: "Badge Progress Updated" },
          { value: "ALL_BADGES_COMPLETED", label: "All Badges Completed" },
        ];
      case "RANKS":
        return [
          { value: "RANK_ACHIEVED", label: "Rank Achieved" },
          { value: "RANK_PROMOTED", label: "Rank Promoted" },
          { value: "RANK_DEMOTED", label: "Rank Demoted" },
        ];
      case "LEADERBOARD":
        return [
          { value: "LEADERBOARD_TOP_POSITION", label: "Top Position Achieved" },
          {
            value: "LEADERBOARD_POSITION_CHANGED",
            label: "Leaderboard Position Changed",
          },
          { value: "LEADERBOARD_ENTERED", label: "Entered Leaderboard" },
        ];
      case "CURRENCY":
        return [
          { value: "EC_EARNED", label: "EC Earned / Credited" },
          { value: "TC_COINS_EARNED", label: "TC Coins Earned" },
          {
            value: "CURRENCY_THRESHOLD_REACHED",
            label: "Threshold Balance Reached",
          },
          { value: "CURRENCY_CONVERTED", label: "Currency Converted" },
          { value: "REDEMPTION_COMPLETED", label: "Redemption Completed" },
          {
            value: "DAILY_CONVERSION_CAP_REACHED",
            label: "Daily Conversion Cap Hit",
          },
        ];
    }
  }, [module]);

  // Supported Action Types based on Module
  const availableActionTypes = useMemo(() => {
    const common = [
      {
        value: "ASSIGN_MEMBERSHIP_TIER" as AnyGamificationActionType,
        label: "Assign Membership Tier",
        icon: Award,
      },
      {
        value: "NOTIFICATION" as AnyGamificationActionType,
        label: "Push Notification",
        icon: Bell,
      },
      {
        value: "EMAIL" as AnyGamificationActionType,
        label: "Send Email",
        icon: Mail,
      },
      {
        value: "COMMUNITY_JOIN" as AnyGamificationActionType,
        label: "Grant Circle / Community Access",
        icon: Users,
      },
      {
        value: "ADD_MEMBER_TAG" as AnyGamificationActionType,
        label: "Add Member Tags",
        icon: Tag,
      },
    ];

    if (module === "POINTS") {
      return [
        ...common,
        {
          value: "AWARD_BADGE" as AnyGamificationActionType,
          label: "Award Milestone Badge",
          icon: Medal,
        },
      ];
    }

    if (module === "BADGES") {
      return [
        ...common,
        {
          value: "AWARD_POINTS" as AnyGamificationActionType,
          label: "Award Bonus Points",
          icon: Coins,
        },
      ];
    }

    if (module === "CURRENCY") {
      return [
        ...common,
        {
          value: "AWARD_POINTS" as AnyGamificationActionType,
          label: "Award Bonus Points",
          icon: Coins,
        },
        {
          value: "AWARD_BADGE" as AnyGamificationActionType,
          label: "Award Milestone Badge",
          icon: Medal,
        },
        {
          value: "AWARD_CURRENCY" as AnyGamificationActionType,
          label: "Award Currency (EC/TC)",
          icon: Coins,
        },
      ];
    }

    // RANKS & LEADERBOARD support both Award Points and Award Badge
    return [
      ...common,
      {
        value: "AWARD_POINTS" as AnyGamificationActionType,
        label: "Award Bonus Points",
        icon: Coins,
      },
      {
        value: "AWARD_BADGE" as AnyGamificationActionType,
        label: "Award Milestone Badge",
        icon: Medal,
      },
    ];
  }, [module]);

  // Conditions helpers
  const handleAddCondition = () => {
    const defaultField =
      module === "POINTS"
        ? "totalPoints"
        : module === "LEADERBOARD"
        ? "position"
        : "points";
    setConditions((prev) => [
      ...prev,
      {
        field: defaultField,
        operator: ">=",
        value: 100,
      },
    ]);
  };

  const handleUpdateCondition = (
    index: number,
    updates: Partial<GamificationRuleConditionInput>
  ) => {
    setConditions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...updates } : c))
    );
  };

  const handleRemoveCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  // Actions helpers
  const handleAddAction = () => {
    const defaultType = availableActionTypes[0]?.value || "NOTIFICATION";
    setActions((prev) => [...prev, { type: defaultType }]);
  };

  const handleUpdateAction = (
    index: number,
    updates: Partial<GamificationActionInputPayload>
  ) => {
    setActions((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...updates } : a))
    );
  };

  const handleRemoveAction = (index: number) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please provide a name for this automation rule.");
      return;
    }

    if (actions.length === 0) {
      toast.error("Please add at least one automated action.");
      return;
    }

    // Format action payloads properly for backend inputs
    const formattedActions = actions.map((a) => {
      const payload: GamificationActionInputPayload = {
        type: a.type,
      };

      if (a.type === "ASSIGN_MEMBERSHIP_TIER") {
        const tId = a.tier?.tierId || a.tierId || "";
        payload.tier = { tierId: tId };
        payload.tierId = tId;
      } else if (a.type === "EMAIL") {
        payload.email = {
          templateId: a.email?.templateId || a.templateId || undefined,
          subject: a.email?.subject || a.emailSubject || "",
          body: a.email?.body || a.emailBody || "",
        };
        payload.templateId = a.email?.templateId || a.templateId || undefined;
        payload.emailSubject = a.email?.subject || a.emailSubject || undefined;
        payload.emailBody = a.email?.body || a.emailBody || undefined;
      } else if (a.type === "NOTIFICATION") {
        payload.notification = {
          message:
            a.notification?.message || a.notificationMessage || "Congratulations!",
          pushTitle: a.notification?.pushTitle || a.pushTitle || "Gamification Alert",
          pushBody: a.notification?.pushBody || a.pushBody || "",
          push: a.notification?.push ?? a.push ?? true,
        };
        payload.push = a.notification?.push ?? a.push ?? true;
        payload.pushTitle = a.notification?.pushTitle || a.pushTitle || undefined;
        payload.pushBody = a.notification?.pushBody || a.pushBody || undefined;
        payload.notificationMessage =
          a.notification?.message || a.notificationMessage || undefined;
      } else if (a.type === "COMMUNITY_JOIN") {
        const cId = a.community?.communityId || a.communityId || "";
        payload.community = { communityId: cId };
        payload.communityId = cId;
      } else if (a.type === "ADD_MEMBER_TAG") {
        const tagList = a.tag?.tags || a.tags || [];
        payload.tag = { tags: tagList };
        payload.tags = tagList;
      } else if (a.type === "AWARD_POINTS") {
        const pts = Number(a.points?.points || 100);
        payload.points = { points: pts };
      } else if (a.type === "AWARD_BADGE") {
        const bId = a.badge?.badgeId || a.badgeId || "";
        payload.badge = { badgeId: bId };
        payload.badgeId = bId;
      } else if (a.type === "AWARD_CURRENCY") {
        const amt = Number(a.currency?.amount || a.currencyAmount || 50);
        const cType = (a.currency?.currencyType || a.currencyType || "TC") as
          | "EC"
          | "TC";
        payload.currency = { amount: amt, currencyType: cType };
        payload.currencyAmount = amt;
        payload.currencyType = cType;
      }

      return payload;
    });

    const baseInput: any = {
      name: name.trim(),
      description: description.trim() || undefined,
      trigger,
      conditionOperator,
      conditions: conditions.map((c) => ({
        field: c.field,
        operator: c.operator,
        value: isNaN(Number(c.value)) ? c.value : Number(c.value),
      })),
      actions: formattedActions,
      isActive,
      priority,
    };

    if (module === "POINTS" && targetId) {
      baseInput.pointRuleId = targetId;
    } else if (module === "BADGES" && targetId) {
      baseInput.badgeId = targetId;
    } else if (module === "RANKS" && targetId) {
      baseInput.rankId = targetId;
    }

    try {
      await onSave({
        module,
        input: baseInput,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to save rule.");
    }
  };

  if (viewMode === "flow") {
    return (
      <GamificationFlowBuilder
        name={name}
        description={description}
        module={module}
        targetId={targetId}
        targetName={
          module === "POINTS"
            ? getPointRuleDisplay(pointRules.find((pr: any) => pr.id === targetId))
            : module === "BADGES"
            ? badgesList.find((b: any) => b.id === targetId)?.name
            : module === "RANKS"
            ? ranksList.find((r: any) => r.id === targetId)?.name
            : undefined
        }
        trigger={trigger}
        conditionOperator={conditionOperator}
        conditions={conditions}
        actions={actions}
        isActive={isActive}
        priority={priority}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onModuleChange={handleModuleChange}
        onTargetIdChange={(id) => setTargetId(id || "")}
        onTriggerChange={setTrigger}
        onConditionOperatorChange={setConditionOperator}
        onConditionsChange={setConditions}
        onActionsChange={setActions}
        onIsActiveChange={setIsActive}
        onSave={handleSubmit}
        onReset={onCancel}
        loading={loading}
        isEdit={isEdit}
        onViewModeChange={setViewMode}
      />
    );
  }

  return (
    <PolarisFormLayout>
      {/* Main Column */}
      <div className="space-y-6">
        {/* View Mode Switcher Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isEdit
                  ? "Edit Gamification Automation Rule"
                  : "Create Gamification Automation Rule"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Configure triggers, criteria conditions, and multi-action reward flows.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setViewMode("flow")}
            className="text-xs gap-1.5 font-bold border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Switch to Visual Canvas
          </Button>
        </div>
        {/* Step 1: Module & Target Scope */}
        <PolarisFormCard
          step={1}
          title="Automation Scope & Module"
          description="Select which gamification engine triggers this automation and scope to a specific target rule or badge."
          icon={Layers}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <PolarisLabel required>Gamification Engine</PolarisLabel>
              <Select
                value={module}
                onValueChange={(val) =>
                  handleModuleChange(val as GamificationModuleType)
                }
                disabled={isEdit}
              >
                <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-semibold">
                  <SelectValue placeholder="Select Engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POINTS" className="text-xs font-medium py-1.5">
                    <span className="flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      Points Automation
                    </span>
                  </SelectItem>
                  <SelectItem value="BADGES" className="text-xs font-medium py-1.5">
                    <span className="flex items-center gap-2">
                      <Medal className="w-3.5 h-3.5 text-emerald-500" />
                      Badges Automation
                    </span>
                  </SelectItem>
                  <SelectItem value="RANKS" className="text-xs font-medium py-1.5">
                    <span className="flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-purple-500" />
                      Ranks Automation
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="LEADERBOARD"
                    className="text-xs font-medium py-1.5"
                  >
                    <span className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-blue-500" />
                      Leaderboard Automation
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="CURRENCY"
                    className="text-xs font-medium py-1.5"
                  >
                    <span className="flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-yellow-500" />
                      Currency Automation
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Scoped Entity */}
            {module === "POINTS" && (
              <div className="space-y-1.5">
                <PolarisLabel>Scope to Points Rule (Optional)</PolarisLabel>
                <Select
                  value={targetId || "ALL"}
                  onValueChange={(val) => setTargetId(val === "ALL" ? "" : val)}
                >
                  <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-medium">
                    <SelectValue placeholder="Global (All Points Rules)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs font-medium">
                      🌐 All Points Rules (Global)
                    </SelectItem>
                    {pointRules.map((pr: any) => (
                      <SelectItem
                        key={pr.id}
                        value={pr.id}
                        className="text-xs font-medium"
                      >
                        🎯 {getPointRuleDisplay(pr)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {module === "BADGES" && (
              <div className="space-y-1.5">
                <PolarisLabel>Scope to Badge (Optional)</PolarisLabel>
                <Select
                  value={targetId || "ALL"}
                  onValueChange={(val) => setTargetId(val === "ALL" ? "" : val)}
                >
                  <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-medium">
                    <SelectValue placeholder="Global (All Badges)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs font-medium">
                      🌐 All Badges (Global)
                    </SelectItem>
                    {badgesList.map((b: any) => (
                      <SelectItem
                        key={b.id}
                        value={b.id}
                        className="text-xs font-medium"
                      >
                        🏅 {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {module === "RANKS" && (
              <div className="space-y-1.5">
                <PolarisLabel>Scope to Rank (Optional)</PolarisLabel>
                <Select
                  value={targetId || "ALL"}
                  onValueChange={(val) => setTargetId(val === "ALL" ? "" : val)}
                >
                  <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-medium">
                    <SelectValue placeholder="Global (All Ranks)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs font-medium">
                      🌐 All Ranks (Global)
                    </SelectItem>
                    {ranksList.map((r: any) => (
                      <SelectItem
                        key={r.id}
                        value={r.id}
                        className="text-xs font-medium"
                      >
                        👑 {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {module === "LEADERBOARD" && (
              <div className="space-y-1.5">
                <PolarisLabel>Scope</PolarisLabel>
                <div className="h-9 rounded-lg border border-border bg-muted/40 px-3 flex items-center text-xs text-muted-foreground font-medium">
                  🏆 Global Entity Leaderboard
                </div>
              </div>
            )}
          </div>
        </PolarisFormCard>

        {/* Step 2: Rule Details & Trigger */}
        <PolarisFormCard
          step={2}
          title="Rule Identity & Event Trigger"
          description="Define the administrative name, description, and the triggering event that initiates this flow."
          icon={Zap}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <PolarisLabel required>Rule Name</PolarisLabel>
                <PolarisInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Reward on 1000 Points Threshold"
                />
              </div>

              <div className="space-y-1.5">
                <PolarisLabel required>Trigger Event</PolarisLabel>
                <Select
                  value={trigger}
                  onValueChange={(val) =>
                    setTrigger(val as AnyGamificationTrigger)
                  }
                >
                  <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-semibold">
                    <SelectValue placeholder="Select Trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTriggers.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="text-xs font-medium py-1.5"
                      >
                        ⚡ {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <PolarisLabel>Description (Optional)</PolarisLabel>
              <PolarisInput
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what this automation does for members…"
              />
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 3: Conditions / Criteria */}
        <PolarisFormCard
          step={3}
          title="Condition Criteria (Optional)"
          description="Set conditional gates so this automation fires only when matching specific rules (e.g. totalPoints >= 1000, position <= 3)."
          icon={Sliders}
        >
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-semibold text-foreground">
              Evaluation Criteria ({conditions.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCondition}
              className="h-7 text-xs gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Criterion
            </Button>
          </div>
          <div className="space-y-3">
            {conditions.length > 0 && (
              <div className="flex items-center gap-2 pb-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Match
                </span>
                <Select
                  value={conditionOperator}
                  onValueChange={(val: "AND" | "OR") =>
                    setConditionOperator(val)
                  }
                >
                  <SelectTrigger className="h-7 w-24 text-xs font-bold bg-muted/60 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND" className="text-xs font-bold">
                      AND (All)
                    </SelectItem>
                    <SelectItem value="OR" className="text-xs font-bold">
                      OR (Any)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground font-medium">
                  of the following criteria:
                </span>
              </div>
            )}

            {conditions.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border text-center space-y-2 bg-muted/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                <p className="text-xs text-muted-foreground">
                  No criteria added. This rule will unconditionally fire every
                  time the trigger occurs.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCondition}
                  className="h-7 text-xs gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add Condition Filter
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {conditions.map((cond, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card shadow-2xs"
                  >
                    <div className="flex-1">
                      <PolarisInput
                        value={cond.field}
                        onChange={(e) =>
                          handleUpdateCondition(idx, { field: e.target.value })
                        }
                        placeholder="field name (e.g. totalPoints, position)"
                        className="h-8 text-xs font-mono"
                      />
                    </div>

                    <div className="w-28">
                      <Select
                        value={cond.operator}
                        onValueChange={(val) =>
                          handleUpdateCondition(idx, { operator: val })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs font-bold bg-muted/40 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">=" className="font-mono text-xs">
                            &gt;= (Greater / Equal)
                          </SelectItem>
                          <SelectItem value="<=" className="font-mono text-xs">
                            &lt;= (Less / Equal)
                          </SelectItem>
                          <SelectItem value="==" className="font-mono text-xs">
                            == (Equals)
                          </SelectItem>
                          <SelectItem value="!=" className="font-mono text-xs">
                            != (Not Equal)
                          </SelectItem>
                          <SelectItem value=">" className="font-mono text-xs">
                            &gt; (Greater)
                          </SelectItem>
                          <SelectItem value="<" className="font-mono text-xs">
                            &lt; (Less)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-32">
                      <PolarisInput
                        value={cond.value ?? ""}
                        onChange={(e) =>
                          handleUpdateCondition(idx, { value: e.target.value })
                        }
                        placeholder="value (e.g. 1000)"
                        className="h-8 text-xs font-mono"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCondition(idx)}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PolarisFormCard>

        {/* Step 4: Multi-Action Pipeline */}
        <PolarisFormCard
          step={4}
          title="Automated Action Pipeline"
          description="Configure the sequential actions executed when the trigger and conditions match."
          icon={Sparkles}
        >
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-semibold text-foreground">
              Configured Actions ({actions.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAction}
              className="h-7 text-xs gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Action
            </Button>
          </div>
          <div className="space-y-4">
            {actions.map((act, actIdx) => {
              const ActionTypeMeta = availableActionTypes.find(
                (at) => at.value === act.type
              );
              const ActionIcon = ActionTypeMeta?.icon || Zap;

              return (
                <div
                  key={actIdx}
                  className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-3 relative"
                >
                  {/* Action Item Header */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Action #{actIdx + 1}
                      </span>
                      <Select
                        value={act.type}
                        onValueChange={(val) =>
                          handleUpdateAction(actIdx, {
                            type: val as AnyGamificationActionType,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 rounded-lg border-border bg-muted/30 text-xs font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableActionTypes.map((at) => {
                            const Icon = at.icon;
                            return (
                              <SelectItem
                                key={at.value}
                                value={at.value}
                                className="text-xs font-medium py-1.5"
                              >
                                <span className="flex items-center gap-2">
                                  <Icon className="w-3.5 h-3.5 text-primary" />
                                  {at.label}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={actions.length <= 1}
                      onClick={() => handleRemoveAction(actIdx)}
                      className="h-7 w-7 text-muted-foreground hover:text-rose-600 cursor-pointer disabled:opacity-20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Action Specific Subform */}
                  <div className="space-y-3 pt-1">
                    {/* ASSIGN_MEMBERSHIP_TIER */}
                    {act.type === "ASSIGN_MEMBERSHIP_TIER" && (
                      <div className="space-y-1.5">
                        <PolarisLabel required>Target Membership Tier</PolarisLabel>
                        <Select
                          value={act.tier?.tierId || act.tierId || ""}
                          onValueChange={(val) =>
                            handleUpdateAction(actIdx, {
                              tier: { tierId: val },
                              tierId: val,
                            })
                          }
                        >
                          <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-medium">
                            <SelectValue placeholder="Select Membership Tier" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiers.map((t: any) => (
                              <SelectItem
                                key={t.id}
                                value={t.id}
                                className="text-xs font-medium"
                              >
                                👑 {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* EMAIL */}
                    {act.type === "EMAIL" && (
                      <div className="space-y-3">
                        {emailTemplates.length > 0 && (
                          <div className="space-y-1.5">
                            <PolarisLabel>Template Preset (Optional)</PolarisLabel>
                            <Select
                              value={
                                act.email?.templateId || act.templateId || "CUSTOM"
                              }
                              onValueChange={(val) => {
                                const tmpl = emailTemplates.find(
                                  (t) => t.id === val
                                );
                                handleUpdateAction(actIdx, {
                                  email: {
                                    templateId: val === "CUSTOM" ? undefined : val,
                                    subject: tmpl ? tmpl.subject : act.email?.subject,
                                    body: tmpl ? tmpl.body : act.email?.body,
                                  },
                                  templateId: val === "CUSTOM" ? undefined : val,
                                });
                              }}
                            >
                              <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-medium">
                                <SelectValue placeholder="Custom Email" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="CUSTOM"
                                  className="text-xs font-medium"
                                >
                                  ✉️ Custom Email Message
                                </SelectItem>
                                {emailTemplates.map((tmpl: any) => (
                                  <SelectItem
                                    key={tmpl.id}
                                    value={tmpl.id}
                                    className="text-xs font-medium"
                                  >
                                    📄 {tmpl.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <PolarisLabel required>Subject Line</PolarisLabel>
                          <PolarisInput
                            value={act.email?.subject || act.emailSubject || ""}
                            onChange={(e) =>
                              handleUpdateAction(actIdx, {
                                email: {
                                  ...act.email,
                                  subject: e.target.value,
                                },
                                emailSubject: e.target.value,
                              })
                            }
                            placeholder="e.g. Congratulations on reaching Gold Tier!"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <PolarisLabel required>Email Body</PolarisLabel>
                          <textarea
                            value={act.email?.body || act.emailBody || ""}
                            onChange={(e) =>
                              handleUpdateAction(actIdx, {
                                email: {
                                  ...act.email,
                                  body: e.target.value,
                                },
                                emailBody: e.target.value,
                              })
                            }
                            placeholder="Write your email content here…"
                            rows={3}
                            className="w-full rounded-lg border border-border bg-card p-2 text-xs font-normal text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    )}

                    {/* NOTIFICATION */}
                    {act.type === "NOTIFICATION" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <PolarisLabel required>Push Title</PolarisLabel>
                            <PolarisInput
                              value={
                                act.notification?.pushTitle ||
                                act.pushTitle ||
                                ""
                              }
                              onChange={(e) =>
                                handleUpdateAction(actIdx, {
                                  notification: {
                                    ...act.notification,
                                    pushTitle: e.target.value,
                                  },
                                  pushTitle: e.target.value,
                                })
                              }
                              placeholder="e.g. Tier Upgraded! 🌟"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <PolarisLabel>Push Subtext / Body</PolarisLabel>
                            <PolarisInput
                              value={
                                act.notification?.pushBody || act.pushBody || ""
                              }
                              onChange={(e) =>
                                handleUpdateAction(actIdx, {
                                  notification: {
                                    ...act.notification,
                                    pushBody: e.target.value,
                                  },
                                  pushBody: e.target.value,
                                })
                              }
                              placeholder="e.g. You are now a Gold Member."
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <PolarisLabel required>
                            In-App Notification Message
                          </PolarisLabel>
                          <PolarisInput
                            value={
                              act.notification?.message ||
                              act.notificationMessage ||
                              ""
                            }
                            onChange={(e) =>
                              handleUpdateAction(actIdx, {
                                notification: {
                                  ...act.notification,
                                  message: e.target.value,
                                },
                                notificationMessage: e.target.value,
                              })
                            }
                            placeholder="e.g. Congratulations on reaching 1000 points!"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <Switch
                            checked={
                              act.notification?.push ?? act.push ?? true
                            }
                            onCheckedChange={(checked) =>
                              handleUpdateAction(actIdx, {
                                notification: {
                                  ...act.notification,
                                  push: checked,
                                },
                                push: checked,
                              })
                            }
                          />
                          <span className="text-xs text-muted-foreground font-medium">
                            Send instant device push alert
                          </span>
                        </div>
                      </div>
                    )}

                    {/* COMMUNITY_JOIN */}
                    {act.type === "COMMUNITY_JOIN" && (
                      <div className="space-y-1.5">
                        <PolarisLabel required>Target Circle / Community</PolarisLabel>
                        <Select
                          value={
                            act.community?.communityId || act.communityId || ""
                          }
                          onValueChange={(val) =>
                            handleUpdateAction(actIdx, {
                              community: { communityId: val },
                              communityId: val,
                            })
                          }
                        >
                          <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-medium">
                            <SelectValue placeholder="Select Community" />
                          </SelectTrigger>
                          <SelectContent>
                            {communities.map((c: any) => (
                              <SelectItem
                                key={c.id}
                                value={c.id}
                                className="text-xs font-medium"
                              >
                                👥 {c.title || c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* ADD_MEMBER_TAG */}
                    {act.type === "ADD_MEMBER_TAG" && (
                      <div className="space-y-1.5">
                        <PolarisLabel required>
                          Tags to Assign (Comma-separated)
                        </PolarisLabel>
                        <PolarisInput
                          value={
                            (act.tag?.tags || act.tags || []).join(", ")
                          }
                          onChange={(e) => {
                            const parsed = e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean);
                            handleUpdateAction(actIdx, {
                              tag: { tags: parsed },
                              tags: parsed,
                            });
                          }}
                          placeholder="e.g. top-earner, gold-member, elite"
                        />
                      </div>
                    )}

                    {/* AWARD_POINTS */}
                    {act.type === "AWARD_POINTS" && (
                      <div className="space-y-1.5">
                        <PolarisLabel required>Bonus Points Amount</PolarisLabel>
                        <PolarisInput
                          type="number"
                          value={act.points?.points ?? 100}
                          onChange={(e) =>
                            handleUpdateAction(actIdx, {
                              points: { points: Number(e.target.value) },
                            })
                          }
                          placeholder="e.g. 250"
                          className="font-mono"
                        />
                      </div>
                    )}

                    {/* AWARD_BADGE */}
                    {act.type === "AWARD_BADGE" && (
                      <div className="space-y-1.5">
                        <PolarisLabel required>Select Badge to Award</PolarisLabel>
                        <Select
                          value={act.badge?.badgeId || act.badgeId || ""}
                          onValueChange={(val) =>
                            handleUpdateAction(actIdx, {
                              badge: { badgeId: val },
                              badgeId: val,
                            })
                          }
                        >
                          <SelectTrigger className="h-9 rounded-lg border-border bg-card text-xs font-medium">
                            <SelectValue placeholder="Select Badge" />
                          </SelectTrigger>
                          <SelectContent>
                            {badgesList.map((b: any) => (
                              <SelectItem
                                key={b.id}
                                value={b.id}
                                className="text-xs font-medium"
                              >
                                🏅 {b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* AWARD_CURRENCY */}
                    {act.type === "AWARD_CURRENCY" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <PolarisLabel required>Destination Wallet</PolarisLabel>
                            <Select
                              value={
                                act.currency?.currencyType ||
                                act.currencyType ||
                                "TC"
                              }
                              onValueChange={(val: "EC" | "TC") =>
                                handleUpdateAction(actIdx, {
                                  currency: {
                                    amount:
                                      act.currency?.amount ||
                                      act.currencyAmount ||
                                      50,
                                    currencyType: val,
                                  },
                                  currencyType: val,
                                })
                              }
                            >
                              <SelectTrigger className="h-9 rounded-lg border-border text-xs font-semibold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TC" className="text-xs font-medium">
                                  🪙 TC Coins (Global Wallet)
                                </SelectItem>
                                <SelectItem value="EC" className="text-xs font-medium">
                                  💵 Entity Currency (Entity Wallet)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5">
                            <PolarisLabel required>Credit Amount</PolarisLabel>
                            <PolarisInput
                              type="number"
                              value={
                                act.currency?.amount ??
                                act.currencyAmount ??
                                50
                              }
                              onChange={(e) =>
                                handleUpdateAction(actIdx, {
                                  currency: {
                                    amount: Number(e.target.value),
                                    currencyType:
                                      (act.currency?.currencyType ||
                                        act.currencyType ||
                                        "TC") as "EC" | "TC",
                                  },
                                  currencyAmount: Number(e.target.value),
                                })
                              }
                              placeholder="e.g. 50"
                              className="font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </PolarisFormCard>
      </div>

      {/* Sidebar Column */}
      <div className="space-y-6">
        {/* Status Card */}
        <PolarisSidebarCard title="Rule Status & Priority">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">
                Active Status
              </span>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isActive ? "text-emerald-600" : "text-muted-foreground"
                  )}
                >
                  {isActive ? "Active" : "Paused"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <PolarisLabel>Execution Priority</PolarisLabel>
              <PolarisInput
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Lower numbers execute first when multiple rules trigger
                simultaneously.
              </p>
            </div>
          </div>
        </PolarisSidebarCard>

        {/* Summary Card */}
        <PolarisSidebarCard title="Configuration Summary">
          <div className="space-y-2 text-xs">
            <PolarisSummaryRow label="Engine" value={module} />
            <PolarisSummaryRow label="Trigger" value={trigger} />
            <PolarisSummaryRow
              label="Criteria"
              value={
                conditions.length === 0
                  ? "Universal"
                  : `${conditions.length} rule${
                      conditions.length > 1 ? "s" : ""
                    } (${conditionOperator})`
              }
            />
            <PolarisSummaryRow
              label="Action Steps"
              value={`${actions.length} action${actions.length > 1 ? "s" : ""}`}
            />
          </div>
        </PolarisSidebarCard>

        {/* Best Practice Tip */}
        <PolarisTipCard title="Gamification Best Practice">
          Pairing status tier upgrades with immediate push celebrations and
          exclusive circle joins boosts user retention by over 3.4x compared to
          silent point allocations.
        </PolarisTipCard>
      </div>

      {/* Floating Save Panel */}
      <FloatingSavePanel
        hasChanged={true}
        saved={false}
        isSaving={loading}
        onSave={handleSubmit}
        onReset={onCancel}
        saveButtonText={isEdit ? "Update Automation Rule" : "Create Automation Rule"}
        discardButtonText="Cancel"
      />
    </PolarisFormLayout>
  );
};
