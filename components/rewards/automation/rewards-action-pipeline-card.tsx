"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Trophy,
  ShieldAlert,
  Coins,
  DollarSign,
  Gift,
  Award,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ActionBuilder } from "@/components/members/settings/rules/action-builder";
import { MemberRuleActionInput } from "@/graphql/member-automation";
import {
  RewardRuleActionInput,
  RewardRuleActionType,
} from "@/graphql/rewards-automation";
import { cn } from "@/lib/utils";

interface RewardsActionPipelineCardProps {
  actions: RewardRuleActionInput[];
  onActionsChange: (actions: RewardRuleActionInput[]) => void;
  trigger?: string;
  hasNoPath?: boolean;
}

const isNoTrack = (branch?: string | null) => {
  return (
    branch === "no" ||
    branch === "branch_1_no" ||
    (typeof branch === "string" && branch.endsWith("_no"))
  );
};

export const RewardsActionPipelineCard: React.FC<
  RewardsActionPipelineCardProps
> = ({ actions, onActionsChange, trigger = "SPIN_WHEEL_PLAYED", hasNoPath = true }) => {
  const [activeTrack, setActiveTrack] = useState<"yes" | "no">("yes");

  // Split actions into YES (Prize / Win) and NO (Consolation / Fallback)
  const yesActions = actions.filter((a) => !isNoTrack(a.branch));
  const noActions = actions.filter((a) => isNoTrack(a.branch));

  const currentTrackActions = activeTrack === "yes" ? yesActions : noActions;
  const currentBranchName = activeTrack === "yes" ? "branch_1_yes" : "branch_1_no";

  // Convert current track's Reward actions to MemberRuleActionInput for ActionBuilder
  const toMemberActions = (rewardActions: RewardRuleActionInput[]): MemberRuleActionInput[] => {
    return rewardActions
      .filter((a) =>
        [
          "ASSIGN_MEMBERSHIP_TIER",
          "COMMUNITY_JOIN",
          "EMAIL",
          "NOTIFICATION",
          "ADD_MEMBER_TAG",
          "CUSTOM_WEBHOOK",
          "WEBHOOK",
          "AWARD_POINTS",
        ].includes(a.type)
      )
      .map((a) => ({
        type: a.type as any,
        branch: a.branch || undefined,
        tierId: a.tierId || undefined,
        templateId: a.templateId || undefined,
        emailSubject: a.emailSubject || undefined,
        emailBody: a.emailBody || undefined,
        communityId: a.communityId || undefined,
        tags: a.tags || undefined,
        notificationMessage: a.notificationMessage || undefined,
        pushTitle: a.pushTitle || undefined,
        pushBody: a.pushBody || undefined,
        push: a.push ?? undefined,
        points:
          typeof a.points === "object" && a.points !== null
            ? a.points.points
            : typeof a.points === "number"
            ? a.points
            : undefined,
        webhook: a.webhook
          ? {
              url: a.webhook.url || "",
              method: a.webhook.method || "POST",
              headers: a.webhook.headers || [],
            }
          : undefined,
      }));
  };

  // Merge changes from ActionBuilder back into the full actions array
  const handleMemberActionsChange = (nextMemberActions: MemberRuleActionInput[]) => {
    // Keep custom reward actions (AWARD_CURRENCY, ISSUE_COUPON, AWARD_BADGE) for this track
    const extraRewardActions = currentTrackActions.filter(
      (a) => !["ASSIGN_MEMBERSHIP_TIER", "COMMUNITY_JOIN", "EMAIL", "NOTIFICATION", "ADD_MEMBER_TAG", "CUSTOM_WEBHOOK", "WEBHOOK", "AWARD_POINTS"].includes(a.type)
    );

    const convertedBack: RewardRuleActionInput[] = nextMemberActions.map((m) => {
      const existing = currentTrackActions.find((a) => a.type === m.type);
      return {
        type: m.type as RewardRuleActionType,
        branch: currentBranchName,
        tierId: m.tierId || null,
        tierName: existing?.tierName || null,
        templateId: m.templateId || null,
        emailSubject: m.emailSubject || null,
        emailBody: m.emailBody || null,
        pushTitle: m.pushTitle || null,
        pushBody: m.pushBody || null,
        notificationMessage: m.notificationMessage || null,
        push: m.push ?? null,
        points: m.type === "AWARD_POINTS" ? { points: Number(m.points) || 50 } : null,
        tags: m.tags || null,
        webhook: m.webhook ? {
          url: m.webhook.url,
          method: m.webhook.method,
          headers: m.webhook.headers || [],
        } : null,
      };
    });

    const newTrackActions = [...convertedBack, ...extraRewardActions];

    // Combine with the other track's actions unchanged
    if (activeTrack === "yes") {
      onActionsChange([...newTrackActions, ...noActions]);
    } else {
      onActionsChange([...yesActions, ...newTrackActions]);
    }
  };

  // Handlers for Extra Gamification Actions (Currency, Coupon, Badge)
  const currencyAction = currentTrackActions.find((a) => a.type === "AWARD_CURRENCY");
  const isCurrencyActive = Boolean(currencyAction);

  const toggleCurrencyAction = (enabled: boolean) => {
    if (!enabled) {
      const updated = currentTrackActions.filter((a) => a.type !== "AWARD_CURRENCY");
      onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
    } else {
      const newAction: RewardRuleActionInput = {
        type: "AWARD_CURRENCY",
        branch: currentBranchName,
        currency: { amount: 10, currencyType: "TC" },
      };
      const updated = [...currentTrackActions, newAction];
      onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
    }
  };

  const updateCurrencyAction = (patch: { amount?: number; currencyType?: string }) => {
    const updated = currentTrackActions.map((a) => {
      if (a.type !== "AWARD_CURRENCY") return a;
      return {
        ...a,
        currency: {
          amount: patch.amount !== undefined ? patch.amount : a.currency?.amount || 10,
          currencyType: patch.currencyType !== undefined ? patch.currencyType : a.currency?.currencyType || "TC",
        },
      };
    });
    onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
  };

  // Coupon Action
  const couponAction = currentTrackActions.find((a) => a.type === "ISSUE_COUPON");
  const isCouponActive = Boolean(couponAction);

  const toggleCouponAction = (enabled: boolean) => {
    if (!enabled) {
      const updated = currentTrackActions.filter((a) => a.type !== "ISSUE_COUPON");
      onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
    } else {
      const newAction: RewardRuleActionInput = {
        type: "ISSUE_COUPON",
        branch: currentBranchName,
        reward: { rewardTitle: "10% Discount Voucher", rewardId: "voucher_1" },
      };
      const updated = [...currentTrackActions, newAction];
      onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
    }
  };

  const updateCouponAction = (title: string) => {
    const updated = currentTrackActions.map((a) => {
      if (a.type !== "ISSUE_COUPON") return a;
      return {
        ...a,
        reward: {
          rewardId: a.reward?.rewardId || "voucher_1",
          rewardTitle: title,
        },
      };
    });
    onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
  };

  // Badge Action
  const badgeAction = currentTrackActions.find((a) => a.type === "AWARD_BADGE");
  const isBadgeActive = Boolean(badgeAction);

  const toggleBadgeAction = (enabled: boolean) => {
    if (!enabled) {
      const updated = currentTrackActions.filter((a) => a.type !== "AWARD_BADGE");
      onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
    } else {
      const newAction: RewardRuleActionInput = {
        type: "AWARD_BADGE",
        branch: currentBranchName,
        badge: { badgeName: "Master Player", badgeId: "badge_1" },
      };
      const updated = [...currentTrackActions, newAction];
      onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
    }
  };

  const updateBadgeAction = (name: string) => {
    const updated = currentTrackActions.map((a) => {
      if (a.type !== "AWARD_BADGE") return a;
      return {
        ...a,
        badge: {
          badgeId: a.badge?.badgeId || "badge_1",
          badgeName: name,
        },
      };
    });
    onActionsChange(activeTrack === "yes" ? [...updated, ...noActions] : [...yesActions, ...updated]);
  };

  return (
    <PolarisFormCard
      step={3}
      title="Automated Actions Pipeline (Dual-Track)"
      description="Configure prize fulfillment and consolation fallback actions. Reuses the complete Action Builder from Member Automation for email, push, tiers, and tags."
      icon={Sparkles}
    >
      <div className="space-y-4">
        {/* Track Switcher (YES Path vs NO Path) */}
        <div className="p-2.5 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Execution Outcome Track
            </span>
            <p className="text-[11px] text-muted-foreground">
              Define actions for winner prizes or consolation fallback on non-winning spins.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-background p-1 rounded-lg border border-border shrink-0">
            <button
              type="button"
              onClick={() => setActiveTrack("yes")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
                activeTrack === "yes"
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Trophy className="w-3.5 h-3.5" />
              YES Track (Win)
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] px-1 py-0 h-4 border-emerald-400 font-extrabold",
                  activeTrack === "yes" ? "bg-emerald-600 text-white" : "text-emerald-600"
                )}
              >
                {yesActions.length}
              </Badge>
            </button>

            <button
              type="button"
              onClick={() => setActiveTrack("no")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
                activeTrack === "no"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              NO Track (Consolation)
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] px-1 py-0 h-4 border-violet-400 font-extrabold",
                  activeTrack === "no" ? "bg-violet-700 text-white" : "text-violet-600"
                )}
              >
                {noActions.length}
              </Badge>
            </button>
          </div>
        </div>

        {/* Current Track Banner */}
        <div
          className={cn(
            "p-3 rounded-xl border flex items-center justify-between text-xs",
            activeTrack === "yes"
              ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200"
              : "bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900 text-violet-800 dark:text-violet-200"
          )}
        >
          <div className="flex items-center gap-2">
            {activeTrack === "yes" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
            )}
            <span className="font-semibold">
              Configuring actions for:{" "}
              <strong>
                {activeTrack === "yes" ? "WIN / PRIZE OUTCOME" : "CONSOLATION / ELSE OUTCOME"}
              </strong>
            </span>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-extrabold uppercase",
              activeTrack === "yes"
                ? "border-emerald-400 text-emerald-700 dark:text-emerald-300"
                : "border-violet-400 text-violet-700 dark:text-violet-300"
            )}
          >
            {currentTrackActions.length} Actions in Track
          </Badge>
        </div>

        {/* ── Gamification Action 1: Credit Virtual Currency ── */}
        <div
          className={cn(
            "p-4 rounded-xl border transition-all",
            isCurrencyActive
              ? "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60 shadow-xs"
              : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                  isCurrencyActive
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                )}
              >
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 flex-wrap">
                  Credit Virtual Currency
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40"
                  >
                    Gamification Wallet
                  </Badge>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Directly top up token coins, chips, or loyalty wallet balance for this track.
                </p>
              </div>
            </div>

            <Switch
              checked={isCurrencyActive}
              onCheckedChange={toggleCurrencyAction}
            />
          </div>

          {isCurrencyActive && (
            <div className="mt-3.5 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  Currency Amount
                </label>
                <Input
                  type="number"
                  value={currencyAction?.currency?.amount || 0}
                  onChange={(e) =>
                    updateCurrencyAction({ amount: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="h-8 text-xs font-bold"
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">
                  Currency Code / Symbol
                </label>
                <Input
                  value={currencyAction?.currency?.currencyType || "TC"}
                  onChange={(e) =>
                    updateCurrencyAction({ currencyType: e.target.value.toUpperCase() })
                  }
                  className="h-8 text-xs font-bold uppercase"
                  placeholder="e.g. TC, COINS"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Gamification Action 2: Issue Voucher / Coupon ── */}
        <div
          className={cn(
            "p-4 rounded-xl border transition-all",
            isCouponActive
              ? "bg-rose-50/30 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/60 shadow-xs"
              : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                  isCouponActive
                    ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xs"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                )}
              >
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 flex-wrap">
                  Issue Voucher / Coupon
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40"
                  >
                    Rewards & Offers
                  </Badge>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Grant a voucher, discount coupon code, or prize claim ticket to the participant.
                </p>
              </div>
            </div>

            <Switch
              checked={isCouponActive}
              onCheckedChange={toggleCouponAction}
            />
          </div>

          {isCouponActive && (
            <div className="mt-3.5 pt-3 border-t border-rose-200/60 dark:border-rose-900/40">
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                Reward Voucher Title
              </label>
              <Input
                value={couponAction?.reward?.rewardTitle || ""}
                onChange={(e) => updateCouponAction(e.target.value)}
                className="h-8 text-xs font-semibold"
                placeholder="e.g. 20% Off Storewide or Free Coffee Coupon"
              />
            </div>
          )}
        </div>

        {/* ── Gamification Action 3: Award Gamification Badge ── */}
        <div
          className={cn(
            "p-4 rounded-xl border transition-all",
            isBadgeActive
              ? "bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/60 shadow-xs"
              : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                  isBadgeActive
                    ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-xs"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                )}
              >
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 flex-wrap">
                  Award Gamification Badge
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40"
                  >
                    Achievement
                  </Badge>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Unlock an achievement badge on the member's profile for winning this game.
                </p>
              </div>
            </div>

            <Switch
              checked={isBadgeActive}
              onCheckedChange={toggleBadgeAction}
            />
          </div>

          {isBadgeActive && (
            <div className="mt-3.5 pt-3 border-t border-amber-200/60 dark:border-amber-900/40">
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                Badge Title / Achievement Name
              </label>
              <Input
                value={badgeAction?.badge?.badgeName || ""}
                onChange={(e) => updateBadgeAction(e.target.value)}
                className="h-8 text-xs font-semibold"
                placeholder="e.g. Lucky Spinner 🎡 or Streak Champion 🏆"
              />
            </div>
          )}
        </div>

        {/* ── Reusable ActionBuilder from /members/automation ── */}
        <div className="pt-2">
          <div className="pb-2 border-b border-border flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Member & Communication Actions (Shared with Member Automation)
            </span>
            <span className="text-[11px] text-muted-foreground">
              Tier, Tag, Email Studio, Push & Webhooks
            </span>
          </div>

          <ActionBuilder
            actions={toMemberActions(currentTrackActions)}
            onChange={handleMemberActionsChange}
            trigger={trigger}
          />
        </div>
      </div>
    </PolarisFormCard>
  );
};
