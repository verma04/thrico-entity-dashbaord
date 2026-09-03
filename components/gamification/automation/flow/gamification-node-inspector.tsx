"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import {
  GamificationModuleType,
  AnyGamificationTrigger,
  AnyGamificationActionType,
  GamificationActionInputPayload,
  GamificationRuleConditionInput,
  getPointRuleDisplay,
} from "@/graphql/gamification-automation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import {
  X,
  Sliders,
  Sparkles,
  Zap,
  Plus,
  Trash2,
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  Coins,
  Medal,
  Crown,
  Trophy,
} from "lucide-react";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import { GET_EMAIL_TEMPLATES } from "@/graphql/quries/email";
import { GET_COMMUNITIES } from "@/graphql/quries/group/approval";
import {
  useGetPointRules,
  useGetBadges,
  useGetRanks,
} from "@/graphql/actions/gamification/gamification-quiries";

export type SelectedGamificationNode =
  | { type: "trigger" }
  | { type: "condition" }
  | { type: "action"; index: number }
  | null;

interface GamificationNodeInspectorProps {
  selectedNode: SelectedGamificationNode;
  onClose: () => void;
  module: GamificationModuleType;
  onModuleChange: (mod: GamificationModuleType) => void;
  targetId?: string | null;
  onTargetIdChange: (id: string | null) => void;
  trigger: AnyGamificationTrigger;
  onTriggerChange: (t: AnyGamificationTrigger) => void;
  conditionOperator: "AND" | "OR";
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  conditions: GamificationRuleConditionInput[];
  onConditionsChange: (conds: GamificationRuleConditionInput[]) => void;
  actions: GamificationActionInputPayload[];
  onActionsChange: (actions: GamificationActionInputPayload[]) => void;
}

export const GamificationNodeInspector: React.FC<
  GamificationNodeInspectorProps
> = ({
  selectedNode,
  onClose,
  module,
  onModuleChange,
  targetId,
  onTargetIdChange,
  trigger,
  onTriggerChange,
  conditionOperator,
  onConditionOperatorChange,
  conditions,
  onConditionsChange,
  actions,
  onActionsChange,
}) => {
  // Query dropdown options
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

  if (!selectedNode) return null;

  // Available Triggers based on Module
  const getTriggers = () => {
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
            label: "Position Changed",
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
  };

  // Available Actions
  const availableActionTypes: {
    value: AnyGamificationActionType;
    label: string;
    icon: any;
  }[] = [
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
    { value: "AWARD_CURRENCY", label: "Award Currency (EC/TC)", icon: Coins },
  ];

  return (
    <div className="w-[360px] h-full border-l border-border bg-card p-4 overflow-y-auto space-y-4 shadow-lg z-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {selectedNode.type === "trigger"
              ? "Trigger Settings"
              : selectedNode.type === "condition"
              ? "Evaluation Criteria"
              : `Action #${selectedNode.index + 1} Configuration`}
          </h4>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* ──────────────── Trigger Inspector ──────────────── */}
      {selectedNode.type === "trigger" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <PolarisLabel required>Engine Module</PolarisLabel>
            <Select
              value={module}
              onValueChange={(val) =>
                onModuleChange(val as GamificationModuleType)
              }
            >
              <SelectTrigger className="h-9 rounded-lg border-border text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POINTS" className="text-xs font-medium">
                  🪙 Points Automation
                </SelectItem>
                <SelectItem value="BADGES" className="text-xs font-medium">
                  🏅 Badges Automation
                </SelectItem>
                <SelectItem value="RANKS" className="text-xs font-medium">
                  👑 Ranks Automation
                </SelectItem>
                <SelectItem value="LEADERBOARD" className="text-xs font-medium">
                  🏆 Leaderboard Automation
                </SelectItem>
                <SelectItem value="CURRENCY" className="text-xs font-medium">
                  💰 Currency Automation
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <PolarisLabel required>Trigger Event</PolarisLabel>
            <Select
              value={trigger}
              onValueChange={(val) =>
                onTriggerChange(val as AnyGamificationTrigger)
              }
            >
              <SelectTrigger className="h-9 rounded-lg border-border text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getTriggers().map((t) => (
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

          {module === "POINTS" && (
            <div className="space-y-1.5">
              <PolarisLabel>Scope to Points Rule</PolarisLabel>
              <Select
                value={targetId || "ALL"}
                onValueChange={(val) =>
                  onTargetIdChange(val === "ALL" ? "" : val)
                }
              >
                <SelectTrigger className="h-9 rounded-lg border-border text-xs font-medium">
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
              <PolarisLabel>Scope to Badge</PolarisLabel>
              <Select
                value={targetId || "ALL"}
                onValueChange={(val) =>
                  onTargetIdChange(val === "ALL" ? "" : val)
                }
              >
                <SelectTrigger className="h-9 rounded-lg border-border text-xs font-medium">
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
              <PolarisLabel>Scope to Rank</PolarisLabel>
              <Select
                value={targetId || "ALL"}
                onValueChange={(val) =>
                  onTargetIdChange(val === "ALL" ? "" : val)
                }
              >
                <SelectTrigger className="h-9 rounded-lg border-border text-xs font-medium">
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
        </div>
      )}

      {/* ──────────────── Criteria Inspector ──────────────── */}
      {selectedNode.type === "condition" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <PolarisLabel>Criteria Gate Logic</PolarisLabel>
            <Select
              value={conditionOperator}
              onValueChange={(val: "AND" | "OR") =>
                onConditionOperatorChange(val)
              }
            >
              <SelectTrigger className="h-7 w-28 text-xs font-bold">
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

          <div className="space-y-2.5">
            {conditions.map((cond, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl border border-border bg-muted/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">
                    #{i + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onConditionsChange(conditions.filter((_, idx) => idx !== i))
                    }
                    className="h-5 w-5 text-muted-foreground hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <PolarisInput
                    value={cond.field}
                    onChange={(e) => {
                      const updated = [...conditions];
                      updated[i] = { ...updated[i], field: e.target.value };
                      onConditionsChange(updated);
                    }}
                    placeholder="field (e.g. totalPoints)"
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={cond.operator}
                    onValueChange={(val) => {
                      const updated = [...conditions];
                      updated[i] = { ...updated[i], operator: val };
                      onConditionsChange(updated);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">=" className="font-mono text-xs">
                        &gt;=
                      </SelectItem>
                      <SelectItem value="<=" className="font-mono text-xs">
                        &lt;=
                      </SelectItem>
                      <SelectItem value="==" className="font-mono text-xs">
                        ==
                      </SelectItem>
                      <SelectItem value="!=" className="font-mono text-xs">
                        !=
                      </SelectItem>
                      <SelectItem value=">" className="font-mono text-xs">
                        &gt;
                      </SelectItem>
                      <SelectItem value="<" className="font-mono text-xs">
                        &lt;
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <PolarisInput
                    value={cond.value ?? ""}
                    onChange={(e) => {
                      const updated = [...conditions];
                      updated[i] = { ...updated[i], value: e.target.value };
                      onConditionsChange(updated);
                    }}
                    placeholder="value"
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onConditionsChange([
                  ...conditions,
                  { field: "totalPoints", operator: ">=", value: 100 },
                ])
              }
              className="w-full text-xs h-8 gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Condition
            </Button>
          </div>
        </div>
      )}

      {/* ──────────────── Action Inspector ──────────────── */}
      {selectedNode.type === "action" && (
        <div className="space-y-4">
          {(() => {
            const action = actions[selectedNode.index];
            if (!action) return null;

            const updateCurrentAction = (
              updates: Partial<GamificationActionInputPayload>
            ) => {
              const newActions = [...actions];
              newActions[selectedNode.index] = { ...action, ...updates };
              onActionsChange(newActions);
            };

            return (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <PolarisLabel required>Action Type</PolarisLabel>
                  <Select
                    value={action.type}
                    onValueChange={(val) =>
                      updateCurrentAction({
                        type: val as AnyGamificationActionType,
                      })
                    }
                  >
                    <SelectTrigger className="h-9 rounded-lg border-border text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableActionTypes.map((at) => (
                        <SelectItem
                          key={at.value}
                          value={at.value}
                          className="text-xs font-medium py-1.5"
                        >
                          {at.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Action Forms */}
                {action.type === "ASSIGN_MEMBERSHIP_TIER" && (
                  <div className="space-y-1.5">
                    <PolarisLabel required>Membership Tier</PolarisLabel>
                    <Select
                      value={action.tier?.tierId || action.tierId || ""}
                      onValueChange={(val) =>
                        updateCurrentAction({
                          tier: { tierId: val },
                          tierId: val,
                        })
                      }
                    >
                      <SelectTrigger className="h-9 rounded-lg text-xs font-medium">
                        <SelectValue placeholder="Select Tier" />
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

                {action.type === "EMAIL" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <PolarisLabel required>Subject</PolarisLabel>
                      <PolarisInput
                        value={
                          action.email?.subject || action.emailSubject || ""
                        }
                        onChange={(e) =>
                          updateCurrentAction({
                            email: {
                              ...action.email,
                              subject: e.target.value,
                            },
                            emailSubject: e.target.value,
                          })
                        }
                        placeholder="e.g. Congratulations!"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <PolarisLabel required>Body Content</PolarisLabel>
                      <textarea
                        value={action.email?.body || action.emailBody || ""}
                        onChange={(e) =>
                          updateCurrentAction({
                            email: {
                              ...action.email,
                              body: e.target.value,
                            },
                            emailBody: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full rounded-lg border border-border bg-card p-2 text-xs"
                      />
                    </div>
                  </div>
                )}

                {action.type === "NOTIFICATION" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <PolarisLabel required>Push Title</PolarisLabel>
                      <PolarisInput
                        value={
                          action.notification?.pushTitle ||
                          action.pushTitle ||
                          ""
                        }
                        onChange={(e) =>
                          updateCurrentAction({
                            notification: {
                              ...action.notification,
                              pushTitle: e.target.value,
                            },
                            pushTitle: e.target.value,
                          })
                        }
                        placeholder="Push Alert Title"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <PolarisLabel required>Message</PolarisLabel>
                      <PolarisInput
                        value={
                          action.notification?.message ||
                          action.notificationMessage ||
                          ""
                        }
                        onChange={(e) =>
                          updateCurrentAction({
                            notification: {
                              ...action.notification,
                              message: e.target.value,
                            },
                            notificationMessage: e.target.value,
                          })
                        }
                        placeholder="Notification alert message"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Switch
                        checked={
                          action.notification?.push ?? action.push ?? true
                        }
                        onCheckedChange={(checked) =>
                          updateCurrentAction({
                            notification: {
                              ...action.notification,
                              push: checked,
                            },
                            push: checked,
                          })
                        }
                      />
                      <span className="text-xs text-muted-foreground font-medium">
                        Device Push Alert
                      </span>
                    </div>
                  </div>
                )}

                {action.type === "COMMUNITY_JOIN" && (
                  <div className="space-y-1.5">
                    <PolarisLabel required>Target Circle</PolarisLabel>
                    <Select
                      value={
                        action.community?.communityId ||
                        action.communityId ||
                        ""
                      }
                      onValueChange={(val) =>
                        updateCurrentAction({
                          community: { communityId: val },
                          communityId: val,
                        })
                      }
                    >
                      <SelectTrigger className="h-9 rounded-lg text-xs font-medium">
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

                {action.type === "ADD_MEMBER_TAG" && (
                  <div className="space-y-1.5">
                    <PolarisLabel required>
                      Tags (Comma-separated)
                    </PolarisLabel>
                    <PolarisInput
                      value={(action.tag?.tags || action.tags || []).join(", ")}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        updateCurrentAction({
                          tag: { tags },
                          tags,
                        });
                      }}
                      placeholder="e.g. top-earner, gold-member"
                    />
                  </div>
                )}

                {action.type === "AWARD_POINTS" && (
                  <div className="space-y-1.5">
                    <PolarisLabel required>Bonus Points</PolarisLabel>
                    <PolarisInput
                      type="number"
                      value={action.points?.points ?? 100}
                      onChange={(e) =>
                        updateCurrentAction({
                          points: { points: Number(e.target.value) },
                        })
                      }
                      className="font-mono"
                    />
                  </div>
                )}

                {action.type === "AWARD_BADGE" && (
                  <div className="space-y-1.5">
                    <PolarisLabel required>Select Badge</PolarisLabel>
                    <Select
                      value={action.badge?.badgeId || action.badgeId || ""}
                      onValueChange={(val) =>
                        updateCurrentAction({
                          badge: { badgeId: val },
                          badgeId: val,
                        })
                      }
                    >
                      <SelectTrigger className="h-9 rounded-lg text-xs font-medium">
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

                {action.type === "AWARD_CURRENCY" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <PolarisLabel required>Currency Wallet</PolarisLabel>
                      <Select
                        value={
                          action.currency?.currencyType ||
                          action.currencyType ||
                          "TC"
                        }
                        onValueChange={(val: "EC" | "TC") =>
                          updateCurrentAction({
                            currency: {
                              amount:
                                action.currency?.amount ||
                                action.currencyAmount ||
                                50,
                              currencyType: val,
                            },
                            currencyType: val,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs font-semibold">
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
                          action.currency?.amount ??
                          action.currencyAmount ??
                          50
                        }
                        onChange={(e) =>
                          updateCurrentAction({
                            currency: {
                              amount: Number(e.target.value),
                              currencyType:
                                (action.currency?.currencyType ||
                                  action.currencyType ||
                                  "TC") as "EC" | "TC",
                            },
                            currencyAmount: Number(e.target.value),
                          })
                        }
                        className="font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
