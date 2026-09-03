"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import {
  CurrencyAutomationRule,
  CurrencyRuleTrigger,
  AnyGamificationActionType,
  GET_CURRENCY_AUTOMATION_RULES,
  TOGGLE_CURRENCY_AUTOMATION_RULE,
  DELETE_CURRENCY_AUTOMATION_RULE,
  REORDER_CURRENCY_AUTOMATION_RULES,
  CREATE_CURRENCY_AUTOMATION_RULE,
} from "@/graphql/gamification-automation";
import {
  CURRENCY_BLUEPRINTS,
  CurrencyBlueprint,
} from "./currency-blueprints";
import { CurrencyAutomationTable } from "./currency-automation-table";
import { CurrencyAutomationGrid } from "./currency-automation-grid";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Coins,
  Sparkles,
  Plus,
  RotateCcw,
  Zap,
  Filter,
  ArrowRightLeft,
  Gift,
  List as ListIcon,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";

export const CurrencyAutomationManage: React.FC = () => {
  const router = useRouter();

  // 1. Queries
  const { data, loading, refetch } = useQuery(GET_CURRENCY_AUTOMATION_RULES, {
    fetchPolicy: "cache-and-network",
  });

  const rawRules: CurrencyAutomationRule[] =
    data?.getCurrencyAutomationRules || [];

  // 2. Mutations
  const [toggleRule] = useMutation(TOGGLE_CURRENCY_AUTOMATION_RULE, {
    onCompleted: () => {
      refetch();
      toast.success("Rule status toggled.");
    },
    onError: (err) => toast.error(err.message),
  });

  const [deleteRule] = useMutation(DELETE_CURRENCY_AUTOMATION_RULE, {
    onCompleted: () => {
      refetch();
      toast.success("Rule removed.");
    },
    onError: (err) => toast.error(err.message),
  });

  const [reorderRules] = useMutation(REORDER_CURRENCY_AUTOMATION_RULES, {
    onCompleted: () => {
      refetch();
      toast.success("Priority order updated.");
    },
    onError: (err) => toast.error(err.message),
  });

  const [createRule] = useMutation(CREATE_CURRENCY_AUTOMATION_RULE, {
    onCompleted: () => {
      refetch();
      toast.success("Rule duplicated.");
    },
    onError: (err) => toast.error(err.message),
  });

  // 3. UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerFilter, setTriggerFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [ruleToDelete, setRuleToDelete] =
    useState<CurrencyAutomationRule | null>(null);

  // 4. Filtering
  const filteredRules = useMemo(() => {
    return rawRules.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesDesc = (r.description || "").toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      if (triggerFilter !== "ALL" && r.trigger !== triggerFilter) {
        return false;
      }

      if (statusFilter === "ACTIVE" && !r.isActive) return false;
      if (statusFilter === "PAUSED" && r.isActive) return false;

      if (actionFilter !== "ALL") {
        const hasAction = (r.actions || []).some(
          (act) => act.type === actionFilter
        );
        if (!hasAction) return false;
      }

      return true;
    });
  }, [rawRules, searchQuery, triggerFilter, statusFilter, actionFilter]);

  // Handlers
  const handleToggleStatus = async (id: string, active: boolean) => {
    await toggleRule({
      variables: { id, isActive: active },
    });
  };

  const handleEdit = (rule: CurrencyAutomationRule) => {
    router.push(`/gamification/currency/automation/edit/${rule.id}`);
  };

  const handleDuplicate = async (rule: CurrencyAutomationRule) => {
    const inputPayload = {
      name: `${rule.name} (Copy)`,
      description: rule.description,
      trigger: rule.trigger,
      conditionOperator: rule.conditionOperator,
      conditions: (rule.conditions || []).map((c) => ({
        field: c.field,
        operator: c.operator,
        value: c.value,
      })),
      actions: (rule.actions || []).map((act) => ({
        type: act.type,
        tier: act.tier?.tierId ? { tierId: act.tier.tierId } : undefined,
        email: act.email?.subject
          ? {
              subject: act.email.subject,
              body: act.email.body,
              templateId: act.email.templateId,
            }
          : undefined,
        notification: act.notification
          ? {
              pushTitle: act.notification.pushTitle,
              message: act.notification.message,
              push: act.notification.push,
            }
          : undefined,
        community: act.community?.communityId
          ? { communityId: act.community.communityId }
          : undefined,
        tag: act.tag?.tags ? { tags: act.tag.tags } : undefined,
        tags: act.tags || undefined,
        points: act.points?.points
          ? { points: act.points.points }
          : undefined,
        badge: act.badge?.badgeId
          ? { badgeId: act.badge.badgeId }
          : undefined,
        currency: act.currency?.amount
          ? {
              amount: act.currency.amount,
              currencyType: act.currency.currencyType,
            }
          : undefined,
      })),
      isActive: false,
      priority: (rule.priority || 1) + 1,
    };

    await createRule({
      variables: { input: inputPayload },
    });
  };

  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return;
    await deleteRule({
      variables: { id: ruleToDelete.id },
    });
    setRuleToDelete(null);
  };

  const handleMovePriority = async (
    index: number,
    direction: "up" | "down"
  ) => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= rawRules.length) return;

    const reordered = [...rawRules];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    const ruleIds = reordered.map((r) => r.id);
    await reorderRules({
      variables: { ruleIds },
    });
  };

  const handleApplyBlueprint = (bp: CurrencyBlueprint) => {
    const query = new URLSearchParams({
      blueprint: bp.id,
    }).toString();
    router.push(`/gamification/currency/automation/create?${query}`);
  };

  return (
    <EcosystemWrapper>
      {/* Header */}
      <EcosystemHeader
        title="Currency Automation"
        badgeText="Wallet & Conversion Rules"
        description="Automate tier upgrades, celebratory emails, bonus TC Coins, and circle access triggered by EC/TC earnings and redemptions."
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Currency", href: "/gamification/currency" },
          { label: "Automation" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Refresh
            </Button>

            <Button
              size="sm"
              onClick={() =>
                router.push("/gamification/currency/automation/create")
              }
              className="h-8 gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Automation
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="space-y-4">
        {/* Compact Blueprints Accelerator (when rules empty or as accelerator) */}
        {rawRules.length === 0 && !loading && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                  Currency Automation Blueprints
                </h3>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Click any blueprint to pre-fill and launch a rule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CURRENCY_BLUEPRINTS.map((bp) => {
                const Icon = bp.icon;
                return (
                  <div
                    key={bp.id}
                    onClick={() => handleApplyBlueprint(bp)}
                    className="p-3 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-2 shadow-2xs group cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                            <Icon className="w-3 h-3" />
                          </div>
                          <h4 className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
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
                        Currency
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
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

        {/* Action / Filter Bar */}
        <EcosystemActionBar>
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search currency rules by name or description..."
            />
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Group>
            {/* Trigger Event Filter */}
            <EcosystemActionBar.Item>
              <Select
                value={triggerFilter}
                onValueChange={setTriggerFilter}
              >
                <SelectTrigger className="w-[170px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Triggers" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[170px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                    ⚡ All Trigger Events
                  </SelectItem>
                  <SelectItem
                    value="EC_EARNED"
                    className="text-xs font-medium py-1 px-2"
                  >
                    🪙 EC Earned
                  </SelectItem>
                  <SelectItem
                    value="TC_COINS_EARNED"
                    className="text-xs font-medium py-1 px-2"
                  >
                    🪙 TC Coins Earned
                  </SelectItem>
                  <SelectItem
                    value="CURRENCY_THRESHOLD_REACHED"
                    className="text-xs font-medium py-1 px-2"
                  >
                    🎯 Balance Milestone
                  </SelectItem>
                  <SelectItem
                    value="CURRENCY_CONVERTED"
                    className="text-xs font-medium py-1 px-2"
                  >
                    🔄 Currency Converted
                  </SelectItem>
                  <SelectItem
                    value="REDEMPTION_COMPLETED"
                    className="text-xs font-medium py-1 px-2"
                  >
                    🎁 Redemption Completed
                  </SelectItem>
                  <SelectItem
                    value="DAILY_CONVERSION_CAP_REACHED"
                    className="text-xs font-medium py-1 px-2"
                  >
                    🛑 Daily Cap Hit
                  </SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>

            {/* Action Type Filter */}
            <EcosystemActionBar.Item>
              <Select
                value={actionFilter}
                onValueChange={setActionFilter}
              >
                <SelectTrigger className="w-[150px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                    ✨ All Action Types
                  </SelectItem>
                  <SelectItem
                    value="AWARD_CURRENCY"
                    className="text-xs font-medium py-1 px-2"
                  >
                    🪙 Award Currency (EC/TC)
                  </SelectItem>
                  <SelectItem
                    value="ASSIGN_MEMBERSHIP_TIER"
                    className="text-xs font-medium py-1 px-2"
                  >
                    👑 Assign Tier
                  </SelectItem>
                  <SelectItem
                    value="NOTIFICATION"
                    className="text-xs font-medium py-1 px-2"
                  >
                    🔔 Push Alert
                  </SelectItem>
                  <SelectItem
                    value="EMAIL"
                    className="text-xs font-medium py-1 px-2"
                  >
                    ✉️ Send Email
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
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[120px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[120px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                    All Status
                  </SelectItem>
                  <SelectItem
                    value="ACTIVE"
                    className="text-xs font-medium py-1 px-2 text-emerald-600"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="PAUSED"
                    className="text-xs font-medium py-1 px-2 text-muted-foreground"
                  >
                    Paused
                  </SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Group>
            {/* View Switcher */}
            <EcosystemActionBar.ViewToggle
              value={viewMode}
              onChange={(v) => setViewMode(v as "table" | "grid")}
              options={[
                { id: "table", label: "List", icon: ListIcon },
                { id: "grid", label: "Grid", icon: LayoutGrid },
              ]}
            />
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Content View */}
        {viewMode === "table" ? (
          <CurrencyAutomationTable
            rules={filteredRules}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={(r) => setRuleToDelete(r)}
            onMovePriority={handleMovePriority}
            loading={loading}
          />
        ) : (
          <CurrencyAutomationGrid
            rules={filteredRules}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={(r) => setRuleToDelete(r)}
            loading={loading}
          />
        )}
      </EcosystemContainer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(ruleToDelete)}
        onOpenChange={(open) => !open && setRuleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold">
              Delete Currency Automation Rule?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to delete &quot;{ruleToDelete?.name}&quot;?
              This will immediately stop any automated actions triggered by
              wallet activities or currency conversions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-8 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              Delete Rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
};
