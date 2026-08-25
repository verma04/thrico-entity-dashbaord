"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MEMBER_AUTOMATION_RULES,
  CREATE_MEMBER_AUTOMATION_RULE,
  TOGGLE_MEMBER_AUTOMATION_RULE,
  DELETE_MEMBER_AUTOMATION_RULE,
  REORDER_MEMBER_AUTOMATION_RULES,
  MemberAutomationRule,
} from "@/graphql/member-automation";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { AutomationTable, automationTableColumns } from "./automation-table";
import { AutomationGrid } from "./automation-grid";
import {
  Zap,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  School,
  Building,
  ShieldCheck,
  CheckCircle2,
  Users,
  Mail,
  HelpCircle,
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

// Preset starter recipes
export const RULE_PRESETS = [
  {
    title: "University Alumni Welcome & Tier",
    badge: "Education",
    description:
      "Detects university alumni, automatically awards tier badge, tags profile, and sends welcome email.",
    icon: School,
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    rule: {
      name: "Stanford Alumni Tier & Welcome Flow",
      description:
        "Auto-assigns tier badge, adds Alumni tag, and delivers welcome email on registration.",
      trigger: "MEMBER_JOINED" as const,
      conditionOperator: "AND",
      conditions: [
        {
          field: "profile.college",
          operator: "contains",
          value: "Stanford",
        },
      ],
      actions: [
        {
          type: "ASSIGN_MEMBERSHIP_TIER" as const,
        },
        {
          type: "ADD_MEMBER_TAG" as const,
          tags: ["Stanford Alumni", "Class of 2026"],
        },
        {
          type: "EMAIL" as const,
          emailSubject: "Welcome Stanford Alumni! 🎓",
          emailBody:
            "<p>Hi <strong>{{firstName}}</strong>,</p><p>Welcome to our community! Your alumni membership benefits have been automatically activated.</p>",
        },
        {
          type: "NOTIFICATION" as const,
          pushTitle: "Alumni Membership Activated ✨",
          pushBody: "Welcome! Your exclusive alumni perks are ready to explore.",
          push: true,
        },
      ],
      isActive: true,
    },
  },
  {
    title: "Verified Member VIP Perks",
    badge: "Verification",
    description:
      "Triggers immediately after member passes identity or institutional verification.",
    icon: ShieldCheck,
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
    rule: {
      name: "Verified Profile VIP Allocation",
      description:
        "Assigns VIP tags and delivers push confirmation when identity is verified.",
      trigger: "MEMBER_VERIFIED" as const,
      conditionOperator: "AND",
      conditions: [],
      actions: [
        {
          type: "ADD_MEMBER_TAG" as const,
          tags: ["Verified", "VIP"],
        },
        {
          type: "NOTIFICATION" as const,
          pushTitle: "Identity Verified 🛡️",
          pushBody:
            "Your profile is officially verified. Enjoy elevated privileges across the platform.",
          push: true,
        },
      ],
      isActive: true,
    },
  },
  {
    title: "Corporate Domain Auto-Access",
    badge: "Enterprise",
    description:
      "Matches work email domains (@google.com, @microsoft.com) to grant corporate membership.",
    icon: Building,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    rule: {
      name: "Corporate Partner Auto-Assignment",
      description:
        "Automatically categorizes employees joining with corporate email addresses.",
      trigger: "MEMBER_JOINED" as const,
      conditionOperator: "AND",
      conditions: [
        {
          field: "user.email",
          operator: "contains",
          value: "@company.com",
        },
      ],
      actions: [
        {
          type: "ASSIGN_MEMBERSHIP_TIER" as const,
        },
        {
          type: "ADD_MEMBER_TAG" as const,
          tags: ["Corporate Partner"],
        },
      ],
      isActive: true,
    },
  },
];

export const AutomationManage: React.FC = () => {
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
    [searchParams, pathname, router]
  );

  const search = searchParams.get("q") || "";
  const triggerFilter = searchParams.get("trigger") || "ALL";
  const actionFilter = searchParams.get("action") || "ALL";
  const statusFilter = searchParams.get("status") || "ALL";
  const view = (searchParams.get("view") as "grid" | "list") || "list";

  const setSearch = (q: string) => updateParams({ q: q || null });
  const setTriggerFilter = (t: string) => updateParams({ trigger: t });
  const setActionFilter = (a: string) => updateParams({ action: a });
  const setStatusFilter = (s: string) => updateParams({ status: s });
  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "list" ? null : v });

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    priority: true,
    rule: true,
    trigger: true,
    conditions: true,
    actions: true,
    status: true,
    updatedAt: true,
    actionsMenu: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── GraphQL Data ──────────────────────────────────────────────────────────
  const { data, loading, refetch } = useQuery(GET_MEMBER_AUTOMATION_RULES, {
    fetchPolicy: "cache-and-network",
  });

  const [createRule] = useMutation(CREATE_MEMBER_AUTOMATION_RULE);
  const [toggleRule] = useMutation(TOGGLE_MEMBER_AUTOMATION_RULE);
  const [deleteRule] = useMutation(DELETE_MEMBER_AUTOMATION_RULE);
  const [reorderRules] = useMutation(REORDER_MEMBER_AUTOMATION_RULES);

  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(true);

  const rawRules: MemberAutomationRule[] =
    data?.getMemberAutomationRules || [];

  // Sort rules by priority ascending (1, 2, 3...)
  const sortedRules = useMemo(() => {
    return [...rawRules].sort(
      (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
    );
  }, [rawRules]);

  // Client-side filtering for real-time responsiveness
  const filteredRules = useMemo(() => {
    return sortedRules.filter((rule) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rule.name.toLowerCase().includes(q) ||
        rule.description?.toLowerCase().includes(q) ||
        rule.conditions?.some(
          (c) =>
            c.field.toLowerCase().includes(q) ||
            String(c.value).toLowerCase().includes(q)
        ) ||
        rule.actions?.some(
          (a) =>
            a.tags?.some((t) => t.toLowerCase().includes(q)) ||
            a.emailSubject?.toLowerCase().includes(q) ||
            a.tierName?.toLowerCase().includes(q) ||
            a.communityName?.toLowerCase().includes(q)
        );

      const matchesTrigger =
        triggerFilter === "ALL" || rule.trigger === triggerFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && rule.isActive) ||
        (statusFilter === "PAUSED" && !rule.isActive);

      const matchesAction =
        actionFilter === "ALL" ||
        rule.actions.some((a) => a.type === actionFilter);

      return matchesSearch && matchesTrigger && matchesStatus && matchesAction;
    });
  }, [sortedRules, search, triggerFilter, statusFilter, actionFilter]);

  const activeCount = sortedRules.filter((r) => r.isActive).length;
  const pausedCount = sortedRules.filter((r) => !r.isActive).length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      setTogglingId(id);
      await toggleRule({
        variables: { id, isActive },
        optimisticResponse: {
          toggleMemberAutomationRule: {
            __typename: "MemberAutomationRule",
            id,
            isActive,
          },
        },
      });
      toast.success(
        isActive
          ? "Automation rule activated."
          : "Automation rule paused."
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
      toast.success("Automation rule deleted.");
      setRuleToDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete rule.");
    }
  };

  const handleMove = async (index: number, direction: "UP" | "DOWN") => {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedRules.length) return;

    const newRules = [...sortedRules];
    const [moved] = newRules.splice(index, 1);
    newRules.splice(targetIndex, 0, moved);

    const ruleIds = newRules.map((r) => r.id);

    try {
      await reorderRules({
        variables: { ruleIds },
      });
      toast.success("Rule priority updated.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder rules.");
    }
  };

  const handleDuplicate = async (rule: MemberAutomationRule) => {
    try {
      await createRule({
        variables: {
          input: {
            name: `${rule.name} (Copy)`,
            description: rule.description,
            trigger: rule.trigger,
            conditionOperator: rule.conditionOperator,
            conditions: rule.conditions?.map((c) => ({
              field: c.field,
              operator: c.operator,
              value: c.value,
            })),
            actions: rule.actions?.map((a) => ({
              type: a.type,
              tierId: a.tierId,
              templateId: a.templateId,
              emailSubject: a.emailSubject,
              emailBody: a.emailBody,
              communityId: a.communityId,
              tags: a.tags,
              notificationMessage: a.notificationMessage,
              pushTitle: a.pushTitle,
              pushBody: a.pushBody,
              push: a.push,
            })),
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

  const handleApplyPreset = (preset: (typeof RULE_PRESETS)[0]) => {
    // Navigate to create page with preset state via sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "automation_rule_draft",
        JSON.stringify({
          ...preset.rule,
          priority: sortedRules.length + 1,
        })
      );
    }
    router.push("/members/automation/create");
  };

  const handleEdit = (rule: MemberAutomationRule) => {
    router.push(`/members/automation/edit/${rule.id}`);
  };

  const handleCreate = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("automation_rule_draft");
    }
    router.push("/members/automation/create");
  };

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Member Automation"
        badgeText="Workflow Engine"
        description={
          loading
            ? "Loading automation rules…"
            : `${sortedRules.length} automated rule${sortedRules.length === 1 ? "" : "s"} configured (${activeCount} active, ${pausedCount} paused).`
        }
        icon={Zap}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Automation" },
        ]}
        actions={
          <Button
            onClick={handleCreate}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Rule
          </Button>
        }
      />

      {/* ── Quick Starter Presets Banner ─────────────────────────────────── */}
      {showPresets && sortedRules.length === 0 && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                Quick Starter Recipes
              </h3>
            </div>
            <button
              onClick={() => setShowPresets(false)}
              className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              Dismiss
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {RULE_PRESETS.map((preset, i) => {
              const Icon = preset.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${preset.color} border`}
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
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {preset.description}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full text-xs h-8 gap-1.5 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
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
              placeholder="Search rules by name, condition, or tag…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Primary Filters */}
        <EcosystemActionBar.Group>
          {/* Trigger Event Filter */}
          <EcosystemActionBar.Item>
            <Select value={triggerFilter} onValueChange={setTriggerFilter}>
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Trigger Event" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                  All Triggers
                </SelectItem>
                <SelectItem
                  value="MEMBER_JOINED"
                  className="text-xs font-medium py-1 px-2"
                >
                  When Joins
                </SelectItem>
                <SelectItem
                  value="MEMBER_APPROVED"
                  className="text-xs font-medium py-1 px-2"
                >
                  When Approved
                </SelectItem>
                <SelectItem
                  value="MEMBER_VERIFIED"
                  className="text-xs font-medium py-1 px-2"
                >
                  When Verified
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Action Type Filter */}
          <EcosystemActionBar.Item>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
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
                  Tier Assignment
                </SelectItem>
                <SelectItem
                  value="COMMUNITY_JOIN"
                  className="text-xs font-medium py-1 px-2"
                >
                  Community Join
                </SelectItem>
                <SelectItem
                  value="EMAIL"
                  className="text-xs font-medium py-1 px-2"
                >
                  Email Dispatch
                </SelectItem>
                <SelectItem
                  value="NOTIFICATION"
                  className="text-xs font-medium py-1 px-2"
                >
                  Push Notice
                </SelectItem>
                <SelectItem
                  value="ADD_MEMBER_TAG"
                  className="text-xs font-medium py-1 px-2"
                >
                  Member Tags
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Status Filter */}
          <EcosystemActionBar.Item>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[130px]">
                <SelectItem value="ALL" className="text-xs font-medium py-1 px-2">
                  All Status
                </SelectItem>
                <SelectItem
                  value="ACTIVE"
                  className="text-xs font-medium py-1 px-2"
                >
                  Active Only
                </SelectItem>
                <SelectItem
                  value="PAUSED"
                  className="text-xs font-medium py-1 px-2"
                >
                  Paused Only
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          {/* Columns Toggle (when in list mode) */}
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
                {automationTableColumns
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

          {/* Grid / List View Toggle */}
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
            Showing {filteredRules.length} of {sortedRules.length} Rules
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        {view === "list" ? (
          <AutomationTable
            rules={filteredRules}
            loading={loading}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={(id) => setRuleToDelete(id)}
            onMoveUp={(index) => handleMove(index, "UP")}
            onMoveDown={(index) => handleMove(index, "DOWN")}
            onDuplicate={handleDuplicate}
            togglingId={togglingId}
            visibleColumns={visibleColumns}
          />
        ) : (
          <AutomationGrid
            rules={filteredRules}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={(id) => setRuleToDelete(id)}
            onMoveUp={(index) => handleMove(index, "UP")}
            onMoveDown={(index) => handleMove(index, "DOWN")}
            onDuplicate={handleDuplicate}
            togglingId={togglingId}
          />
        )}
      </EcosystemContainer>

      {/* ── Delete Confirmation Dialog ───────────────────────────────────── */}
      <AlertDialog
        open={Boolean(ruleToDelete)}
        onOpenChange={(open) => !open && setRuleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Automation Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this assignment rule. Members who were previously assigned tiers or tags by this rule will retain their existing status.
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
