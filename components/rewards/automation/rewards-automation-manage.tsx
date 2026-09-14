"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_REWARDS_AUTOMATION_RULES,
  CREATE_REWARDS_AUTOMATION_RULE,
  TOGGLE_REWARDS_AUTOMATION_RULE,
  DELETE_REWARDS_AUTOMATION_RULE,
  RewardsAutomationRule,
  RewardRuleTrigger,
  formatRewardsActionInput,
} from "@/graphql/rewards-automation";

import { useGetEntity } from "@/graphql/actions";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";

import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import {
  RewardsAutomationTable,
  rewardsTableColumns,
} from "./rewards-automation-table";
import { RewardsAutomationGrid } from "./rewards-automation-grid";
import { RewardsAutomationLogsDrawer } from "./rewards-automation-logs-drawer";
import { REWARDS_STARTER_RECIPES } from "./flow/rewards-node-palette";
import {
  Zap,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Dices,
  RectangleHorizontal,
  RefreshCw,
  Ticket,
  Activity,
  Layers,
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

export const RewardsAutomationManage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL State Sync ────────────────────────────────────────────────────────
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
    [searchParams, pathname, router],
  );

  const search = searchParams.get("q") || "";
  const moduleFilter = searchParams.get("module") || "ALL";
  const triggerFilter = searchParams.get("trigger") || "ALL";
  const actionFilter = searchParams.get("action") || "ALL";
  const statusFilter = searchParams.get("status") || "ALL";
  const view = (searchParams.get("view") as "grid" | "list") || "list";

  const setSearch = (q: string) => updateParams({ q: q || null });
  const setModuleFilter = (m: string) => updateParams({ module: m });
  const setTriggerFilter = (t: string) => updateParams({ trigger: t });
  const setActionFilter = (a: string) => updateParams({ action: a });
  const setStatusFilter = (s: string) => updateParams({ status: s });
  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "list" ? null : v });

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      priority: true,
      rule: true,
      trigger: true,
      branches: true,
      conditions: true,
      actions: true,
      status: true,
      executions: true,
      lastRunAt: true,
      actionsMenu: true,
    },
  );

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── GraphQL Data ──────────────────────────────────────────────────────────
  const { data, loading, refetch } = useQuery(GET_REWARDS_AUTOMATION_RULES, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });

  const [createRule] = useMutation(CREATE_REWARDS_AUTOMATION_RULE);
  const [toggleRule] = useMutation(TOGGLE_REWARDS_AUTOMATION_RULE);
  const [deleteRule] = useMutation(DELETE_REWARDS_AUTOMATION_RULE);

  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(true);
  const [selectedLogsRule, setSelectedLogsRule] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const rawRules: RewardsAutomationRule[] =
    data?.getRewardsAutomationRules || [];

  // Sort rules by priority ascending
  const sortedRules = useMemo(() => {
    return [...rawRules].sort(
      (a, b) => (a.priority ?? 999) - (b.priority ?? 999),
    );
  }, [rawRules]);

  // Client-side filtering
  const filteredRules = useMemo(() => {
    return sortedRules.filter((rule) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rule.name.toLowerCase().includes(q) ||
        rule.description?.toLowerCase().includes(q) ||
        rule.trigger.toLowerCase().includes(q) ||
        rule.actions?.some(
          (a) =>
            a.pushTitle?.toLowerCase().includes(q) ||
            a.tags?.some((t) => t.toLowerCase().includes(q)),
        );

      const mod =
        rule.module ||
        (rule.trigger.startsWith("SPIN_WHEEL")
          ? "SPIN_WHEEL"
          : rule.trigger.startsWith("SCRATCH_CARD")
            ? "SCRATCH_CARD"
            : rule.trigger.startsWith("MATCH_WIN")
              ? "MATCH_WIN"
              : "REWARDS");
      const matchesModule = moduleFilter === "ALL" || mod === moduleFilter;
      const matchesTrigger =
        triggerFilter === "ALL" || rule.trigger === triggerFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && rule.isActive) ||
        (statusFilter === "PAUSED" && !rule.isActive);
      const matchesAction =
        actionFilter === "ALL" ||
        rule.actions.some((a) => a.type === actionFilter);

      return (
        matchesSearch &&
        matchesModule &&
        matchesTrigger &&
        matchesStatus &&
        matchesAction
      );
    });
  }, [
    sortedRules,
    search,
    moduleFilter,
    triggerFilter,
    statusFilter,
    actionFilter,
  ]);

  const activeCount = sortedRules.filter((r) => r.isActive).length;
  const pausedCount = sortedRules.filter((r) => !r.isActive).length;
  const totalExecutions = useMemo(() => {
    return sortedRules.reduce((acc, r) => acc + (r.executionCount || 0), 0);
  }, [sortedRules]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      setTogglingId(id);
      await toggleRule({
        variables: { id, isActive },
      });
      toast.success(
        isActive
          ? "Rewards automation activated."
          : "Rewards automation paused.",
      );
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle rule.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!ruleToDelete) return;
    try {
      await deleteRule({
        variables: { id: ruleToDelete },
      });
      toast.success("Rewards automation rule deleted.");
      setRuleToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete rule.");
    }
  };

  const handleDuplicate = async (rule: RewardsAutomationRule) => {
    try {
      await createRule({
        variables: {
          input: {
            name: `${rule.name} (Copy)`,
            description: rule.description,
            rewardId: rule.rewardId || undefined,
            trigger: rule.trigger,
            conditionOperator: rule.conditionOperator || "AND",
            branches: (rule.branches || []).map((b) => ({
              id: b.id,
              name: b.name,
              isDefault: Boolean(b.isDefault),
              hasNoPath: Boolean(b.hasNoPath),
            })),
            conditions: (rule.conditions || []).map((c) => ({
              field: c.field,
              operator: c.operator,
              value: c.value,
              branch: c.branch,
            })),
            actions: (rule.actions || []).map(formatRewardsActionInput),
            canvasNodes: rule.canvasNodes || [],
            canvasEdges: rule.canvasEdges || [],
            isActive: false,
            priority: sortedRules.length + 1,
          },
        },
      });
      toast.success("Rule duplicated as draft.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to duplicate rule.");
    }
  };


  const handleApplyPreset = (preset: (typeof REWARDS_STARTER_RECIPES)[0]) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "rewards_automation_draft",
        JSON.stringify({
          ...preset.rule,
          priority: sortedRules.length + 1,
        }),
      );
    }
    router.push("/gamification/rewards/automation/create");
  };

  const handleEdit = (rule: RewardsAutomationRule) => {
    router.push(`/gamification/rewards/automation/edit/${rule.id}`);
  };

  const handleCreate = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("rewards_automation_draft");
    }
    router.push("/gamification/rewards/automation/create");
  };

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Rewards & Games Automation"
        badgeText="Gamification Engine"
        description={
          loading
            ? "Loading rewards automation rules…"
            : `${sortedRules.length} rule${sortedRules.length === 1 ? "" : "s"} configured (${activeCount} active, ${pausedCount} paused) across Spin Wheel, Scratch Card, Match & Win, and Rewards • ${totalExecutions.toLocaleString()} total execution${totalExecutions === 1 ? "" : "s"}.`
        }
        icon={Zap}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Automation" },
        ]}
        actions={
          <Button
            onClick={handleCreate}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Rule
          </Button>
        }
      />

      {/* ── Module Selection Filter Bar ──────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "ALL", label: "All Modules", icon: Layers },
          { id: "SPIN_WHEEL", label: "Spin the Wheel", icon: Dices },
          {
            id: "SCRATCH_CARD",
            label: "Scratch Card",
            icon: RectangleHorizontal,
          },
          { id: "MATCH_WIN", label: "Match & Win", icon: RefreshCw },
          { id: "REWARDS", label: "Rewards & Coupons", icon: Ticket },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = moduleFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setModuleFilter(tab.id)}
              className={cn(
                "h-8 px-3 rounded-lg border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Quick Starter Recipes Banner ─────────────────────────────────── */}
      {showPresets && sortedRules.length === 0 && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Recommended Starter Recipes
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {REWARDS_STARTER_RECIPES.map((preset, i) => {
              const Icon = preset.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border/80 bg-card hover:border-border transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center border",
                          preset.color,
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-semibold"
                      >
                        {preset.badge}
                      </Badge>
                    </div>
                    <h4 className="text-xs font-bold text-foreground">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {preset.description}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full text-xs h-8 gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Use Recipe
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by rule name, trigger, tags..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Primary Filters */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-8 rounded-md border-border bg-card text-xs font-medium shadow-2xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border text-xs">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active Only</SelectItem>
                <SelectItem value="PAUSED">Paused Only</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium shadow-2xs">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border text-xs">
                <SelectItem value="ALL">All Actions</SelectItem>
                <SelectItem value="AWARD_POINTS">Award Points</SelectItem>
                <SelectItem value="AWARD_CURRENCY">Credit Currency</SelectItem>
                <SelectItem value="NOTIFICATION">Push Notification</SelectItem>
                <SelectItem value="EMAIL">Send Email</SelectItem>
                <SelectItem value="ISSUE_COUPON">Issue Voucher</SelectItem>
                <SelectItem value="ADD_MEMBER_TAG">Member Tags</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Views & Columns */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "p-1.5 rounded-md transition-all cursor-pointer",
                  view === "list"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title="Table View"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-all cursor-pointer",
                  view === "grid"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs font-medium gap-1.5 border-border"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 text-xs">
                <DropdownMenuLabel>Customize Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {rewardsTableColumns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns[col.key]}
                    onCheckedChange={() => toggleColumn(col.key)}
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Table or Grid View ───────────────────────────────────────────── */}
      {view === "list" ? (
        <RewardsAutomationTable
          rules={filteredRules}
          loading={loading}
          onEdit={handleEdit}
          onViewLogs={(rule) =>
            setSelectedLogsRule({ id: rule.id, name: rule.name })
          }
          onToggle={handleToggle}
          onDelete={(id) => setRuleToDelete(id)}
          onMoveUp={(idx) => {}}
          onMoveDown={(idx) => {}}
          onDuplicate={handleDuplicate}
          togglingId={togglingId}
          visibleColumns={visibleColumns}
        />
      ) : (
        <RewardsAutomationGrid
          rules={filteredRules}
          loading={loading}
          onEdit={handleEdit}
          onViewLogs={(rule) =>
            setSelectedLogsRule({ id: rule.id, name: rule.name })
          }
          onToggle={handleToggle}
          onDelete={(id) => setRuleToDelete(id)}
          onDuplicate={handleDuplicate}
          togglingId={togglingId}
        />
      )}

      {/* ── Delete Confirmation Dialog ───────────────────────────────────── */}
      <AlertDialog
        open={Boolean(ruleToDelete)}
        onOpenChange={(open) => {
          if (!open) setRuleToDelete(null);
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold">
              Delete Automation Rule?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              This will permanently remove this automation pipeline and stop all
              automated prize awarding and consolation actions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-xs font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Execution Analytics & Logs Drawer ────────────────────────────── */}
      <RewardsAutomationLogsDrawer
        ruleId={selectedLogsRule?.id || null}
        ruleName={selectedLogsRule?.name}
        open={Boolean(selectedLogsRule)}
        onOpenChange={(open) => {
          if (!open) setSelectedLogsRule(null);
        }}
      />
    </EcosystemWrapper>
  );
};
