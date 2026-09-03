"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  CurrencyRuleTrigger,
  CurrencyRuleActionType,
  GamificationActionInputPayload,
  GamificationRuleConditionInput,
  CurrencyAutomationRule,
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
  Coins,
  Zap,
  Sliders,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  Medal,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { CurrencyFlowBuilder } from "./flow/currency-flow-builder";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import { GET_EMAIL_TEMPLATES } from "@/graphql/quries/email";
import { GET_COMMUNITIES } from "@/graphql/quries/group/approval";
import { useGetBadges } from "@/graphql/actions/gamification/gamification-quiries";

interface CurrencyAutomationFormProps {
  initialValues?: CurrencyAutomationRule | null;
  onSave: (input: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export const CurrencyAutomationForm: React.FC<CurrencyAutomationFormProps> = ({
  initialValues,
  onSave,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const [viewMode, setViewMode] = useState<"flow" | "form">("flow");

  // Form State
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [trigger, setTrigger] = useState<CurrencyRuleTrigger>(
    initialValues?.trigger || "EC_EARNED"
  );
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
          currency: a.currency?.amount
            ? {
                amount: a.currency.amount,
                currencyType: a.currency.currencyType,
              }
            : undefined,
          currencyAmount: a.currency?.amount || a.currencyAmount || undefined,
          currencyType: a.currency?.currencyType || a.currencyType || undefined,
        }))
      : [
          {
            type: "AWARD_CURRENCY",
            currency: { amount: 50, currencyType: "TC" },
            currencyAmount: 50,
            currencyType: "TC",
          },
        ]
  );

  const [isActive, setIsActive] = useState(
    initialValues?.isActive !== undefined ? initialValues.isActive : true
  );
  const [priority, setPriority] = useState<number>(
    initialValues?.priority || 1
  );

  // Queries
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

  const { data: badgesData } = useGetBadges();
  const badgesList: any[] = badgesData?.getBadges || [];

  const currencyTriggers: { value: CurrencyRuleTrigger; label: string }[] = [
    { value: "EC_EARNED", label: "🪙 Entity Currency (EC) Earned" },
    { value: "TC_COINS_EARNED", label: "🪙 Thrico Coins (TC) Earned" },
    {
      value: "CURRENCY_THRESHOLD_REACHED",
      label: "🎯 Wallet Balance Milestone",
    },
    { value: "CURRENCY_CONVERTED", label: "🔄 Currency Converted" },
    { value: "REDEMPTION_COMPLETED", label: "🎁 Reward Redeemed" },
    {
      value: "DAILY_CONVERSION_CAP_REACHED",
      label: "🛑 Daily Conversion Cap Hit",
    },
  ];

  const availableActionTypes: {
    value: CurrencyRuleActionType;
    label: string;
    icon: any;
  }[] = [
    {
      value: "AWARD_CURRENCY",
      label: "Award Currency (EC/TC)",
      icon: Coins,
    },
    {
      value: "ASSIGN_MEMBERSHIP_TIER",
      label: "Assign Membership Tier",
      icon: Award,
    },
    { value: "NOTIFICATION", label: "Push Notification", icon: Bell },
    { value: "EMAIL", label: "Send Email", icon: Mail },
    { value: "COMMUNITY_JOIN", label: "Circle Access", icon: Users },
    { value: "ADD_MEMBER_TAG", label: "Add Member Tags", icon: Tag },
    { value: "AWARD_POINTS", label: "Award Bonus Points", icon: Coins },
    { value: "AWARD_BADGE", label: "Award Milestone Badge", icon: Medal },
  ];

  // Actions handlers
  const handleAddAction = () => {
    setActions((prev) => [
      ...prev,
      {
        type: "AWARD_CURRENCY",
        currency: { amount: 50, currencyType: "TC" },
        currencyAmount: 50,
        currencyType: "TC",
      },
    ]);
  };

  const handleUpdateAction = (
    index: number,
    updates: Partial<GamificationActionInputPayload>
  ) => {
    setActions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleDuplicateAction = (index: number) => {
    setActions((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, { ...copy[index] });
      return copy;
    });
    toast.success("Action duplicated.");
  };

  const handleDeleteAction = (index: number) => {
    if (actions.length === 1) {
      toast.error("At least one action is required.");
      return;
    }
    setActions((prev) => prev.filter((_, i) => i !== index));
    toast.info("Action removed.");
  };

  // Conditions handlers
  const handleAddCondition = () => {
    setConditions((prev) => [
      ...prev,
      { field: "context.ecAmount", operator: ">=", value: 500 },
    ]);
  };

  const handleUpdateCondition = (
    index: number,
    field: keyof GamificationRuleConditionInput,
    val: any
  ) => {
    setConditions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleDeleteCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please provide a name for this currency automation rule.");
      return;
    }

    if (actions.length === 0) {
      toast.error("At least one automated action is required.");
      return;
    }

    const formattedActions = actions.map((a) => {
      const payload: any = {
        type: a.type,
      };

      if (a.type === "AWARD_CURRENCY") {
        const amt = Number(a.currency?.amount || a.currencyAmount || 50);
        const cType = (a.currency?.currencyType || a.currencyType || "TC") as
          | "EC"
          | "TC";
        payload.currency = { amount: amt, currencyType: cType };
        payload.currencyAmount = amt;
        payload.currencyType = cType;
      } else if (a.type === "ASSIGN_MEMBERSHIP_TIER") {
        const tId = a.tier?.tierId || a.tierId || "";
        payload.tier = { tierId: tId };
        payload.tierId = tId;
      } else if (a.type === "EMAIL") {
        payload.email = {
          subject: a.email?.subject || a.emailSubject || "Wallet Update",
          body: a.email?.body || a.emailBody || "",
          templateId: a.email?.templateId || a.templateId || undefined,
        };
        payload.emailSubject = a.email?.subject || a.emailSubject;
        payload.emailBody = a.email?.body || a.emailBody;
        payload.templateId = a.email?.templateId || a.templateId;
      } else if (a.type === "NOTIFICATION") {
        payload.notification = {
          pushTitle: a.notification?.pushTitle || a.pushTitle || "Wallet Alert",
          message:
            a.notification?.message || a.notificationMessage || "Balance Updated",
          push: a.notification?.push ?? a.push ?? true,
        };
        payload.pushTitle = a.notification?.pushTitle || a.pushTitle;
        payload.pushBody =
          a.notification?.pushBody || a.pushBody || a.notification?.message;
        payload.notificationMessage =
          a.notification?.message || a.notificationMessage;
        payload.push = a.notification?.push ?? a.push ?? true;
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
      }

      return payload;
    });

    const baseInput = {
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

    try {
      await onSave(baseInput);
    } catch (err: any) {
      toast.error(err.message || "Failed to save currency rule.");
    }
  };

  // Render Visual Canvas when viewMode === "flow"
  if (viewMode === "flow") {
    return (
      <CurrencyFlowBuilder
        name={name}
        description={description}
        trigger={trigger}
        conditionOperator={conditionOperator}
        conditions={conditions}
        actions={actions}
        isActive={isActive}
        priority={priority}
        onNameChange={setName}
        onDescriptionChange={setDescription}
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

  // Render Polaris Form Layout when viewMode === "form"
  return (
    <PolarisFormLayout
      sidebar={
        <>
          {/* Status & Priority Card */}
          <PolarisSidebarCard title="Rule Controls" icon={Zap}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-foreground">
                    Rule Status
                  </h5>
                  <p className="text-[11px] text-muted-foreground">
                    Active rules run automatically upon trigger.
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <PolarisLabel>Execution Priority (1-10)</PolarisLabel>
                <Select
                  value={String(priority)}
                  onValueChange={(val) => setPriority(Number(val))}
                >
                  <SelectTrigger className="h-8 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                      <SelectItem
                        key={p}
                        value={String(p)}
                        className="text-xs font-semibold"
                      >
                        Priority #{p} {p === 1 ? "(Highest)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PolarisSidebarCard>

          {/* Configuration Summary */}
          <PolarisSidebarCard title="Currency Summary" icon={Sparkles}>
            <div className="space-y-1">
              <PolarisSummaryRow
                label="Module"
                value="Currency Engine"
              />
              <PolarisSummaryRow
                label="Trigger"
                value={trigger.replace(/_/g, " ")}
              />
              <PolarisSummaryRow
                label="Evaluation Gate"
                value={
                  conditions.length === 0
                    ? "Unconditional"
                    : `${conditionOperator} (${conditions.length})`
                }
              />
              <PolarisSummaryRow
                label="Action Steps"
                value={`${actions.length} action${actions.length === 1 ? "" : "s"}`}
              />
              <PolarisSummaryRow
                label="Status"
                value={
                  <Badge
                    variant="outline"
                    className={
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                    }
                  >
                    {isActive ? "Active" : "Paused"}
                  </Badge>
                }
              />
            </div>
          </PolarisSidebarCard>

          {/* Currency Automation Tips */}
          <PolarisTipCard title="Currency Rule Tips" icon={TrendingUp}>
            <ul className="space-y-2 text-[11px] text-muted-foreground list-disc pl-3 leading-relaxed">
              <li>
                Use <strong>EC_EARNED</strong> with{" "}
                <code>context.ecAmount &gt;= 500</code> to incentivize high
                spenders with bonus TC Coins.
              </li>
              <li>
                Use <strong>CURRENCY_THRESHOLD_REACHED</strong> to upgrade
                members to Gold or VIP tiers once their balance reaches a milestone.
              </li>
              <li>
                Pair <strong>REDEMPTION_COMPLETED</strong> with Circle access to
                create private clubs for active redeemers.
              </li>
            </ul>
          </PolarisTipCard>
        </>
      }
    >
      <div className="space-y-6">
        {/* View Mode Switcher Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isEdit
                  ? "Edit Currency Automation Rule"
                  : "Create Currency Automation Rule"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Configure wallet transactions, balance thresholds, and reward pipelines.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setViewMode("flow")}
            className="text-xs gap-1.5 font-bold border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Switch to Visual Canvas
          </Button>
        </div>

        {/* Step 1: Rule Details & Currency Trigger */}
        <PolarisFormCard
          step={1}
          title="Rule Details & Currency Trigger"
          description="Name your rule and select the wallet or conversion event that triggers this automation."
          icon={Coins}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <PolarisLabel required>Automation Rule Name</PolarisLabel>
              <PolarisInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. High EC Earner TC Coin Bonus & VIP Status"
              />
            </div>

            <div className="space-y-1.5">
              <PolarisLabel>Description (Optional)</PolarisLabel>
              <PolarisInput
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain when and why this rule executes…"
              />
            </div>

            <div className="space-y-1.5">
              <PolarisLabel required>Currency Trigger Event</PolarisLabel>
              <Select
                value={trigger}
                onValueChange={(val) => setTrigger(val as CurrencyRuleTrigger)}
              >
                <SelectTrigger className="h-9 rounded-lg border-border text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyTriggers.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className="text-xs font-medium py-1.5"
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 2: Evaluation Criteria */}
        <PolarisFormCard
          step={2}
          title="Condition Criteria (Optional)"
          description="Set conditional gates so this automation fires only when matching specific criteria (e.g. context.ecAmount >= 500, wallet.balance >= 1000)."
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
                  Gate Logic:
                </span>
                <Select
                  value={conditionOperator}
                  onValueChange={(val: "AND" | "OR") =>
                    setConditionOperator(val)
                  }
                >
                  <SelectTrigger className="h-7 w-24 text-xs font-bold">
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
              </div>
            )}

            {conditions.length === 0 ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  No condition criteria set. This automation will trigger
                  unconditionally on every matching currency event.
                </span>
              </div>
            ) : (
              conditions.map((cond, condIdx) => (
                <div
                  key={condIdx}
                  className="flex flex-col md:flex-row items-start md:items-center gap-2 p-3 rounded-xl border border-border bg-muted/30"
                >
                  <div className="flex-1 w-full">
                    <PolarisInput
                      value={cond.field}
                      onChange={(e) =>
                        handleUpdateCondition(condIdx, "field", e.target.value)
                      }
                      placeholder="Field (e.g. context.ecAmount)"
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="w-28">
                    <Select
                      value={cond.operator}
                      onValueChange={(val) =>
                        handleUpdateCondition(condIdx, "operator", val)
                      }
                    >
                      <SelectTrigger className="h-9 text-xs font-bold font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">=" className="font-mono text-xs">
                          &gt;= (Greater or Equal)
                        </SelectItem>
                        <SelectItem value="<=" className="font-mono text-xs">
                          &lt;= (Less or Equal)
                        </SelectItem>
                        <SelectItem value="==" className="font-mono text-xs">
                          == (Equal)
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

                  <div className="flex-1 w-full">
                    <PolarisInput
                      value={cond.value ?? ""}
                      onChange={(e) =>
                        handleUpdateCondition(condIdx, "value", e.target.value)
                      }
                      placeholder="Comparison Value"
                      className="font-mono text-xs"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCondition(condIdx)}
                    className="h-9 w-9 text-muted-foreground hover:text-rose-600 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </PolarisFormCard>

        {/* Step 3: Multi-Action Pipeline */}
        <PolarisFormCard
          step={3}
          title="Automated Action Pipeline"
          description="Configure the sequential actions executed when the wallet event occurs."
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
              const ActionIcon = ActionTypeMeta?.icon || Sparkles;

              return (
                <div
                  key={actIdx}
                  className="p-4 rounded-xl border border-border bg-card space-y-4 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-muted-foreground w-6">
                        #{actIdx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center">
                          <ActionIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-foreground">
                          {ActionTypeMeta?.label || act.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicateAction(actIdx)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAction(actIdx)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Type Selector */}
                  <div className="space-y-1.5">
                    <PolarisLabel required>Action Type</PolarisLabel>
                    <Select
                      value={act.type}
                      onValueChange={(val) =>
                        handleUpdateAction(actIdx, {
                          type: val as CurrencyRuleActionType,
                        })
                      }
                    >
                      <SelectTrigger className="h-9 rounded-lg border-border text-xs font-semibold">
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
                                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                {at.label}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* AWARD_CURRENCY */}
                  {act.type === "AWARD_CURRENCY" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <PolarisLabel required>Credit Destination Wallet</PolarisLabel>
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
                            act.currency?.amount ?? act.currencyAmount ?? 50
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
                  )}

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
                        <SelectTrigger className="h-9 rounded-lg border-border text-xs font-medium">
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
                          placeholder="e.g. You've earned bonus currency!"
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
                            placeholder="e.g. Wallet Balance Updated!"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <PolarisLabel required>Alert Message</PolarisLabel>
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
                            placeholder="e.g. Your conversion has settled."
                          />
                        </div>
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
                          Send Device Push Notification
                        </span>
                      </div>
                    </div>
                  )}

                  {/* COMMUNITY_JOIN */}
                  {act.type === "COMMUNITY_JOIN" && (
                    <div className="space-y-1.5">
                      <PolarisLabel required>Select Circle to Grant Access</PolarisLabel>
                      <Select
                        value={
                          act.community?.communityId ||
                          act.communityId ||
                          ""
                        }
                        onValueChange={(val) =>
                          handleUpdateAction(actIdx, {
                            community: { communityId: val },
                            communityId: val,
                          })
                        }
                      >
                        <SelectTrigger className="h-9 rounded-lg border-border text-xs font-medium">
                          <SelectValue placeholder="Select Circle" />
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
                      <PolarisLabel required>Member Tags (Comma-separated)</PolarisLabel>
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
                        placeholder="e.g. active-trader, top-wallet, vip-redeemer"
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
                        <SelectTrigger className="h-9 rounded-lg border-border text-xs font-medium">
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
                </div>
              );
            })}
          </div>
        </PolarisFormCard>
      </div>

      <FloatingSavePanel
        hasChanged={true}
        saved={false}
        isSaving={loading}
        onSave={handleSubmit}
        onReset={onCancel}
        saveButtonText={
          isEdit ? "Update Currency Rule" : "Create Currency Rule"
        }
        discardButtonText="Cancel"
      />
    </PolarisFormLayout>
  );
};
