"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MemberAutomationRule,
  CreateMemberAutomationRuleInput,
  UpdateMemberAutomationRuleInput,
  MemberRuleTrigger,
  MemberRuleConditionInput,
  MemberRuleActionInput,
} from "@/graphql/member-automation";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ConditionBuilder } from "@/components/members/settings/rules/condition-builder";
import { ActionBuilder } from "@/components/members/settings/rules/action-builder";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Sparkles,
  Filter,
  Users,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  School,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AutomationFormProps {
  initialValues?: MemberAutomationRule | null;
  loading?: boolean;
  onSave: (
    input: CreateMemberAutomationRuleInput | UpdateMemberAutomationRuleInput,
  ) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const TRIGGER_OPTIONS: {
  value: MemberRuleTrigger;
  label: string;
  badge: string;
  description: string;
  icon: any;
}[] = [
  {
    value: "MEMBER_JOINED",
    label: "Member Registration",
    badge: "Join Event",
    description:
      "Evaluated immediately when a user signs up or is invited to join the ecosystem.",
    icon: Users,
  },
  {
    value: "MEMBER_APPROVED",
    label: "Member Approval",
    badge: "Admin Action",
    description:
      "Triggered when an admin or automated rule approves the applicant's profile.",
    icon: CheckCircle2,
  },
  {
    value: "MEMBER_VERIFIED",
    label: "Identity / Profile Verified",
    badge: "Trust Badge",
    description:
      "Triggered when identity documents or institutional email address are verified.",
    icon: ShieldCheck,
  },
];

const PRESET_RECIPES = [
  {
    title: "Stanford Alumni Tier & Welcome",
    badge: "Education",
    icon: School,
    trigger: "MEMBER_JOINED" as MemberRuleTrigger,
    conditionOperator: "AND" as const,
    conditions: [
      {
        field: "profile.college",
        operator: "contains",
        value: "Stanford",
      },
    ],
    actions: [
      { type: "ASSIGN_MEMBERSHIP_TIER" as const },
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
  },
  {
    title: "Corporate Partner Auto-Assignment",
    badge: "Enterprise",
    icon: Building,
    trigger: "MEMBER_JOINED" as MemberRuleTrigger,
    conditionOperator: "AND" as const,
    conditions: [
      {
        field: "user.email",
        operator: "contains",
        value: "@company.com",
      },
    ],
    actions: [
      { type: "ASSIGN_MEMBERSHIP_TIER" as const },
      { type: "ADD_MEMBER_TAG" as const, tags: ["Corporate Partner"] },
    ],
  },
  {
    title: "Verified Profile VIP Allocation",
    badge: "Verification",
    icon: ShieldCheck,
    trigger: "MEMBER_VERIFIED" as MemberRuleTrigger,
    conditionOperator: "AND" as const,
    conditions: [],
    actions: [
      { type: "ADD_MEMBER_TAG" as const, tags: ["Verified", "VIP"] },
      {
        type: "NOTIFICATION" as const,
        pushTitle: "Identity Verified 🛡️",
        pushBody:
          "Your profile is officially verified. Enjoy elevated privileges across the platform.",
        push: true,
      },
    ],
  },
];

export const AutomationForm: React.FC<AutomationFormProps> = ({
  initialValues,
  loading = false,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(
    initialValues?.description || "",
  );
  const [trigger, setTrigger] = useState<MemberRuleTrigger>(
    initialValues?.trigger || "MEMBER_JOINED",
  );
  const [conditionOperator, setConditionOperator] = useState<"AND" | "OR">(
    (initialValues?.conditionOperator as "AND" | "OR") || "AND",
  );
  const [conditions, setConditions] = useState<MemberRuleConditionInput[]>(
    initialValues?.conditions
      ? initialValues.conditions.map((c) => ({
          field: c.field,
          operator: c.operator,
          value: c.value,
        }))
      : [],
  );
  const [actions, setActions] = useState<MemberRuleActionInput[]>(
    initialValues?.actions
      ? initialValues.actions.map((a) => ({
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
        }))
      : [{ type: "ASSIGN_MEMBERSHIP_TIER" }],
  );
  const [isActive, setIsActive] = useState(
    initialValues ? initialValues.isActive : true,
  );
  const [savedState, setSavedState] = useState(false);

  // Check for session draft on mount if not edit
  useEffect(() => {
    if (!isEdit && typeof window !== "undefined") {
      const draftStr = sessionStorage.getItem("automation_rule_draft");
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          setName(draft.name || "");
          setDescription(draft.description || "");
          setTrigger(draft.trigger || "MEMBER_JOINED");
          setConditionOperator(draft.conditionOperator || "AND");
          setConditions(draft.conditions || []);
          setActions(draft.actions || [{ type: "ASSIGN_MEMBERSHIP_TIER" }]);
          setIsActive(draft.isActive !== undefined ? draft.isActive : true);
          sessionStorage.removeItem("automation_rule_draft");
          toast.info("Applied template recipe to form.");
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, [isEdit]);

  // Track if form has unsaved modifications
  const hasChanged = useMemo(() => {
    if (!initialValues) {
      return name.trim().length > 0 || description.trim().length > 0;
    }
    return (
      name !== initialValues.name ||
      description !== (initialValues.description || "") ||
      trigger !== initialValues.trigger ||
      conditionOperator !== (initialValues.conditionOperator || "AND") ||
      isActive !== initialValues.isActive ||
      JSON.stringify(conditions) !==
        JSON.stringify(
          initialValues.conditions?.map((c) => ({
            field: c.field,
            operator: c.operator,
            value: c.value,
          })) || [],
        ) ||
      JSON.stringify(actions) !==
        JSON.stringify(
          initialValues.actions?.map((a) => ({
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
          })) || [],
        )
    );
  }, [
    name,
    description,
    trigger,
    conditionOperator,
    conditions,
    actions,
    isActive,
    initialValues,
  ]);

  const handleReset = () => {
    if (initialValues) {
      setName(initialValues.name || "");
      setDescription(initialValues.description || "");
      setTrigger(initialValues.trigger || "MEMBER_JOINED");
      setConditionOperator(
        (initialValues.conditionOperator as "AND" | "OR") || "AND",
      );
      setConditions(
        initialValues.conditions
          ? initialValues.conditions.map((c) => ({
              field: c.field,
              operator: c.operator,
              value: c.value,
            }))
          : [],
      );
      setActions(
        initialValues.actions
          ? initialValues.actions.map((a) => ({
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
            }))
          : [],
      );
      setIsActive(initialValues.isActive);
    } else {
      setName("");
      setDescription("");
      setTrigger("MEMBER_JOINED");
      setConditionOperator("AND");
      setConditions([]);
      setActions([{ type: "ASSIGN_MEMBERSHIP_TIER" }]);
      setIsActive(true);
    }
  };

  const handleApplyRecipe = (recipe: (typeof PRESET_RECIPES)[0]) => {
    setName(recipe.title);
    setTrigger(recipe.trigger);
    setConditionOperator(recipe.conditionOperator);
    setConditions(recipe.conditions);
    setActions(recipe.actions as any);
    toast.success(`Applied ${recipe.title} template.`);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a rule name.");
      return;
    }

    if (actions.length === 0) {
      toast.error("Please configure at least one automated action.");
      return;
    }

    // Clean conditions
    const validConditions = conditions.filter((c) => {
      if (c.operator === "is_not_empty" || c.operator === "is_empty")
        return true;
      if (typeof c.value === "string") return c.value.trim().length > 0;
      return c.value !== null && c.value !== undefined;
    });

    const payload: CreateMemberAutomationRuleInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      trigger,
      conditionOperator,
      conditions: validConditions,
      actions: actions.map((a) => ({
        type: a.type,
        tierId: a.tierId || undefined,
        templateId: a.templateId || undefined,
        emailSubject: a.emailSubject || undefined,
        emailBody: a.emailBody || undefined,
        communityId: a.communityId || undefined,
        tags: a.tags && a.tags.length > 0 ? a.tags : undefined,
        notificationMessage: a.notificationMessage || undefined,
        pushTitle: a.pushTitle || undefined,
        pushBody: a.pushBody || undefined,
        push: a.push ?? undefined,
      })),
      isActive,
    };

    try {
      await onSave(payload);
      setSavedState(true);
      setTimeout(() => setSavedState(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save rule.");
    }
  };

  const selectedTriggerMeta = useMemo(() => {
    return (
      TRIGGER_OPTIONS.find((t) => t.value === trigger) || TRIGGER_OPTIONS[0]
    );
  }, [trigger]);

  return (
    <form onSubmit={handleSubmit}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Pipeline Flow Preview */}
            <PolarisSidebarCard
              title="Workflow Pipeline"
              badge="Live Summary"
              icon={Sparkles}
            >
              <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-xs">
                {/* Visual Step Sequence */}
                <div className="p-3 rounded-[6px] bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-800 space-y-2">
                  {/* Step 1: Trigger */}
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      1
                    </div>
                    <span className="font-semibold text-[#303030] dark:text-zinc-100">
                      {selectedTriggerMeta.label}
                    </span>
                  </div>

                  <div className="pl-2.5">
                    <div className="w-px h-2.5 bg-[#d2d5d9] dark:bg-zinc-700" />
                  </div>

                  {/* Step 2: Conditions */}
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <div className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      2
                    </div>
                    <span className="font-semibold text-[#303030] dark:text-zinc-100">
                      {conditions.length > 0
                        ? `${conditions.length} Condition${conditions.length > 1 ? "s" : ""} (${conditionOperator})`
                        : "All Members (No Filter)"}
                    </span>
                  </div>

                  <div className="pl-2.5">
                    <div className="w-px h-2.5 bg-[#d2d5d9] dark:bg-zinc-700" />
                  </div>

                  {/* Step 3: Actions */}
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <div className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-[10px]">
                      3
                    </div>
                    <span className="font-semibold text-[#303030] dark:text-zinc-100">
                      {actions.length} Action{actions.length === 1 ? "" : "s"}{" "}
                      Executed
                    </span>
                  </div>
                </div>

                {/* Summary Table Breakdown */}
                <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                  <PolarisSummaryRow
                    label="Rule Name"
                    value={
                      <span className="truncate max-w-[140px] inline-block font-semibold">
                        {name || "Untitled Rule"}
                      </span>
                    }
                  />
                  <PolarisSummaryRow
                    label="Trigger"
                    value={selectedTriggerMeta.label}
                  />
                  <PolarisSummaryRow
                    label="Targeting"
                    value={
                      conditions.length > 0
                        ? `${conditions.length} Field Filter${conditions.length > 1 ? "s" : ""}`
                        : "Everyone"
                    }
                  />
                  <PolarisSummaryRow
                    label="Actions"
                    value={`${actions.length} Configured`}
                  />
                  <PolarisSummaryRow
                    label="Status"
                    value={
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.2 rounded-[4px]",
                          isActive
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                            : "bg-zinc-100 text-zinc-600 border-zinc-300",
                        )}
                      >
                        {isActive ? "Active" : "Paused"}
                      </Badge>
                    }
                    isLast
                  />
                </div>
              </div>
            </PolarisSidebarCard>

            {/* Quick Template Presets */}
            <PolarisSidebarCard
              title="Template Recipes"
              badge="1-Click"
              icon={Sparkles}
            >
              <div className="space-y-1.5">
                {PRESET_RECIPES.map((recipe, idx) => {
                  const Icon = recipe.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyRecipe(recipe)}
                      className="w-full p-2.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 hover:border-[#aeb4b9] bg-white dark:bg-zinc-900 hover:bg-[#f6f6f7] text-left transition-all flex items-start gap-2.5 group cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-[#616161] group-hover:text-[#303030]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block truncate">
                          {recipe.title}
                        </span>
                        <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                          {recipe.badge} · {recipe.actions.length} Actions
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </PolarisSidebarCard>

            {/* Automation Execution Logic Tip */}
            <PolarisTipCard title="Automation Best Practices" icon={TrendingUp}>
              <div className="space-y-1.5 text-[12px] text-[#616161] leading-[16px]">
                <p>
                  <strong>Priority-Based:</strong> Rules execute sequentially by
                  priority rank (#1 is evaluated first).
                </p>
                <p>
                  <strong>Merge Tags:</strong> Use{" "}
                  <code className="bg-[#f6f6f7] dark:bg-zinc-800 px-1 py-0.5 rounded border border-[#d2d5d9] text-[10px] font-mono">
                    {"{{firstName}}"}
                  </code>{" "}
                  and{" "}
                  <code className="bg-[#f6f6f7] dark:bg-zinc-800 px-1 py-0.5 rounded border border-[#d2d5d9] text-[10px] font-mono">
                    {"{{tierName}}"}
                  </code>{" "}
                  in email bodies for instant personalization.
                </p>
              </div>
            </PolarisTipCard>
          </div>
        }
      >
        {/* ── Step 1: Basic Information & Trigger ─────────────────────────── */}
        <PolarisFormCard
          step={1}
          title="Rule Information & Trigger Event"
          description="Define the administrative rule title and the lifecycle event that initiates this automation."
          icon={Zap}
        >
          <div className="space-y-3">
            <PolarisInput
              id="rule-name"
              label="Rule Name"
              required
              placeholder="e.g. Stanford University - Gold Tier & Welcome Flow"
              value={name}
              onChange={(e) => setName(e.target.value)}
              prefix={<Zap className="h-3.5 w-3.5" />}
            />

            <PolarisTextarea
              id="rule-description"
              label="Description"
              placeholder="Describe when this rule executes and what privileges or emails it awards to matching members..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="Optional context explaining the business rationale or target cohort for this automation."
            />

            {/* Trigger Selector */}
            <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisLabel required>Trigger Lifecycle Event (WHEN)</PolarisLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TRIGGER_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = trigger === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTrigger(opt.value)}
                      className={cn(
                        "p-3 rounded-[8px] border text-left flex flex-col justify-between transition-all cursor-pointer",
                        isSelected
                          ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-[4px] flex items-center justify-center shrink-0 border",
                            isSelected
                              ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                              : "bg-[#f6f6f7] text-[#616161] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                          {opt.label}
                        </span>
                      </div>
                      <p className="text-[11px] leading-[15px] text-[#616161] dark:text-zinc-400">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#f6f6f7]/50 dark:bg-zinc-900/40 border border-[#d2d5d9] dark:border-zinc-800 mt-2">
              <div>
                <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                  Rule Active Status
                </span>
                <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                  When active, this rule will automatically evaluate matching
                  members in real time.
                </span>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>
        </PolarisFormCard>

        {/* ── Step 2: Targeting Conditions ───────────────────────────────── */}
        <PolarisFormCard
          step={2}
          title="Targeting Conditions & Match Criteria"
          description="Filter which members qualify for this automation based on profile, education, tags, or email domain."
          icon={Filter}
        >
          <div className="space-y-3">
            <ConditionBuilder
              conditions={conditions}
              conditionOperator={conditionOperator}
              onConditionOperatorChange={setConditionOperator}
              onChange={setConditions}
            />
          </div>
        </PolarisFormCard>

        {/* ── Step 3: Automated Actions Pipeline ─────────────────────────── */}
        <PolarisFormCard
          step={3}
          title="Automated Actions Pipeline"
          description="Configure the privileges, emails, circles, and tags that are triggered automatically for matching members."
          icon={Sparkles}
        >
          <div className="space-y-3">
            <ActionBuilder actions={actions} onChange={setActions} />
          </div>
        </PolarisFormCard>
      </PolarisFormLayout>

      {/* Floating Save Panel */}
      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={savedState}
        isSaving={loading}
        onSave={() => handleSubmit()}
        onReset={handleReset}
        title="Unsaved rule changes"
        buttonText={isEdit ? "Update Rule" : "Create Rule"}
      />
    </form>
  );
};
