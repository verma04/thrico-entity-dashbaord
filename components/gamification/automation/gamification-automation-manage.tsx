"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GamificationModuleType,
  UnifiedGamificationRule,
  PointsAutomationRule,
  BadgesAutomationRule,
  RanksAutomationRule,
  LeaderboardAutomationRule,
  GET_POINTS_AUTOMATION_RULES,
  TOGGLE_POINTS_AUTOMATION_RULE,
  DELETE_POINTS_AUTOMATION_RULE,
  REORDER_POINTS_AUTOMATION_RULES,
  CREATE_POINTS_AUTOMATION_RULE,
  GET_BADGES_AUTOMATION_RULES,
  TOGGLE_BADGES_AUTOMATION_RULE,
  DELETE_BADGES_AUTOMATION_RULE,
  REORDER_BADGES_AUTOMATION_RULES,
  CREATE_BADGES_AUTOMATION_RULE,
  GET_RANKS_AUTOMATION_RULES,
  TOGGLE_RANKS_AUTOMATION_RULE,
  DELETE_RANKS_AUTOMATION_RULE,
  REORDER_RANKS_AUTOMATION_RULES,
  CREATE_RANKS_AUTOMATION_RULE,
  GET_LEADERBOARD_AUTOMATION_RULES,
  TOGGLE_LEADERBOARD_AUTOMATION_RULE,
  DELETE_LEADERBOARD_AUTOMATION_RULE,
  REORDER_LEADERBOARD_AUTOMATION_RULES,
  CREATE_LEADERBOARD_AUTOMATION_RULE,
  getPointRuleDisplay,
} from "@/graphql/gamification-automation";
import {
  useGetPointRules,
  useGetBadges,
  useGetRanks,
} from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import {
  GamificationAutomationTable,
  gamificationAutomationTableColumns,
} from "./gamification-automation-table";
import { GamificationAutomationGrid } from "./gamification-automation-grid";
import { GAMIFICATION_BLUEPRINTS, GamificationBlueprintRecipe } from "./blueprints";
import {
  Zap,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Coins,
  Medal,
  Crown,
  Trophy,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const GamificationAutomationManage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state management
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const search = searchParams.get("q") || "";
  const activeModuleTab =
    (searchParams.get("module") as GamificationModuleType | "ALL") || "ALL";
  const triggerFilter = searchParams.get("trigger") || "ALL";
  const actionFilter = searchParams.get("action") || "ALL";
  const statusFilter = searchParams.get("status") || "ALL";
  const targetFilter = searchParams.get("target") || "ALL";
  const view = (searchParams.get("view") as "grid" | "list") || "list";

  const setSearch = (q: string) => updateParams({ q: q || null });
  const setActiveModuleTab = (m: GamificationModuleType | "ALL") => {
    updateParams({ module: m === "ALL" ? null : m, trigger: null, target: null });
  };
  const setTriggerFilter = (t: string) => updateParams({ trigger: t });
  const setActionFilter = (a: string) => updateParams({ action: a });
  const setStatusFilter = (s: string) => updateParams({ status: s });
  const setTargetFilter = (tg: string) => updateParams({ target: tg });
  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "list" ? null : v });

  // Column visibility for table view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    priority: true,
    rule: true,
    module: true,
    trigger: true,
    conditions: true,
    actions: true,
    status: true,
    updatedAt: true,
    actionsMenu: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Queries across all 4 gamification modules
  const {
    data: pointsData,
    loading: pointsLoading,
    refetch: refetchPoints,
  } = useQuery(GET_POINTS_AUTOMATION_RULES, {
    fetchPolicy: "cache-and-network",
  });

  const {
    data: badgesData,
    loading: badgesLoading,
    refetch: refetchBadges,
  } = useQuery(GET_BADGES_AUTOMATION_RULES, {
    fetchPolicy: "cache-and-network",
  });

  const {
    data: ranksData,
    loading: ranksLoading,
    refetch: refetchRanks,
  } = useQuery(GET_RANKS_AUTOMATION_RULES, {
    fetchPolicy: "cache-and-network",
  });

  const {
    data: leaderboardData,
    loading: leaderboardLoading,
    refetch: refetchLeaderboard,
  } = useQuery(GET_LEADERBOARD_AUTOMATION_RULES, {
    fetchPolicy: "cache-and-network",
  });

  // Target item lookup lists
  const { data: pointRulesData } = useGetPointRules();
  const pointRules: any[] = pointRulesData?.getPointRules || [];

  const { data: badgesListData } = useGetBadges();
  const badgesList: any[] = badgesListData?.getBadges || [];

  const { data: ranksListData } = useGetRanks();
  const ranksList: any[] = ranksListData?.getRanks || [];

  // Mutations
  const [togglePoints] = useMutation(TOGGLE_POINTS_AUTOMATION_RULE);
  const [deletePoints] = useMutation(DELETE_POINTS_AUTOMATION_RULE);
  const [reorderPoints] = useMutation(REORDER_POINTS_AUTOMATION_RULES);
  const [createPoints] = useMutation(CREATE_POINTS_AUTOMATION_RULE);

  const [toggleBadges] = useMutation(TOGGLE_BADGES_AUTOMATION_RULE);
  const [deleteBadges] = useMutation(DELETE_BADGES_AUTOMATION_RULE);
  const [reorderBadges] = useMutation(REORDER_BADGES_AUTOMATION_RULES);
  const [createBadges] = useMutation(CREATE_BADGES_AUTOMATION_RULE);

  const [toggleRanks] = useMutation(TOGGLE_RANKS_AUTOMATION_RULE);
  const [deleteRanks] = useMutation(DELETE_RANKS_AUTOMATION_RULE);
  const [reorderRanks] = useMutation(REORDER_RANKS_AUTOMATION_RULES);
  const [createRanks] = useMutation(CREATE_RANKS_AUTOMATION_RULE);

  const [toggleLeaderboard] = useMutation(TOGGLE_LEADERBOARD_AUTOMATION_RULE);
  const [deleteLeaderboard] = useMutation(DELETE_LEADERBOARD_AUTOMATION_RULE);
  const [reorderLeaderboard] = useMutation(REORDER_LEADERBOARD_AUTOMATION_RULES);
  const [createLeaderboard] = useMutation(CREATE_LEADERBOARD_AUTOMATION_RULE);

  const [ruleToDelete, setRuleToDelete] = useState<UnifiedGamificationRule | null>(
    null
  );
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Refetch all modules
  const refetchAll = () => {
    refetchPoints();
    refetchBadges();
    refetchRanks();
    refetchLeaderboard();
  };

  const loading =
    pointsLoading || badgesLoading || ranksLoading || leaderboardLoading;

  // Unify all rules into a single indexed collection
  const allRules: UnifiedGamificationRule[] = useMemo(() => {
    const rawPoints: PointsAutomationRule[] =
      pointsData?.getPointsAutomationRules || [];
    const rawBadges: BadgesAutomationRule[] =
      badgesData?.getBadgesAutomationRules || [];
    const rawRanks: RanksAutomationRule[] =
      ranksData?.getRanksAutomationRules || [];
    const rawLeaderboard: LeaderboardAutomationRule[] =
      leaderboardData?.getLeaderboardAutomationRules || [];

    const unified: UnifiedGamificationRule[] = [
      ...rawPoints.map((r) => ({
        ...r,
        module: "POINTS" as GamificationModuleType,
        targetId: r.pointRuleId,
        targetName:
          r.pointRuleName ||
          getPointRuleDisplay(
            pointRules.find((pr: any) => pr.id === r.pointRuleId)
          ),
      })),
      ...rawBadges.map((r) => ({
        ...r,
        module: "BADGES" as GamificationModuleType,
        targetId: r.badgeId,
        targetName: r.badgeName,
      })),
      ...rawRanks.map((r) => ({
        ...r,
        module: "RANKS" as GamificationModuleType,
        targetId: r.rankId,
        targetName: r.rankName,
      })),
      ...rawLeaderboard.map((r) => ({
        ...r,
        module: "LEADERBOARD" as GamificationModuleType,
        targetId: null,
        targetName: "Global Leaderboard",
      })),
    ];

    return unified.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  }, [pointsData, badgesData, ranksData, leaderboardData]);

  // Counts per module
  const moduleCounts = useMemo(() => {
    return {
      ALL: allRules.length,
      POINTS: allRules.filter((r) => r.module === "POINTS").length,
      BADGES: allRules.filter((r) => r.module === "BADGES").length,
      RANKS: allRules.filter((r) => r.module === "RANKS").length,
      LEADERBOARD: allRules.filter((r) => r.module === "LEADERBOARD").length,
    };
  }, [allRules]);

  const activeCount = allRules.filter((r) => r.isActive).length;
  const pausedCount = allRules.filter((r) => !r.isActive).length;

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return allRules.filter((rule) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rule.name.toLowerCase().includes(q) ||
        rule.description?.toLowerCase().includes(q) ||
        rule.targetName?.toLowerCase().includes(q) ||
        rule.trigger.toLowerCase().includes(q) ||
        rule.conditions?.some(
          (c) =>
            c.field.toLowerCase().includes(q) ||
            String(c.value).toLowerCase().includes(q)
        );

      const matchesModule =
        activeModuleTab === "ALL" || rule.module === activeModuleTab;

      const matchesTrigger =
        triggerFilter === "ALL" || rule.trigger === triggerFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && rule.isActive) ||
        (statusFilter === "PAUSED" && !rule.isActive);

      const matchesAction =
        actionFilter === "ALL" ||
        rule.actions.some((a) => a.type === actionFilter);

      const matchesTarget =
        targetFilter === "ALL" || rule.targetId === targetFilter;

      return (
        matchesSearch &&
        matchesModule &&
        matchesTrigger &&
        matchesStatus &&
        matchesAction &&
        matchesTarget
      );
    });
  }, [
    allRules,
    search,
    activeModuleTab,
    triggerFilter,
    statusFilter,
    actionFilter,
    targetFilter,
  ]);

  // Handlers
  const handleToggle = async (
    rule: UnifiedGamificationRule,
    isActive: boolean
  ) => {
    try {
      setTogglingId(rule.id);
      if (rule.module === "POINTS") {
        await togglePoints({ variables: { id: rule.id, isActive } });
      } else if (rule.module === "BADGES") {
        await toggleBadges({ variables: { id: rule.id, isActive } });
      } else if (rule.module === "RANKS") {
        await toggleRanks({ variables: { id: rule.id, isActive } });
      } else if (rule.module === "LEADERBOARD") {
        await toggleLeaderboard({ variables: { id: rule.id, isActive } });
      }
      toast.success(
        isActive ? `${rule.name} activated.` : `${rule.name} paused.`
      );
      refetchAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle rule.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!ruleToDelete) return;
    try {
      if (ruleToDelete.module === "POINTS") {
        await deletePoints({ variables: { id: ruleToDelete.id } });
      } else if (ruleToDelete.module === "BADGES") {
        await deleteBadges({ variables: { id: ruleToDelete.id } });
      } else if (ruleToDelete.module === "RANKS") {
        await deleteRanks({ variables: { id: ruleToDelete.id } });
      } else if (ruleToDelete.module === "LEADERBOARD") {
        await deleteLeaderboard({ variables: { id: ruleToDelete.id } });
      }
      toast.success("Automation rule deleted successfully.");
      setRuleToDelete(null);
      refetchAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete rule.");
    }
  };

  const handleMove = async (index: number, direction: "UP" | "DOWN") => {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredRules.length) return;

    const sourceRule = filteredRules[index];
    const targetRule = filteredRules[targetIndex];

    // Check if both rules belong to same module for reordering
    if (sourceRule.module !== targetRule.module) {
      toast.info(
        "Reordering priorities applies within the same gamification module."
      );
      return;
    }

    const moduleRules = allRules.filter((r) => r.module === sourceRule.module);
    const mIdx = moduleRules.findIndex((r) => r.id === sourceRule.id);
    const targetMIdx = direction === "UP" ? mIdx - 1 : mIdx + 1;
    if (targetMIdx < 0 || targetMIdx >= moduleRules.length) return;

    const newModuleRules = [...moduleRules];
    const [moved] = newModuleRules.splice(mIdx, 1);
    newModuleRules.splice(targetMIdx, 0, moved);

    const ruleIds = newModuleRules.map((r) => r.id);

    try {
      if (sourceRule.module === "POINTS") {
        await reorderPoints({ variables: { ruleIds } });
      } else if (sourceRule.module === "BADGES") {
        await reorderBadges({ variables: { ruleIds } });
      } else if (sourceRule.module === "RANKS") {
        await reorderRanks({ variables: { ruleIds } });
      } else if (sourceRule.module === "LEADERBOARD") {
        await reorderLeaderboard({ variables: { ruleIds } });
      }
      toast.success("Rule priority updated.");
      refetchAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder rules.");
    }
  };

  const handleDuplicate = async (rule: UnifiedGamificationRule) => {
    try {
      const copyPayload = {
        name: `${rule.name} (Copy)`,
        description: rule.description,
        trigger: rule.trigger as any,
        conditionOperator: rule.conditionOperator,
        conditions: rule.conditions?.map((c) => ({
          field: c.field,
          operator: c.operator,
          value: c.value,
        })),
        actions: rule.actions?.map((a) => ({
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
          notification: a.notification
            ? {
                message: a.notification.message || undefined,
                pushTitle: a.notification.pushTitle || undefined,
                pushBody: a.notification.pushBody || undefined,
                push: a.notification.push ?? true,
              }
            : undefined,
          community: a.community?.communityId
            ? { communityId: a.community.communityId }
            : undefined,
          tag: a.tag?.tags ? { tags: a.tag.tags } : undefined,
          points: a.points?.points ? { points: a.points.points } : undefined,
          badge: a.badge?.badgeId ? { badgeId: a.badge.badgeId } : undefined,
        })),
        isActive: false,
        priority: 99,
      };

      if (rule.module === "POINTS") {
        await createPoints({
          variables: {
            input: {
              ...copyPayload,
              pointRuleId: rule.targetId || undefined,
            },
          },
        });
      } else if (rule.module === "BADGES") {
        await createBadges({
          variables: {
            input: {
              ...copyPayload,
              badgeId: rule.targetId || undefined,
            },
          },
        });
      } else if (rule.module === "RANKS") {
        await createRanks({
          variables: {
            input: {
              ...copyPayload,
              rankId: rule.targetId || undefined,
            },
          },
        });
      } else if (rule.module === "LEADERBOARD") {
        await createLeaderboard({
          variables: { input: copyPayload },
        });
      }
      toast.success("Rule duplicated as draft.");
      refetchAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to duplicate rule.");
    }
  };

  const handleCreate = (selectedMod?: GamificationModuleType) => {
    const mod =
      selectedMod ||
      (activeModuleTab === "ALL" ? "POINTS" : activeModuleTab);
    router.push(
      `/gamification/points-and-badges/automation/create?module=${mod.toLowerCase()}`
    );
  };

  const handleEdit = (rule: UnifiedGamificationRule) => {
    router.push(
      `/gamification/points-and-badges/automation/edit/${
        rule.id
      }?module=${rule.module.toLowerCase()}`
    );
  };

  const handleApplyBlueprint = (blueprint: GamificationBlueprintRecipe) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "gamification_automation_draft",
        JSON.stringify(blueprint)
      );
    }
    handleCreate(blueprint.module);
  };

  return (
    <EcosystemWrapper className="gap-6">
      {/* Ecosystem Header */}
      <EcosystemHeader
        title="Gamification Automation"
        badgeText="Rule Engine"
        description={
          loading
            ? "Loading gamification rules…"
            : `${allRules.length} automated rule${
                allRules.length === 1 ? "" : "s"
              } configured across Points, Badges, Ranks & Leaderboard (${activeCount} active, ${pausedCount} paused).`
        }
        icon={Zap}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: "Automation" },
        ]}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 rounded-lg gap-1.5 text-xs font-semibold shadow-xs">
                <Plus className="h-3.5 w-3.5" />
                Create Rule
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">
                Select Engine Module
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleCreate("POINTS")}
                className="text-xs font-medium cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 mr-2 text-amber-500" />
                Points Automation
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCreate("BADGES")}
                className="text-xs font-medium cursor-pointer"
              >
                <Medal className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                Badges Automation
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCreate("RANKS")}
                className="text-xs font-medium cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 mr-2 text-purple-500" />
                Ranks Automation
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCreate("LEADERBOARD")}
                className="text-xs font-medium cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 mr-2 text-blue-500" />
                Leaderboard Automation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {/* Blueprints / Presets Banner (compact accelerator) */}
      {allRules.length === 0 && !loading && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Automation Blueprints
              </h3>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Click any blueprint to pre-fill and launch a rule
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {GAMIFICATION_BLUEPRINTS.map((bp) => {
              const Icon = bp.icon;
              return (
                <div
                  key={bp.id}
                  onClick={() => handleApplyBlueprint(bp)}
                  className="p-3 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-primary/50 transition-all flex flex-col justify-between space-y-2 shadow-2xs group cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0">
                          <Icon className="w-3 h-3" />
                        </div>
                        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {bp.title}
                        </h4>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 py-0 shrink-0 font-medium"
                      >
                        {bp.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                      {bp.description}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase">
                      {bp.module}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:underline">
                      <Plus className="w-3 h-3" />
                      Apply
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Module Segmented Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveModuleTab("ALL")}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
            activeModuleTab === "ALL"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>All Rules</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted">
            {moduleCounts.ALL}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("POINTS")}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
            activeModuleTab === "POINTS"
              ? "bg-card text-amber-600 dark:text-amber-400 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Points</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted">
            {moduleCounts.POINTS}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("BADGES")}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
            activeModuleTab === "BADGES"
              ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Medal className="w-3.5 h-3.5" />
          <span>Badges</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted">
            {moduleCounts.BADGES}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("RANKS")}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
            activeModuleTab === "RANKS"
              ? "bg-card text-purple-600 dark:text-purple-400 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Ranks</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted">
            {moduleCounts.RANKS}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModuleTab("LEADERBOARD")}
          className={cn(
            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
            activeModuleTab === "LEADERBOARD"
              ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Leaderboard</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted">
            {moduleCounts.LEADERBOARD}
          </span>
        </button>
      </div>

      {/* Action / Filter Bar */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by rule name, trigger, criteria…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          {/* Target Scoped Filter */}
          {activeModuleTab === "POINTS" && (
            <EcosystemActionBar.Item>
              <Select value={targetFilter} onValueChange={setTargetFilter}>
                <SelectTrigger className="w-[150px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Point Rules" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                    🌐 All Points Rules
                  </SelectItem>
                  {pointRules.map((pr: any) => (
                    <SelectItem
                      key={pr.id}
                      value={pr.id}
                      className="text-xs font-medium py-1 px-2"
                    >
                      🎯 {getPointRuleDisplay(pr)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          )}

          {activeModuleTab === "BADGES" && (
            <EcosystemActionBar.Item>
              <Select value={targetFilter} onValueChange={setTargetFilter}>
                <SelectTrigger className="w-[150px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Badges" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                    🌐 All Badges
                  </SelectItem>
                  {badgesList.map((b: any) => (
                    <SelectItem
                      key={b.id}
                      value={b.id}
                      className="text-xs font-medium py-1 px-2"
                    >
                      🏅 {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          )}

          {activeModuleTab === "RANKS" && (
            <EcosystemActionBar.Item>
              <Select value={targetFilter} onValueChange={setTargetFilter}>
                <SelectTrigger className="w-[150px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Ranks" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                    🌐 All Ranks
                  </SelectItem>
                  {ranksList.map((r: any) => (
                    <SelectItem
                      key={r.id}
                      value={r.id}
                      className="text-xs font-medium py-1 px-2"
                    >
                      👑 {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          )}

          {/* Action Filter */}
          <EcosystemActionBar.Item>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                  All Actions
                </SelectItem>
                <SelectItem
                  value="ASSIGN_MEMBERSHIP_TIER"
                  className="text-xs font-medium py-1 px-2"
                >
                  👑 Tier Upgrade
                </SelectItem>
                <SelectItem value="NOTIFICATION" className="text-xs font-medium py-1 px-2">
                  🔔 Push Alert
                </SelectItem>
                <SelectItem value="EMAIL" className="text-xs font-medium py-1 px-2">
                  ✉️ Email Dispatch
                </SelectItem>
                <SelectItem
                  value="COMMUNITY_JOIN"
                  className="text-xs font-medium py-1 px-2"
                >
                  👥 Circle Access
                </SelectItem>
                <SelectItem
                  value="ADD_MEMBER_TAG"
                  className="text-xs font-medium py-1 px-2"
                >
                  🏷️ Member Tags
                </SelectItem>
                <SelectItem
                  value="AWARD_POINTS"
                  className="text-xs font-medium py-1 px-2"
                >
                  🪙 Award Points
                </SelectItem>
                <SelectItem
                  value="AWARD_BADGE"
                  className="text-xs font-medium py-1 px-2"
                >
                  🏅 Award Badge
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Status Filter */}
          <EcosystemActionBar.Item>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[130px]">
                <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                  All Status
                </SelectItem>
                <SelectItem value="ACTIVE" className="text-xs font-medium py-1 px-2">
                  Active Only
                </SelectItem>
                <SelectItem value="PAUSED" className="text-xs font-medium py-1 px-2">
                  Paused Only
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {gamificationAutomationTableColumns
                  .filter((c) => c.key !== "actionsMenu")
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns[col.key] !== false}
                      onCheckedChange={() => toggleColumn(col.key)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {col.header}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "list", label: "List", icon: ListIcon },
              { id: "grid", label: "Grid", icon: LayoutGrid },
            ]}
          />

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Status active={filteredRules.length > 0}>
            Showing {filteredRules.length} of {allRules.length} Rules
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* Content Area */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        {view === "list" ? (
          <GamificationAutomationTable
            rules={filteredRules}
            loading={loading}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={(rule) => setRuleToDelete(rule)}
            onMoveUp={(index) => handleMove(index, "UP")}
            onMoveDown={(index) => handleMove(index, "DOWN")}
            onDuplicate={handleDuplicate}
            togglingId={togglingId}
            visibleColumns={visibleColumns}
          />
        ) : (
          <GamificationAutomationGrid
            rules={filteredRules}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={(rule) => setRuleToDelete(rule)}
            onMoveUp={(index) => handleMove(index, "UP")}
            onMoveDown={(index) => handleMove(index, "DOWN")}
            onDuplicate={handleDuplicate}
            togglingId={togglingId}
          />
        )}
      </EcosystemContainer>

      {/* Delete Rule Dialog */}
      <AlertDialog
        open={Boolean(ruleToDelete)}
        onOpenChange={(open) => !open && setRuleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Automation Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong>{ruleToDelete?.name}</strong>? Members previously awarded
              by this rule will retain their tiers, tags, badges, and points.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
};
