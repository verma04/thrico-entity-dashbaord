"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  X,
  Zap,
  Filter,
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  Sparkles,
  Sliders,
  CheckCircle2,
  GitBranch,
  Check,
  ShieldCheck,
  Plus,
  Trash2,
  Eye,
  Smartphone,
  Info,
  Code2,
  School,
  Building,
  MapPin,
  Briefcase,
  ChevronRight,
  MessageSquare,
  Globe,
  AlertTriangle,
  Coins,
  UserPlus,
  UserX,
  UserMinus,
  Ban,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MEMBER_PALETTE_ACTIONS } from "@/components/shared/automation-flow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDefaultStarter } from "@/components/email/email-starters";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import { GET_EMAIL_TEMPLATES } from "@/graphql/quries/email";
import { GET_COMMUNITIES } from "@/graphql/quries/group/approval";
import {
  MemberRuleTrigger,
  MemberRuleConditionInput,
  MemberRuleActionInput,
  MemberRuleActionType,
} from "@/graphql/member-automation";
import {
  CONDITION_FIELDS,
  CONDITION_OPERATORS,
} from "@/components/members/settings/rules/condition-builder";
import { SelectedNodeInfo } from "./types";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";
import { EmailDomainSetupModal } from "@/components/members/automation/email-domain-setup-modal";
import { WebhookFieldMappingBuilder } from "@/components/members/automation/webhook-field-mapping";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
      "Evaluated immediately when a user signs up or accepts an invitation to join.",
    icon: UserPlus,
  },
  {
    value: "MEMBER_VERIFIED",
    label: "Identity / Profile Verified",
    badge: "Trust & KYC",
    description:
      "Triggered when identity KYC documents or university email are approved.",
    icon: ShieldCheck,
  },
  {
    value: "MEMBER_APPROVED",
    label: "Member Approved",
    badge: "Admin Approval",
    description:
      "Triggered when an administrator or verification gate approves the profile.",
    icon: CheckCircle2,
  },
  {
    value: "MEMBER_REJECTED",
    label: "Member Rejected",
    badge: "Declined",
    description:
      "Triggered when a member application or registration request is rejected.",
    icon: UserX,
  },
  {
    value: "MEMBER_DISABLED",
    label: "Account Disabled",
    badge: "Deactivated",
    description:
      "Triggered when a member profile is deactivated or temporarily suspended.",
    icon: UserMinus,
  },
  {
    value: "MEMBER_BLOCKED",
    label: "Member Blocked",
    badge: "Restricted",
    description:
      "Triggered when a member is blacklisted, banned, or safety-blocked.",
    icon: Ban,
  },
];

const TEMPLATE_VARIABLES = [
  { tag: "{{firstName}}", label: "First Name", sample: "Alex" },
  { tag: "{{lastName}}", label: "Last Name", sample: "Rivers" },
  { tag: "{{email}}", label: "Email", sample: "alex@stanford.edu" },
  { tag: "{{college}}", label: "College", sample: "Stanford University" },
  { tag: "{{city}}", label: "City", sample: "San Francisco" },
  { tag: "{{tierName}}", label: "Tier Name", sample: "Gold VIP" },
];

const SUGGESTED_TAGS = [
  "VIP",
  "Alumni",
  "Honor Roll",
  "Founder",
  "Mentor",
  "Investor",
  "Early Adopter",
  "Verified",
  "Student",
  "Partner",
];

const getActionBranchId = (action?: MemberRuleActionInput | null): string => {
  const b = action?.branch;
  if (!b || b === "yes" || b === "no") return "branch_1";
  if (b.endsWith("_yes")) return b.replace(/_yes$/, "");
  if (b.endsWith("_no")) return b.replace(/_no$/, "");
  return b;
};

const getActionPath = (action?: MemberRuleActionInput | null): "yes" | "no" => {
  const b = action?.branch;
  if (!b || b === "yes") return "yes";
  if (b === "no") return "no";
  if (b.endsWith("_no")) return "no";
  if (b.endsWith("_yes")) return "yes";
  return "yes";
};

const formatActionBranch = (branchId: string, path: "yes" | "no"): string => {
  if (branchId === "branch_1") {
    return path;
  }
  return `${branchId}_${path}`;
};

interface NodeInspectorProps {
  selectedNode: SelectedNodeInfo;
  trigger: MemberRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: MemberRuleConditionInput[];
  actions: MemberRuleActionInput[];
  branches?: Array<{ id: string; name: string; hasNoPath?: boolean }>;
  onTriggerChange: (trigger: MemberRuleTrigger) => void;
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: MemberRuleConditionInput[]) => void;
  onActionsChange?: (actions: MemberRuleActionInput[]) => void;
  onActionUpdate: (index: number, action: Partial<MemberRuleActionInput>) => void;
  onActionDelete: (index: number) => void;
  onDeleteBranch?: (branchId: string) => void;
  onDuplicateBranch?: (branchId: string) => void;
  onRenameBranch?: (branchId: string, name: string) => void;
  onToggleNoPath?: (branchId: string, enabled?: boolean) => void;
  onClose: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  selectedNode,
  trigger,
  conditionOperator,
  conditions,
  actions,
  branches = [{ id: "branch_1", name: "Branch 1 (Primary)" }],
  onTriggerChange,
  onConditionOperatorChange,
  onConditionsChange,
  onActionsChange,
  onActionUpdate,
  onActionDelete,
  onDeleteBranch,
  onDuplicateBranch,
  onRenameBranch,
  onToggleNoPath,
  onClose,
}) => {
  const { data: tiersData, loading: tiersLoading } =
    useQuery(GET_MEMBERSHIP_TIERS);
  const { data: emailsData, loading: emailsLoading } =
    useQuery(GET_EMAIL_TEMPLATES);
  const { data: communitiesData, loading: communitiesLoading } = useQuery(
    GET_COMMUNITIES,
    {
      variables: { input: {} },
    }
  );

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const { isVerified } = useEmailDomainStatus();
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const tiers: any[] = tiersData?.getMembershipTiers || [];
  const emailTemplates: any[] = emailsData?.getEmailTemplates || [];
  const communities: any[] =
    communitiesData?.getCommunities?.data ||
    communitiesData?.getAllCommunities ||
    [];

  if (!selectedNode) return null;

  // Condition Handlers
  const handleAddCondition = (presetField?: string, targetBranchId?: string) => {
    const targetBranch = targetBranchId || "branch_1";
    const fieldName = presetField || "profile.college";
    const fieldMeta = CONDITION_FIELDS.find((f) => f.value === fieldName);
    const isBool = fieldMeta?.type === "boolean";
    onConditionsChange([
      ...conditions,
      {
        field: fieldName,
        operator: isBool ? "equals" : "contains",
        value: isBool ? "true" : "",
        branch: targetBranch,
      },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    onConditionsChange(conditions.filter((_, i) => i !== index));
  };

  const handleUpdateCondition = (
    index: number,
    field: keyof MemberRuleConditionInput,
    val: any
  ) => {
    const updated = [...conditions];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    if (field === "field") {
      const fieldMeta = CONDITION_FIELDS.find((f) => f.value === val);
      if (fieldMeta?.type === "boolean") {
        updated[index].operator = "equals";
        if (updated[index].value !== "true" && updated[index].value !== "false") {
          updated[index].value = "true";
        }
      }
    }
    if (
      field === "operator" &&
      (val === "is_not_empty" || val === "is_empty")
    ) {
      updated[index].value = true;
    }
    onConditionsChange(updated);
  };

  const currentAction =
    selectedNode.type === "action" ? actions[selectedNode.index] : null;

  // Render preview helper
  const getRenderedPreview = () => {
    const raw = currentAction?.emailBody || getDefaultStarter("welcome");
    return raw
      .replace(/{{firstName}}/g, "Alex")
      .replace(/{{lastName}}/g, "Taylor")
      .replace(/{{member_name}}/g, "Alex Taylor")
      .replace(/{{email}}/g, "alex@example.com")
      .replace(/{{member_email}}/g, "alex@example.com")
      .replace(/{{entity_name}}/g, "Your Community")
      .replace(/{{college}}/g, "Stanford University")
      .replace(/{{city}}/g, "San Francisco")
      .replace(/{{tierName}}/g, "Gold Tier");
  };

  return (
    <aside className="w-[360px] xl:w-[400px] h-full bg-card border-l border-border flex flex-col shadow-xl animate-in slide-in-from-right duration-200 z-20">
      {/* Inspector Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block">
              Node Inspector
            </span>
            <h3 className="text-xs font-bold text-foreground">
              {selectedNode.type === "trigger" && "Trigger Event Configuration"}
              {selectedNode.type === "condition" && "Targeting Conditions & Match Logic"}
              {selectedNode.type === "action" && `Configure Action #${selectedNode.index + 1}`}
            </h3>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ── TRIGGER INSPECTOR ────────────────────────────────────────────── */}
        {selectedNode.type === "trigger" && (() => {
          const activeTriggerItem =
            TRIGGER_OPTIONS.find((t) => t.value === trigger) || TRIGGER_OPTIONS[0];
          return (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">
                  Lifecycle Trigger Configuration
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Determines when this automation workflow is initiated for members.
                </p>
              </div>

              {/* Active Trigger Indicator Banner */}
              <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 min-w-0">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Current trigger: <strong className="font-semibold">{activeTriggerItem?.label || trigger}</strong>
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 h-4 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-background/50 font-semibold shrink-0"
                >
                  Active
                </Badge>
              </div>

              {/* Multi-Branch Decision Routing */}
              <div className="p-3 rounded-xl border border-border bg-card space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-purple-500" />
                    <h5 className="text-xs font-bold text-foreground">
                      Decision Branches
                    </h5>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold text-purple-600 border-purple-500/30 bg-purple-500/10">
                    {branches.length} Branch{branches.length > 1 ? "es" : ""}
                  </Badge>
                </div>
                <p className="text-[10.5px] text-muted-foreground leading-tight">
                  Branch this trigger event into multiple distinct targeting paths.
                </p>

                {/* Branches List - Delete option ONLY when branches.length > 1 */}
                <div className="space-y-1.5 pt-0.5">
                  {branches.map((b, idx) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <GitBranch className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span className="text-xs font-semibold text-foreground truncate">
                          {b.name}
                        </span>
                        {idx === 0 && (
                          <Badge variant="outline" className="text-[8px] px-1.5 py-0 border-purple-500/30 text-purple-600 bg-purple-500/10 shrink-0">
                            Primary
                          </Badge>
                        )}
                      </div>

                      {/* Only allow deleting if more than 1 branch exists and not primary branch */}
                      {branches.length > 1 && b.id !== "branch_1" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteBranch?.(b.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 cursor-pointer"
                          title={`Delete ${b.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const triggerData = (selectedNode as any)?.data;
                      if (triggerData && typeof triggerData.onAddBranch === "function") {
                        triggerData.onAddBranch();
                      } else {
                        toast.success("Added new decision branch from trigger event.");
                      }
                    }}
                    className="w-full text-xs h-7.5 gap-1.5 border-dashed border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Another Branch From Trigger
                  </Button>
                </div>
              </div>

              {/* Trigger Gatekeeper Pre-Conditions (YES / NO) */}
              <div className="p-3 rounded-xl border border-border bg-card space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    <h5 className="text-xs font-bold text-foreground">
                      Trigger Pre-Conditions (Gatekeepers)
                    </h5>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold text-muted-foreground">
                    YES / NO
                  </Badge>
                </div>
                <p className="text-[10.5px] text-muted-foreground leading-tight">
                  Instant gatekeeper switches evaluated right when the event fires.
                </p>

                <div className="space-y-1.5 pt-1">
                  {/* Item 1: KYC / Identity Verified Only */}
                  {(() => {
                    const verifiedCond = conditions.find((c) => c.field === "profile.isVerified");
                    const isYes = verifiedCond?.value === "true" || verifiedCond?.value === true || verifiedCond?.value === "YES";
                    const isNo = verifiedCond?.value === "false" || verifiedCond?.value === false || verifiedCond?.value === "NO";
                    const isSet = Boolean(verifiedCond);

                    return (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/70">
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span className="truncate">Verified Members Only?</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            Require KYC or verified email badge
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-background p-0.5 rounded-md border border-border shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (isSet && isYes) {
                                onConditionsChange(conditions.filter((c) => c.field !== "profile.isVerified"));
                              } else {
                                const rest = conditions.filter((c) => c.field !== "profile.isVerified");
                                onConditionsChange([...rest, { field: "profile.isVerified", operator: "equals", value: "true" }]);
                              }
                            }}
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                              isSet && isYes
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isSet && isNo) {
                                onConditionsChange(conditions.filter((c) => c.field !== "profile.isVerified"));
                              } else {
                                const rest = conditions.filter((c) => c.field !== "profile.isVerified");
                                onConditionsChange([...rest, { field: "profile.isVerified", operator: "equals", value: "false" }]);
                              }
                            }}
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                              isSet && isNo
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Item 2: Admin Approval Required */}
                  {(() => {
                    const approvedCond = conditions.find((c) => c.field === "user.isApproved");
                    const isYes = approvedCond?.value === "true" || approvedCond?.value === true || approvedCond?.value === "YES";
                    const isNo = approvedCond?.value === "false" || approvedCond?.value === false || approvedCond?.value === "NO";
                    const isSet = Boolean(approvedCond);

                    return (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/70">
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">Admin Pre-Approved?</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            Profile has been formally approved
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-background p-0.5 rounded-md border border-border shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (isSet && isYes) {
                                onConditionsChange(conditions.filter((c) => c.field !== "user.isApproved"));
                              } else {
                                const rest = conditions.filter((c) => c.field !== "user.isApproved");
                                onConditionsChange([...rest, { field: "user.isApproved", operator: "equals", value: "true" }]);
                              }
                            }}
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                              isSet && isYes
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isSet && isNo) {
                                onConditionsChange(conditions.filter((c) => c.field !== "user.isApproved"));
                              } else {
                                const rest = conditions.filter((c) => c.field !== "user.isApproved");
                                onConditionsChange([...rest, { field: "user.isApproved", operator: "equals", value: "false" }]);
                              }
                            }}
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                              isSet && isNo
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Item 3: Currently a Student? */}
                  {(() => {
                    const studentCond = conditions.find((c) => c.field === "profile.isStudent");
                    const isYes = studentCond?.value === "true" || studentCond?.value === true || studentCond?.value === "YES";
                    const isNo = studentCond?.value === "false" || studentCond?.value === false || studentCond?.value === "NO";
                    const isSet = Boolean(studentCond);

                    return (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/70">
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="text-xs font-bold text-foreground flex items-center gap-1.5 truncate">
                            <School className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">Currently a Student?</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            Active collegiate student status
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-background p-0.5 rounded-md border border-border shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (isSet && isYes) {
                                onConditionsChange(conditions.filter((c) => c.field !== "profile.isStudent"));
                              } else {
                                const rest = conditions.filter((c) => c.field !== "profile.isStudent");
                                onConditionsChange([...rest, { field: "profile.isStudent", operator: "equals", value: "true" }]);
                              }
                            }}
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                              isSet && isYes
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isSet && isNo) {
                                onConditionsChange(conditions.filter((c) => c.field !== "profile.isStudent"));
                              } else {
                                const rest = conditions.filter((c) => c.field !== "profile.isStudent");
                                onConditionsChange([...rest, { field: "profile.isStudent", operator: "equals", value: "false" }]);
                              }
                            }}
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                              isSet && isNo
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-2.5">
                {TRIGGER_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = trigger === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onTriggerChange(opt.value);
                        toast.success(`Trigger set to ${opt.label}`);
                      }}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer",
                        isSelected
                          ? "border-emerald-500/80 bg-emerald-500/[0.06] ring-2 ring-emerald-500/25 shadow-xs"
                          : "border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-muted/30"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 transition-colors",
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span
                            className={cn(
                              "text-xs font-bold transition-colors",
                              isSelected ? "text-emerald-700 dark:text-emerald-300" : "text-foreground"
                            )}
                          >
                            {opt.label}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] font-bold px-1.5 py-0",
                              isSelected
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "text-muted-foreground"
                            )}
                          >
                            {opt.badge}
                          </Badge>
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── CONDITION INSPECTOR ──────────────────────────────────────────── */}
        {selectedNode.type === "condition" && (() => {
          const rawFocusedField = (selectedNode.data as any)?.focusedField;
          const currentBranchId = (selectedNode.data as any)?.branchId || "branch_1";
          const currentBranchName =
            (selectedNode.data as any)?.branchName ||
            branches?.find((b) => b.id === currentBranchId)?.name ||
            (currentBranchId === "branch_1" ? "Branch 1 (Primary)" : currentBranchId);
          const branchObj = branches?.find((b) => b.id === currentBranchId);
          const currentBranchHasNoPath = Boolean(
            (selectedNode.data as any)?.hasNoPath ||
              branchObj?.hasNoPath ||
              actions.some(
                (a) =>
                  getActionBranchId(a) === currentBranchId &&
                  getActionPath(a) === "no"
              )
          );
          const focusedField =
            typeof rawFocusedField === "string" ? rawFocusedField : undefined;
          const branchConditionsWithGlobalIdx = conditions
            .map((c, idx) => ({ c, globalIdx: idx }))
            .filter(({ c }) => (c.branch || "branch_1") === currentBranchId);
          const focusedIndex = focusedField
            ? conditions.reduce(
                (acc, c, idx) => (c.field === focusedField ? idx : acc),
                -1
              )
            : -1;
          const focusedFieldMeta = CONDITION_FIELDS.find(
            (f) => f.value === focusedField
          );

          const suggestionChips: Record<string, string[]> = {
            "profile.isVerified": ["YES", "NO"],
            "user.isApproved": ["YES", "NO"],
            "profile.isStudent": ["YES", "NO"],
            "profile.isAlumni": ["YES", "NO"],
            "profile.isEmployed": ["YES", "NO"],
            "userToEntity.hasAccess": ["YES", "NO"],
            "userToEntity.tag": ["VIP", "Alumni", "Student", "Mentor", "Speaker"],
            "user.email": ["@company.com", "@alumni.edu", "@university.edu"],
            "profile.college": ["Stanford", "MIT", "Harvard", "UC Berkeley"],
            "profile.company": ["Google", "Microsoft", "Apple", "Amazon"],
            "profile.graduationYear": ["2024", "2025", "2026", "2027"],
            "profile.city": ["San Francisco", "New York", "London", "Bengaluru"],
            "profile.jobTitle": ["Software Engineer", "Founder", "Product Manager", "Director"],
          };

          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Eligibility Conditions</span>
                    <Badge variant="outline" className="text-[9px] font-bold text-purple-600 border-purple-500/30 bg-purple-500/10">
                      {currentBranchName}
                    </Badge>
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Filter members by college, company, tags, or email domain.
                  </p>
                </div>

                {conditions.length > 1 && (
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => onConditionOperatorChange("AND")}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded transition-all",
                        conditionOperator === "AND"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      ALL (AND)
                    </button>
                    <button
                      type="button"
                      onClick={() => onConditionOperatorChange("OR")}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded transition-all",
                        conditionOperator === "OR"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      ANY (OR)
                    </button>
                  </div>
                )}
              </div>

              {/* Branch Identity & Rename */}
              <div className="p-3 rounded-xl border border-border bg-card space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-xs font-bold text-foreground">
                      Branch Identity
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {onDuplicateBranch && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicateBranch(currentBranchId)}
                        className="h-6 px-1.5 text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Duplicate this branch"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Duplicate
                      </Button>
                    )}
                    {onDeleteBranch && branches.length > 1 && currentBranchId !== "branch_1" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteBranch(currentBranchId)}
                        className="h-6 px-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        title="Delete this branch"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground">
                    Branch Name
                  </label>
                  <Input
                    value={currentBranchName}
                    onChange={(e) => onRenameBranch?.(currentBranchId, e.target.value)}
                    placeholder="e.g. Stanford Alumni, Enterprise Tier..."
                    className="h-8 text-xs font-semibold bg-background"
                  />
                </div>
              </div>

              {focusedField && (
                <div className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-between text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 min-w-0">
                    <Sliders className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      Editing filter: <strong className="font-semibold">{focusedFieldMeta?.label || focusedField}</strong>
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-background/50 font-semibold shrink-0">
                    Active Filter
                  </Badge>
                </div>
              )}

              {branchConditionsWithGlobalIdx.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center space-y-2">
                  <p className="text-xs font-medium text-foreground">
                    No filter conditions in {currentBranchName}.
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    This branch executes for <strong>100% of members</strong> in this cohort.
                  </p>
                  <div className="pt-2 flex flex-col gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCondition("profile.college", currentBranchId)}
                      className="text-xs h-7 justify-start gap-1.5"
                    >
                      <School className="w-3.5 h-3.5 text-blue-500" />
                      Add College Filter
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCondition("user.email", currentBranchId)}
                      className="text-xs h-7 justify-start gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      Add Email Domain Filter
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCondition("profile.company", currentBranchId)}
                      className="text-xs h-7 justify-start gap-1.5"
                    >
                      <Building className="w-3.5 h-3.5 text-emerald-500" />
                      Add Company Filter
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCondition("profile.isVerified", currentBranchId)}
                      className="text-xs h-7 justify-start gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                      Add Verified Filter (YES/NO)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {branchConditionsWithGlobalIdx.map(({ c: condition, globalIdx }, idx) => {
                    const selectedField =
                      CONDITION_FIELDS.find((f) => f.value === condition.field) ||
                      CONDITION_FIELDS[0];
                    const isNoValue =
                      condition.operator === "is_not_empty" ||
                      condition.operator === "is_empty";
                    const isFocused = idx === focusedIndex;
                    const chips = suggestionChips[condition.field] || [];

                    return (
                      <div
                        key={idx}
                        ref={(el) => {
                          if (el && isFocused) {
                            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                          }
                        }}
                        className={cn(
                          "p-3 rounded-xl border bg-card space-y-2 relative group transition-all duration-200",
                          isFocused
                            ? "border-blue-500/70 dark:border-blue-500/80 bg-blue-500/[0.04] ring-2 ring-blue-500/25 shadow-sm"
                            : "border-border"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              Condition #{idx + 1}
                            </span>
                            {isFocused && (
                              <Badge
                                variant="default"
                                className="text-[9px] px-1.5 py-0 h-4 bg-blue-600 hover:bg-blue-600 text-white font-semibold shadow-xs"
                              >
                                Selected Filter
                              </Badge>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCondition(globalIdx)}
                            className="h-6 w-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        {/* Field */}
                        <Select
                          value={condition.field}
                          onValueChange={(val) =>
                            handleUpdateCondition(globalIdx, "field", val)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITION_FIELDS.map((f) => (
                              <SelectItem key={f.value} value={f.value} className="text-xs">
                                [{f.category}] {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Operator & Value */}
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={condition.operator}
                            onValueChange={(val) =>
                              handleUpdateCondition(globalIdx, "operator", val)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs bg-background">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONDITION_OPERATORS.map((op) => (
                                <SelectItem key={op.value} value={op.value} className="text-xs">
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {!isNoValue ? (
                            selectedField.type === "boolean" ||
                            condition.value === "true" ||
                            condition.value === "false" ||
                            condition.value === "YES" ||
                            condition.value === "NO" ||
                            condition.value === true ||
                            condition.value === false ? (
                              <div className="flex items-center gap-1 h-8 bg-muted/60 p-0.5 rounded-md border border-border w-fit">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCondition(globalIdx, "value", "true")}
                                  className={cn(
                                    "flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                                    condition.value === "true" || condition.value === "YES" || condition.value === true
                                      ? "bg-emerald-600 text-white shadow-xs"
                                      : "text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <Check className="w-3 h-3" />
                                  YES
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCondition(globalIdx, "value", "false")}
                                  className={cn(
                                    "flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                                    condition.value === "false" || condition.value === "NO" || condition.value === false
                                      ? "bg-rose-600 text-white shadow-xs"
                                      : "text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <X className="w-3 h-3" />
                                  NO
                                </button>
                              </div>
                            ) : (
                              <Input
                                ref={(el) => {
                                  if (el && isFocused) {
                                    setTimeout(() => {
                                      el.focus();
                                    }, 50);
                                  }
                                }}
                                type="text"
                                placeholder={selectedField.placeholder}
                                value={condition.value ?? ""}
                                onChange={(e) =>
                                  handleUpdateCondition(globalIdx, "value", e.target.value)
                                }
                                className={cn(
                                  "h-8 text-xs bg-background transition-all",
                                  isFocused && "border-blue-500 ring-1 ring-blue-500/30"
                                )}
                              />
                            )
                          ) : (
                            <div className="h-8 px-2 flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                              Is Set / Checked
                            </div>
                          )}
                        </div>

                        {chips.length > 0 && !isNoValue && (
                          <div className="pt-0.5 flex flex-wrap items-center gap-1">
                            <span className="text-[9.5px] text-muted-foreground">Quick pick:</span>
                            {chips.map((chip) => (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => handleUpdateCondition(globalIdx, "value", chip)}
                                className={cn(
                                  "text-[9.5px] px-1.5 py-0.5 rounded-md border transition-all cursor-pointer",
                                  condition.value === chip
                                    ? "bg-blue-500 text-white border-blue-500 font-semibold"
                                    : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                                )}
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCondition(undefined, currentBranchId)}
                    className="w-full text-xs h-8 gap-1.5 border-dashed cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Filter Condition
                  </Button>
                </div>
              )}

              {/* Else Branch (NO Path) Toggle Card */}
              <div className="p-3 rounded-xl border border-border bg-card space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-rose-500" />
                      Else Branch (NO Path)
                    </span>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Execute alternative fallback actions when members do not match this filter criteria.
                    </p>
                  </div>
                  <Switch
                    checked={Boolean(currentBranchHasNoPath)}
                    onCheckedChange={(checked) =>
                      onToggleNoPath?.(currentBranchId, checked)
                    }
                  />
                </div>
              </div>

              {/* 1. YES Action Pipeline (Direct Actions when Criteria Match) */}
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-bold text-foreground">
                      YES Actions ({currentBranchName})
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                  >
                    {
                      actions.filter(
                        (a) =>
                          getActionBranchId(a) === currentBranchId &&
                          getActionPath(a) === "yes"
                      ).length
                    }{" "}
                    Actions
                  </Badge>
                </div>
                <p className="text-[10.5px] text-muted-foreground leading-tight">
                  Direct actions executed when member matches filter conditions.
                </p>

                {/* YES Actions List */}
                <div className="space-y-1.5">
                  {actions
                    .map((a, originalIndex) => ({ a, originalIndex }))
                    .filter(
                      ({ a }) =>
                        getActionBranchId(a) === currentBranchId &&
                        getActionPath(a) === "yes"
                    )
                    .map(({ a, originalIndex }, stepIdx) => (
                      <div
                        key={originalIndex}
                        className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[9px] flex items-center justify-center shrink-0">
                            {stepIdx + 1}
                          </span>
                          <span className="font-semibold text-foreground truncate text-[11px]">
                            {a.type.replace(/_/g, " ")}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onActionDelete(originalIndex)}
                          className="h-5 w-5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                          title="Remove action"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                </div>

                {/* Add YES Action Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-7.5 border-dashed border-emerald-400 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 font-bold gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add YES Action
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 p-1.5 shadow-xl">
                    <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                      Add to YES Path
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {MEMBER_PALETTE_ACTIONS.map((act) => {
                      const ActIcon = act.icon;
                      return (
                        <DropdownMenuItem
                          key={act.type}
                          onClick={() => {
                            if (act.type === "EMAIL" && !isVerified) {
                              setShowDomainModal(true);
                              toast.error("Email domain setup required.");
                              return;
                            }
                            onActionsChange?.([
                              ...actions,
                              {
                                type: act.type,
                                branch: formatActionBranch(currentBranchId, "yes"),
                                emailSubject:
                                  act.type === "EMAIL"
                                    ? "Welcome to our community! 🎉"
                                    : undefined,
                                pushTitle:
                                  act.type === "NOTIFICATION"
                                    ? "Notification ✨"
                                    : undefined,
                                tags:
                                  act.type === "ADD_MEMBER_TAG"
                                    ? ["VIP"]
                                    : undefined,
                              },
                            ]);
                            toast.success(`Added ${act.label} to YES path`);
                          }}
                          className="text-xs gap-2 py-1.5 cursor-pointer"
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border",
                              act.badgeBg
                            )}
                          >
                            <ActIcon className="w-3 h-3" />
                          </div>
                          <span className="font-semibold truncate">{act.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 2. NO Action Pipeline (When hasNoPath is true) */}
              {currentBranchHasNoPath && (
                <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2.5 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-xs font-bold text-foreground">
                        NO / Else Actions ({currentBranchName})
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold text-rose-600 border-rose-500/30 bg-rose-500/10"
                    >
                      {
                        actions.filter(
                          (a) =>
                            getActionBranchId(a) === currentBranchId &&
                            getActionPath(a) === "no"
                        ).length
                      }{" "}
                      Actions
                    </Badge>
                  </div>
                  <p className="text-[10.5px] text-muted-foreground leading-tight">
                    Alternative actions executed when member does NOT match criteria.
                  </p>

                  {/* NO Actions List */}
                  <div className="space-y-1.5">
                    {actions
                      .map((a, originalIndex) => ({ a, originalIndex }))
                      .filter(
                        ({ a }) =>
                          getActionBranchId(a) === currentBranchId &&
                          getActionPath(a) === "no"
                      )
                      .map(({ a, originalIndex }, stepIdx) => (
                        <div
                          key={originalIndex}
                          className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-[9px] flex items-center justify-center shrink-0">
                              {stepIdx + 1}
                            </span>
                            <span className="font-semibold text-foreground truncate text-[11px]">
                              {a.type.replace(/_/g, " ")}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onActionDelete(originalIndex)}
                            className="h-5 w-5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                            title="Remove action"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                  </div>

                  {/* Add NO Action Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-7.5 border-dashed border-rose-400 text-rose-700 dark:text-rose-300 hover:bg-rose-50 font-bold gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add NO / Else Action
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56 p-1.5 shadow-xl">
                      <DropdownMenuLabel className="text-[10px] font-bold text-rose-600 uppercase tracking-wider px-2 py-1">
                        Add to NO Path
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {MEMBER_PALETTE_ACTIONS.map((act) => {
                        const ActIcon = act.icon;
                        return (
                          <DropdownMenuItem
                            key={act.type}
                            onClick={() => {
                              if (act.type === "EMAIL" && !isVerified) {
                                setShowDomainModal(true);
                                toast.error("Email domain setup required.");
                                return;
                              }
                              onActionsChange?.([
                                ...actions,
                                {
                                  type: act.type,
                                  branch: formatActionBranch(currentBranchId, "no"),
                                  emailSubject:
                                    act.type === "EMAIL"
                                      ? "Notice regarding your membership"
                                      : undefined,
                                  pushTitle:
                                    act.type === "NOTIFICATION"
                                      ? "Membership update"
                                      : undefined,
                                  tags:
                                    act.type === "ADD_MEMBER_TAG"
                                      ? ["Unmatched"]
                                      : undefined,
                                },
                              ]);
                              toast.success(`Added ${act.label} to NO path`);
                            }}
                            className="text-xs gap-2 py-1.5 cursor-pointer"
                          >
                            <div
                              className={cn(
                                "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border",
                                act.badgeBg
                              )}
                            >
                              <ActIcon className="w-3 h-3" />
                            </div>
                            <span className="font-semibold truncate">{act.label}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── ACTION INSPECTOR ────────────────────────────────────────────── */}
        {selectedNode.type === "action" && currentAction && (
          <div className="space-y-4">
            {/* Assigned Condition Branch & Outcome Path */}
            <div className="p-3 rounded-xl border border-border bg-card space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-xs font-bold text-foreground">
                    Branch & Outcome Path
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0 h-4",
                    getActionPath(currentAction) === "no"
                      ? "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  )}
                >
                  {getActionPath(currentAction) === "no" ? "NO (Else)" : "YES (Matches)"}
                </Badge>
              </div>

              {/* Branch Selector */}
              {branches && branches.length > 1 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Target Branch:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {branches.map((b) => {
                      const isSelected = getActionBranchId(currentAction) === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            const curPath = getActionPath(currentAction);
                            onActionUpdate(selectedNode.index, {
                              ...currentAction,
                              branch: formatActionBranch(b.id, curPath),
                            });
                            toast.success(`Action moved to ${b.name}`);
                          }}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer",
                            isSelected
                              ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                              : "bg-muted/40 border-border hover:bg-muted text-muted-foreground"
                          )}
                        >
                          {b.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Outcome Path (YES vs NO) Selector */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Execute Action When:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const curBranchId = getActionBranchId(currentAction);
                      onActionUpdate(selectedNode.index, {
                        ...currentAction,
                        branch: formatActionBranch(curBranchId, "yes"),
                      });
                      toast.success("Action assigned to YES path (Criteria Matches)");
                    }}
                    className={cn(
                      "p-1.5 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer",
                      getActionPath(currentAction) === "yes"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                    )}
                  >
                    <Check className="w-3.5 h-3.5" />
                    YES (Matches)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const curBranchId = getActionBranchId(currentAction);
                      if (onToggleNoPath) {
                        onToggleNoPath(curBranchId, true);
                      }
                      onActionUpdate(selectedNode.index, {
                        ...currentAction,
                        branch: formatActionBranch(curBranchId, "no"),
                      });
                      toast.success("Action assigned to NO path (Else / Fallback)");
                    }}
                    className={cn(
                      "p-1.5 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer",
                      getActionPath(currentAction) === "no"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20"
                    )}
                  >
                    <X className="w-3.5 h-3.5" />
                    NO (Else)
                  </button>
                </div>
              </div>
            </div>
            {/* Action Type Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                Action Type
              </label>
              <Select
                value={currentAction.type}
                onValueChange={(val) => {
                  if (val === "EMAIL" && !isVerified) {
                    setShowDomainModal(true);
                    toast.error(
                      "Email domain setup required before switching to email action."
                    );
                    return;
                  }
                  if (val === "CUSTOM_WEBHOOK" || val === "WEBHOOK") {
                    onActionUpdate(selectedNode.index, {
                      type: "CUSTOM_WEBHOOK",
                      webhook: currentAction.webhook || {
                        url: "",
                        method: "POST",
                        authType: "NONE",
                        mapping: [],
                      },
                    });
                    return;
                  }
                  if (val === "AWARD_POINTS") {
                    onActionUpdate(selectedNode.index, {
                      type: "AWARD_POINTS",
                      points: currentAction.points || 50,
                    });
                    return;
                  }
                  onActionUpdate(selectedNode.index, {
                    type: val as MemberRuleActionType,
                  });
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-background font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      👥 Community Channels
                    </SelectLabel>
                    <SelectItem value="COMMUNITY_JOIN" className="text-xs">
                      Auto-Join Community Circle
                    </SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pt-2">
                      🎖️ Member & Identity (Entity Channels)
                    </SelectLabel>
                    <SelectItem value="ASSIGN_MEMBERSHIP_TIER" className="text-xs">
                      Assign Membership Tier
                    </SelectItem>
                    <SelectItem value="ADD_MEMBER_TAG" className="text-xs">
                      Assign Member Tags
                    </SelectItem>
                    <SelectItem value="AWARD_POINTS" className="text-xs">
                      Award Gamification Points
                    </SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pt-2">
                      📬 Communication Channels
                    </SelectLabel>
                    <SelectItem value="EMAIL" className="text-xs">
                      Send Automated Email {!isVerified ? "(Setup Required)" : ""}
                    </SelectItem>
                    <SelectItem value="NOTIFICATION" className="text-xs">
                      Mobile Push & Notification
                    </SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pt-2">
                      ⚡ Developer & Integrations
                    </SelectLabel>
                    <SelectItem value="CUSTOM_WEBHOOK" className="text-xs">
                      Custom Webhook (API)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Sub-form 1: Membership Tier */}
            {currentAction.type === "ASSIGN_MEMBERSHIP_TIER" && (
              <div className="space-y-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>Target Membership Tier</span>
                </div>
                <Select
                  value={currentAction.tierId || ""}
                  onValueChange={(val) =>
                    onActionUpdate(selectedNode.index, { tierId: val })
                  }
                  disabled={tiersLoading}
                >
                  <SelectTrigger className="h-9 text-xs bg-background">
                    <SelectValue placeholder="Select membership tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id} className="text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: tier.badgeColor || "#f59e0b" }}
                          />
                          <span>{tier.name}</span>
                          {tier.isDefault && (
                            <span className="text-[10px] text-muted-foreground">(Default)</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Tier details preview */}
                {tiers.find((t) => t.id === currentAction.tierId) && (
                  <div className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs"
                      style={{
                        backgroundColor:
                          tiers.find((t) => t.id === currentAction.tierId)?.badgeColor ||
                          "#f59e0b",
                      }}
                    >
                      ★
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground">
                        {tiers.find((t) => t.id === currentAction.tierId)?.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Rank #{tiers.find((t) => t.id === currentAction.tierId)?.rank || 1} ·{" "}
                        {tiers.find((t) => t.id === currentAction.tierId)?.benefits?.length || 0}{" "}
                        perks included
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sub-form 2: Email */}
            {currentAction.type === "EMAIL" && (
              <div className="space-y-3.5 p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                {/* Domain Warning Banner if not verified */}
                {!isVerified && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Email Domain Setup Required</span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                      You cannot dispatch automated emails until your custom domain is configured and verified with SPF & DKIM in Domain Settings.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowDomainModal(true)}
                      className="w-full h-7 text-xs font-bold gap-1 bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Configure Domain in Settings
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                    <Mail className="w-4 h-4" />
                    <span>Email Dispatch</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="h-7 text-xs gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Preview Email
                  </Button>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Select Email Template
                  </label>
                  <Select
                    value={currentAction.templateId || ""}
                    onValueChange={(val) => {
                      const selectedTpl = emailTemplates.find((t: any) => t.id === val);
                      onActionUpdate(selectedNode.index, {
                        templateId: val,
                        emailSubject: selectedTpl?.subject || currentAction.emailSubject || "",
                        emailBody: selectedTpl?.html || currentAction.emailBody || "",
                      });
                    }}
                    disabled={emailsLoading}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background font-medium">
                      <SelectValue placeholder="Choose a saved template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.length === 0 ? (
                        <SelectItem value="default_welcome" className="text-xs">
                          Default Member Onboarding Email
                        </SelectItem>
                      ) : (
                        emailTemplates.map((tpl: any) => (
                          <SelectItem key={tpl.id} value={tpl.id} className="text-xs">
                            {tpl.name} {tpl.subject ? `(${tpl.subject})` : ""}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Subject Line
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Welcome to Stanford Alumni Hub! 🎓"
                    value={currentAction.emailSubject || ""}
                    onChange={(e) =>
                      onActionUpdate(selectedNode.index, {
                        emailSubject: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-background font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Email Body / Message
                  </label>
                  <Textarea
                    placeholder="Enter email content or HTML template..."
                    value={currentAction.emailBody || ""}
                    onChange={(e) =>
                      onActionUpdate(selectedNode.index, {
                        emailBody: e.target.value,
                      })
                    }
                    rows={4}
                    className="text-xs bg-background font-mono resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    {currentAction.templateId
                      ? "Pre-saved Template Selected"
                      : currentAction.emailBody
                      ? "Custom Content Ready"
                      : "Default Template"}
                  </span>
                </div>
              </div>
            )}

            {/* Sub-form 3: Community Join */}
            {currentAction.type === "COMMUNITY_JOIN" && (
              <div className="space-y-3 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-bold">
                  <Users className="w-4 h-4" />
                  <span>Target Community Circle</span>
                </div>
                <Select
                  value={currentAction.communityId || ""}
                  onValueChange={(val) =>
                    onActionUpdate(selectedNode.index, { communityId: val })
                  }
                  disabled={communitiesLoading}
                >
                  <SelectTrigger className="h-9 text-xs bg-background">
                    <SelectValue placeholder="Select community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((comm) => (
                      <SelectItem key={comm.id} value={comm.id} className="text-xs">
                        {comm.title || comm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sub-form 4: Notification */}
            {currentAction.type === "NOTIFICATION" && (
              <div className="space-y-3 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold">
                  <Bell className="w-4 h-4" />
                  <span>Push & Bell Alert</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Push Title
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. VIP Membership Activated ✨"
                    value={currentAction.pushTitle || ""}
                    onChange={(e) =>
                      onActionUpdate(selectedNode.index, {
                        pushTitle: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-background"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Message Body
                  </label>
                  <Textarea
                    placeholder="e.g. Welcome! Your exclusive perks are now active."
                    value={currentAction.pushBody || ""}
                    onChange={(e) =>
                      onActionUpdate(selectedNode.index, {
                        pushBody: e.target.value,
                        notificationMessage: e.target.value,
                      })
                    }
                    className="text-xs bg-background resize-none min-h-[60px]"
                  />
                </div>

                {/* Mobile Preview */}
                <div className="p-3 rounded-xl bg-zinc-900 text-white border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1 font-semibold text-zinc-300">
                      <Smartphone className="w-3 h-3" /> Lock Screen Preview
                    </span>
                    <span>now</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    {currentAction.pushTitle || "Notification Title"}
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    {currentAction.pushBody || "Your notification message will appear here."}
                  </p>
                </div>
              </div>
            )}

            {/* Sub-form 5: Add Member Tags */}
            {currentAction.type === "ADD_MEMBER_TAG" && (
              <div className="space-y-3 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  <Tag className="w-4 h-4" />
                  <span>Assign Member Tags</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Input
                    type="text"
                    placeholder="Type tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tagInput.trim()) {
                        e.preventDefault();
                        const clean = tagInput.trim();
                        const current = currentAction.tags || [];
                        if (!current.includes(clean)) {
                          onActionUpdate(selectedNode.index, {
                            tags: [...current, clean],
                          });
                        }
                        setTagInput("");
                      }
                    }}
                    className="h-8 text-xs bg-background"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      const clean = tagInput.trim();
                      if (!clean) return;
                      const current = currentAction.tags || [];
                      if (!current.includes(clean)) {
                        onActionUpdate(selectedNode.index, {
                          tags: [...current, clean],
                        });
                      }
                      setTagInput("");
                    }}
                    className="h-8 text-xs font-semibold"
                  >
                    Add
                  </Button>
                </div>

                {/* Active Tag Pills */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-background border border-border">
                  {!currentAction.tags || currentAction.tags.length === 0 ? (
                    <span className="text-[11px] text-muted-foreground italic">
                      No tags assigned yet.
                    </span>
                  ) : (
                    currentAction.tags.map((t, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-[10px] font-bold gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() =>
                            onActionUpdate(selectedNode.index, {
                              tags: currentAction.tags?.filter((item) => item !== t),
                            })
                          }
                          className="hover:text-rose-600 ml-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    ))
                  )}
                </div>

                {/* Suggested Tag Pills */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Suggested Tags
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_TAGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          const current = currentAction.tags || [];
                          if (!current.includes(t)) {
                            onActionUpdate(selectedNode.index, {
                              tags: [...current, t],
                            });
                          }
                        }}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted hover:bg-emerald-500/10 hover:text-emerald-700 border border-border transition-colors cursor-pointer"
                      >
                        +{t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-form 6: WhatsApp Template */}
            {currentAction.type === "WHATSAPP_TEMPLATE" && (
              <div className="space-y-3.5 p-3.5 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-xs font-bold">
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Template Message</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Template Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. welcome_orientation"
                    value={currentAction.whatsAppTemplateName || ""}
                    onChange={(e) =>
                      onActionUpdate(selectedNode.index, {
                        whatsAppTemplateName: e.target.value,
                      })
                    }
                    className="h-8 text-xs bg-background font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1">
                    Language Code
                  </label>
                  <Select
                    value={currentAction.whatsAppLanguage || "en_US"}
                    onValueChange={(val) =>
                      onActionUpdate(selectedNode.index, {
                        whatsAppLanguage: val,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["en_US", "en_GB", "es_ES", "hi_IN", "fr_FR", "de_DE", "pt_BR", "ar_AR"].map(
                        (lang) => (
                          <SelectItem key={lang} value={lang} className="text-xs">
                            {lang}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground block">
                    Variable Mapping
                  </label>
                  <p className="text-[10px] text-muted-foreground">
                    Map dynamic variables to the template placeholders ({"{{1}}"}, {"{{2}}"}, etc.).
                  </p>
                  <Input
                    type="text"
                    placeholder="e.g. {{user.firstName}} {{user.lastName}}, {{entity.name}}"
                    value={currentAction.whatsAppVariables?.join(", ") || ""}
                    onChange={(e) =>
                      onActionUpdate(selectedNode.index, {
                        whatsAppVariables: e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean),
                      })
                    }
                    className="h-8 text-xs bg-background"
                  />
                </div>

                {/* Fallback Configuration */}
                <div className="pt-2 border-t border-green-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-green-600" />
                      Fallback Channel
                    </label>
                    <Switch
                      checked={currentAction.fallbackToEmail || false}
                      onCheckedChange={(checked) =>
                        onActionUpdate(selectedNode.index, {
                          fallbackToEmail: checked,
                          fallbackChannel: checked ? "EMAIL" : undefined,
                        })
                      }
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Automatically failover to email or push if WhatsApp delivery fails or user opted out.
                  </p>

                  {currentAction.fallbackToEmail && (
                    <div className="space-y-2 pl-2 border-l-2 border-green-500/30">
                      <Select
                        value={currentAction.fallbackChannel || "EMAIL"}
                        onValueChange={(val) =>
                          onActionUpdate(selectedNode.index, {
                            fallbackChannel: val,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMAIL" className="text-xs">Email</SelectItem>
                          <SelectItem value="PUSH" className="text-xs">Push Notification</SelectItem>
                        </SelectContent>
                      </Select>

                      {currentAction.fallbackChannel === "EMAIL" && (
                        <Input
                          type="text"
                          placeholder="Fallback email subject line"
                          value={currentAction.fallbackEmailSubject || ""}
                          onChange={(e) =>
                            onActionUpdate(selectedNode.index, {
                              fallbackEmailSubject: e.target.value,
                            })
                          }
                          className="h-8 text-xs bg-background"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-form 7: Custom Webhook */}
            {(currentAction.type === "CUSTOM_WEBHOOK" ||
              currentAction.type === "WEBHOOK") && (
              <div className="space-y-3.5 p-3.5 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <div className="flex items-center justify-between text-violet-700 dark:text-violet-400 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Custom Webhook (API)</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold text-violet-600 dark:text-violet-400 border-violet-300 dark:border-violet-800"
                  >
                    API
                  </Badge>
                </div>

                {/* HTTP Method & Endpoint URL */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground block">
                    Endpoint URL & Method
                  </label>
                  <div className="flex gap-2">
                    <Select
                      value={currentAction.webhook?.method || "POST"}
                      onValueChange={(val) =>
                        onActionUpdate(selectedNode.index, {
                          webhook: {
                            ...(currentAction.webhook || {
                              url: "",
                              authType: "NONE",
                            }),
                            method: val,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-24 h-8 text-xs bg-background font-mono font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET" className="text-xs font-mono">
                          GET
                        </SelectItem>
                        <SelectItem value="POST" className="text-xs font-mono">
                          POST
                        </SelectItem>
                        <SelectItem value="PUT" className="text-xs font-mono">
                          PUT
                        </SelectItem>
                        <SelectItem value="PATCH" className="text-xs font-mono">
                          PATCH
                        </SelectItem>
                        <SelectItem value="DELETE" className="text-xs font-mono">
                          DELETE
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="url"
                      placeholder="https://your-api.com/webhook"
                      value={currentAction.webhook?.url || ""}
                      onChange={(e) =>
                        onActionUpdate(selectedNode.index, {
                          webhook: {
                            ...(currentAction.webhook || {
                              method: "POST",
                              authType: "NONE",
                            }),
                            url: e.target.value,
                          },
                        })
                      }
                      className="h-8 text-xs bg-background font-mono flex-1"
                    />
                  </div>
                </div>

                {/* Authentication Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground block">
                    Authentication
                  </label>
                  <Select
                    value={currentAction.webhook?.authType || "NONE"}
                    onValueChange={(val) =>
                      onActionUpdate(selectedNode.index, {
                        webhook: {
                          ...(currentAction.webhook || {
                            url: "",
                            method: "POST",
                          }),
                          authType: val,
                          authToken:
                            val === "NONE"
                              ? undefined
                              : currentAction.webhook?.authToken,
                          authHeaderKey:
                            val === "API_KEY"
                              ? currentAction.webhook?.authHeaderKey ||
                                "X-API-Key"
                              : undefined,
                          authHeaderValue:
                            val === "API_KEY"
                              ? currentAction.webhook?.authHeaderValue
                              : undefined,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Select auth method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE" className="text-xs">
                        No Authentication
                      </SelectItem>
                      <SelectItem value="BEARER_TOKEN" className="text-xs">
                        Bearer Token
                      </SelectItem>
                      <SelectItem value="API_KEY" className="text-xs">
                        API Key (Custom Header)
                      </SelectItem>
                      <SelectItem value="BASIC_AUTH" className="text-xs">
                        Basic Auth
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional Auth Inputs */}
                {currentAction.webhook?.authType === "BEARER_TOKEN" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-foreground block">
                      Bearer Token
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter token"
                      value={currentAction.webhook?.authToken || ""}
                      onChange={(e) =>
                        onActionUpdate(selectedNode.index, {
                          webhook: {
                            ...currentAction.webhook!,
                            authToken: e.target.value,
                          },
                        })
                      }
                      className="h-8 text-xs bg-background font-mono"
                    />
                  </div>
                )}

                {currentAction.webhook?.authType === "API_KEY" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-foreground block">
                        Header Name
                      </label>
                      <Input
                        placeholder="X-API-Key"
                        value={currentAction.webhook?.authHeaderKey || ""}
                        onChange={(e) =>
                          onActionUpdate(selectedNode.index, {
                            webhook: {
                              ...currentAction.webhook!,
                              authHeaderKey: e.target.value,
                            },
                          })
                        }
                        className="h-8 text-xs bg-background font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-foreground block">
                        Header Value
                      </label>
                      <Input
                        type="password"
                        placeholder="Key value"
                        value={currentAction.webhook?.authHeaderValue || ""}
                        onChange={(e) =>
                          onActionUpdate(selectedNode.index, {
                            webhook: {
                              ...currentAction.webhook!,
                              authHeaderValue: e.target.value,
                            },
                          })
                        }
                        className="h-8 text-xs bg-background font-mono"
                      />
                    </div>
                  </div>
                )}

                {currentAction.webhook?.authType === "BASIC_AUTH" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-foreground block">
                      Basic Auth Token (Base64)
                    </label>
                    <Input
                      type="password"
                      placeholder="base64(user:pass)"
                      value={currentAction.webhook?.authToken || ""}
                      onChange={(e) =>
                        onActionUpdate(selectedNode.index, {
                          webhook: {
                            ...currentAction.webhook!,
                            authToken: e.target.value,
                          },
                        })
                      }
                      className="h-8 text-xs bg-background font-mono"
                    />
                  </div>
                )}

                {/* Field Mapping Builder */}
                <div className="pt-2 border-t border-violet-500/20">
                  <WebhookFieldMappingBuilder
                    mapping={currentAction.webhook?.mapping || []}
                    onChange={(newMapping) =>
                      onActionUpdate(selectedNode.index, {
                        webhook: {
                          ...(currentAction.webhook || {
                            url: "",
                            method: "POST",
                            authType: "NONE",
                          }),
                          mapping: newMapping,
                        },
                      })
                    }
                    trigger={trigger}
                    webhookConfig={{
                      url: currentAction.webhook?.url || "",
                      method: currentAction.webhook?.method || "POST",
                      authType: currentAction.webhook?.authType || "NONE",
                      authToken: currentAction.webhook?.authToken,
                      authHeaderKey: currentAction.webhook?.authHeaderKey,
                      authHeaderValue: currentAction.webhook?.authHeaderValue,
                    }}
                    compact={true}
                  />
                </div>
              </div>
            )}

            {/* Sub-form 8: Gamification Points */}
            {currentAction.type === "AWARD_POINTS" && (
              <div className="space-y-4 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    <span>Award Gamification Points</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                  >
                    Points
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-foreground block">
                    Points to Credit
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      placeholder="e.g. 50"
                      value={currentAction.points ?? ""}
                      onChange={(e) => {
                        const val =
                          e.target.value === "" ? 0 : Number(e.target.value);
                        onActionUpdate(selectedNode.index, { points: val });
                      }}
                      className="h-9 text-xs bg-background font-bold pl-8"
                    />
                    <Coins className="w-4 h-4 text-amber-500 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                    Points will be automatically credited to the member's wallet balance via the Gamification Automation journey.
                  </p>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Quick Presets
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[10, 25, 50, 100, 250, 500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          onActionUpdate(selectedNode.index, { points: preset })
                        }
                        className={cn(
                          "px-2 py-1 rounded-md text-xs font-semibold border transition-all",
                          currentAction.points === preset
                            ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                            : "bg-background hover:bg-muted text-muted-foreground border-border"
                        )}
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Delete Action Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onActionDelete(selectedNode.index)}
              className="w-full text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900 gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Action #{selectedNode.index + 1}
            </Button>
          </div>
        )}
      </div>



      {/* ── Email Preview Modal ───────────────────────────────────────────── */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between bg-muted/40 shrink-0">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Email Preview
            </DialogTitle>
            <div className="flex items-center gap-1 bg-background p-0.5 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                  previewDevice === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                  previewDevice === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                Mobile
              </button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 bg-muted/20 flex justify-center">
            <div
              className={cn(
                "bg-white text-zinc-900 rounded-xl shadow-lg border border-border overflow-hidden transition-all",
                previewDevice === "mobile" ? "w-[360px]" : "w-full max-w-xl"
              )}
            >
              <div className="p-3 border-b border-zinc-100 bg-zinc-50 text-xs">
                <span className="font-semibold text-zinc-600">Subject: </span>
                <span className="font-bold text-zinc-900">
                  {currentAction?.emailSubject || "Welcome to our community!"}
                </span>
              </div>
              <div
                className="p-4 overflow-auto max-h-[460px] text-xs"
                dangerouslySetInnerHTML={{ __html: getRenderedPreview() }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EmailDomainSetupModal
        open={showDomainModal}
        onOpenChange={setShowDomainModal}
      />
    </aside>
  );
};
