"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MEMBER_AUTOMATION_RULES,
  CREATE_MEMBER_AUTOMATION_RULE,
  UPDATE_MEMBER_AUTOMATION_RULE,
  TOGGLE_MEMBER_AUTOMATION_RULE,
  DELETE_MEMBER_AUTOMATION_RULE,
  REORDER_MEMBER_AUTOMATION_RULES,
  MemberAutomationRule,
  CreateMemberAutomationRuleInput,
  UpdateMemberAutomationRuleInput,
} from "@/graphql/member-automation";
import { RuleCard } from "./rule-card";
import { RuleModal } from "./rule-modal";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Zap,
  Sparkles,
  Award,
  Layers,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertCircle,
  Users,
  Mail,
  ShieldCheck,
  Building,
  School,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { toast } from "sonner";

// Preset rule templates that administrators can instantly load
const RULE_PRESETS = [
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

export const MemberRulesTab: React.FC = () => {
  const { data, loading, refetch } = useQuery(GET_MEMBER_AUTOMATION_RULES, {
    fetchPolicy: "cache-and-network",
  });

  const [createRule, { loading: creating }] = useMutation(
    CREATE_MEMBER_AUTOMATION_RULE
  );
  const [updateRule, { loading: updating }] = useMutation(
    UPDATE_MEMBER_AUTOMATION_RULE
  );
  const [toggleRule] = useMutation(TOGGLE_MEMBER_AUTOMATION_RULE);
  const [deleteRule] = useMutation(DELETE_MEMBER_AUTOMATION_RULE);
  const [reorderRules] = useMutation(REORDER_MEMBER_AUTOMATION_RULES);

  const [searchQuery, setSearchQuery] = useState("");
  const [triggerFilter, setTriggerFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState<MemberAutomationRule | null>(
    null
  );
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const rawRules: MemberAutomationRule[] =
    data?.getMemberAutomationRules || [];

  // Sort by priority ascending (1, 2, 3...)
  const sortedRules = useMemo(() => {
    return [...rawRules].sort(
      (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
    );
  }, [rawRules]);

  // Filtered rules for search and filters
  const filteredRules = useMemo(() => {
    return sortedRules.filter((rule) => {
      const matchesSearch =
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.conditions?.some(
          (c) =>
            c.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(c.value).toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [sortedRules, searchQuery, triggerFilter, statusFilter, actionFilter]);

  const activeCount = sortedRules.filter((r) => r.isActive).length;
  const pausedCount = sortedRules.filter((r) => !r.isActive).length;

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

  const handleSaveRule = async (
    input: CreateMemberAutomationRuleInput | UpdateMemberAutomationRuleInput,
    id?: string
  ) => {
    if (id) {
      await updateRule({
        variables: { id, input },
      });
      toast.success("Automation rule updated successfully.");
    } else {
      await createRule({
        variables: {
          input: {
            ...input,
            priority: sortedRules.length + 1,
          },
        },
      });
      toast.success("New assignment rule created successfully.");
    }
    refetch();
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
      toast.success("Rule priority reordered.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder rules.");
    }
  };

  const handleApplyPreset = (preset: (typeof RULE_PRESETS)[0]) => {
    setRuleToEdit({
      id: "",
      entityId: "",
      name: preset.rule.name,
      description: preset.rule.description,
      trigger: preset.rule.trigger,
      conditionOperator: preset.rule.conditionOperator,
      conditions: preset.rule.conditions,
      actions: preset.rule.actions as any,
      isActive: true,
      priority: sortedRules.length + 1,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1140px]">
      {/* Top Banner / Stats */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-white border border-zinc-800/80 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-xs">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <h2 className="text-base font-bold tracking-tight text-white">
                Member Automation Engine
              </h2>
              <div className="flex items-center gap-1.5">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
                  {activeCount} Active Rules
                </Badge>
                {pausedCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-zinc-400 border-zinc-700 text-[10px]"
                  >
                    {pausedCount} Paused
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
              Rules execute automatically based on priority (#1 evaluated first). When a member satisfies conditions, their membership tier, community circles, emails, and profile tags trigger instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => {
                setRuleToEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs font-bold h-9 px-4 gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Rule
            </Button>
          </div>
        </div>
      </div>

      {/* Preset Rule Quick Starters (Collapsible / Banner) */}
      {sortedRules.length === 0 && !loading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Quick Starter Templates
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {RULE_PRESETS.map((preset, i) => {
              const Icon = preset.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3 group"
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
                    className="w-full text-xs h-8 gap-1.5 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Use This Template
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search rules by name, condition, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter by Trigger */}
          <Select value={triggerFilter} onValueChange={setTriggerFilter}>
            <SelectTrigger className="h-9 w-[150px] text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl">
              <SelectValue placeholder="Trigger Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Triggers
              </SelectItem>
              <SelectItem value="MEMBER_JOINED" className="text-xs">
                When Joins
              </SelectItem>
              <SelectItem value="MEMBER_APPROVED" className="text-xs">
                When Approved
              </SelectItem>
              <SelectItem value="MEMBER_VERIFIED" className="text-xs">
                When Verified
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Action Type */}
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="h-9 w-[150px] text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Actions
              </SelectItem>
              <SelectItem value="ASSIGN_MEMBERSHIP_TIER" className="text-xs">
                Tier Assignment
              </SelectItem>
              <SelectItem value="COMMUNITY_JOIN" className="text-xs">
                Community Auto-Join
              </SelectItem>
              <SelectItem value="EMAIL" className="text-xs">
                Email Dispatch
              </SelectItem>
              <SelectItem value="NOTIFICATION" className="text-xs">
                Push Notification
              </SelectItem>
              <SelectItem value="ADD_MEMBER_TAG" className="text-xs">
                Member Tags
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[120px] text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Status
              </SelectItem>
              <SelectItem value="ACTIVE" className="text-xs">
                Active Only
              </SelectItem>
              <SelectItem value="PAUSED" className="text-xs">
                Paused Only
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rules List Content */}
      {loading && sortedRules.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="w-48 h-4" />
                </div>
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <Skeleton className="w-full h-16 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto shadow-2xs">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {searchQuery ||
              triggerFilter !== "ALL" ||
              statusFilter !== "ALL" ||
              actionFilter !== "ALL"
                ? "No matching automation rules found"
                : "No member automation rules configured yet"}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              {searchQuery ||
              triggerFilter !== "ALL" ||
              statusFilter !== "ALL" ||
              actionFilter !== "ALL"
                ? "Try clearing filters or search criteria."
                : "Set up automated rules to allocate tiers, auto-join community circles, and dispatch personalized onboarding workflows."}
            </p>
          </div>
          <div>
            <Button
              onClick={() => {
                setRuleToEdit(null);
                setIsModalOpen(true);
              }}
              className="text-xs h-8 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Rule
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRules.map((rule, idx) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              index={sortedRules.findIndex((r) => r.id === rule.id)}
              totalRules={sortedRules.length}
              onEdit={(r) => {
                setRuleToEdit(r);
                setIsModalOpen(true);
              }}
              onToggle={handleToggle}
              onDelete={(id) => setRuleToDelete(id)}
              onMoveUp={(index) => handleMove(index, "UP")}
              onMoveDown={(index) => handleMove(index, "DOWN")}
              isToggling={togglingId === rule.id}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Rule Modal */}
      <RuleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRuleToEdit(null);
        }}
        onSave={handleSaveRule}
        ruleToEdit={ruleToEdit}
        loading={creating || updating}
      />

      {/* Delete Confirmation Alert */}
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
    </div>
  );
};
