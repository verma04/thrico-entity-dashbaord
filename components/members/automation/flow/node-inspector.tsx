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
  ShieldCheck,
  Plus,
  Trash2,
  Eye,
  Paintbrush,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GrapesJsEmailEditor,
  getDefaultStarter,
} from "@/components/email/grapesjs-editor/grapesjs-email-editor";
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
    icon: Users,
  },
  {
    value: "MEMBER_APPROVED",
    label: "Member Approval",
    badge: "Admin Action",
    description:
      "Triggered when an administrator or verification gate approves the profile.",
    icon: CheckCircle2,
  },
  {
    value: "MEMBER_VERIFIED",
    label: "Identity / Profile Verified",
    badge: "Trust Badge",
    description:
      "Triggered when identity documents or university email are verified.",
    icon: ShieldCheck,
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

interface NodeInspectorProps {
  selectedNode: SelectedNodeInfo;
  trigger: MemberRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: MemberRuleConditionInput[];
  actions: MemberRuleActionInput[];
  onTriggerChange: (trigger: MemberRuleTrigger) => void;
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: MemberRuleConditionInput[]) => void;
  onActionUpdate: (index: number, action: Partial<MemberRuleActionInput>) => void;
  onActionDelete: (index: number) => void;
  onClose: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  selectedNode,
  trigger,
  conditionOperator,
  conditions,
  actions,
  onTriggerChange,
  onConditionOperatorChange,
  onConditionsChange,
  onActionUpdate,
  onActionDelete,
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

  const [tagInput, setTagInput] = useState("");
  const [emailTab, setEmailTab] = useState<"custom" | "template">("custom");
  const [isGrapesModalOpen, setIsGrapesModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [isSavingGrapes, setIsSavingGrapes] = useState(false);

  const tiers: any[] = tiersData?.getMembershipTiers || [];
  const emailTemplates: any[] = emailsData?.getEmailTemplates || [];
  const communities: any[] =
    communitiesData?.getCommunities?.data ||
    communitiesData?.getAllCommunities ||
    [];

  if (!selectedNode) return null;

  // Condition Handlers
  const handleAddCondition = (presetField?: string) => {
    onConditionsChange([
      ...conditions,
      {
        field: presetField || "profile.college",
        operator: "contains",
        value: "",
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
    if (
      field === "operator" &&
      (val === "is_not_empty" || val === "is_empty")
    ) {
      updated[index].value = true;
    }
    onConditionsChange(updated);
  };

  // Action Email Studio Save
  const handleSaveFromGrapes = async (data: {
    html: string;
    json: string;
    subject?: string;
  }) => {
    if (selectedNode.type !== "action") return;
    try {
      setIsSavingGrapes(true);
      onActionUpdate(selectedNode.index, {
        emailBody: data.html,
        emailSubject: data.subject || actions[selectedNode.index]?.emailSubject,
      });
      setIsGrapesModalOpen(false);
      toast.success("Email template updated successfully!");
    } catch (err: any) {
      toast.error("Failed to save email design.");
    } finally {
      setIsSavingGrapes(false);
    }
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
        {selectedNode.type === "trigger" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground block">
                Select Lifecycle Trigger
              </label>
              <p className="text-[11px] text-muted-foreground">
                Determines when this automation is evaluated for joining or existing members.
              </p>
            </div>

            <div className="space-y-2.5">
              {TRIGGER_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = trigger === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onTriggerChange(opt.value)}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                        : "border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-foreground">
                          {opt.label}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0",
                            isSelected && "bg-primary/10 text-primary border-primary/30"
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
        )}

        {/* ── CONDITION INSPECTOR ──────────────────────────────────────────── */}
        {selectedNode.type === "condition" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  Eligibility Conditions
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

            {conditions.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center space-y-2">
                <p className="text-xs font-medium text-foreground">
                  No filter conditions configured.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Workflow will execute for <strong>100% of members</strong>.
                </p>
                <div className="pt-2 flex flex-col gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCondition("profile.college")}
                    className="text-xs h-7 justify-start gap-1.5"
                  >
                    <School className="w-3.5 h-3.5 text-blue-500" />
                    Add College Filter
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCondition("user.email")}
                    className="text-xs h-7 justify-start gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    Add Email Domain Filter
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCondition("profile.company")}
                    className="text-xs h-7 justify-start gap-1.5"
                  >
                    <Building className="w-3.5 h-3.5 text-emerald-500" />
                    Add Company Filter
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {conditions.map((condition, idx) => {
                  const selectedField =
                    CONDITION_FIELDS.find((f) => f.value === condition.field) ||
                    CONDITION_FIELDS[0];
                  const isNoValue =
                    condition.operator === "is_not_empty" ||
                    condition.operator === "is_empty";

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-border bg-card space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          Condition #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCondition(idx)}
                          className="h-6 w-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Field */}
                      <Select
                        value={condition.field}
                        onValueChange={(val) =>
                          handleUpdateCondition(idx, "field", val)
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
                            handleUpdateCondition(idx, "operator", val)
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
                          <Input
                            type="text"
                            placeholder={selectedField.placeholder}
                            value={condition.value ?? ""}
                            onChange={(e) =>
                              handleUpdateCondition(idx, "value", e.target.value)
                            }
                            className="h-8 text-xs bg-background"
                          />
                        ) : (
                          <div className="h-8 px-2 flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                            Is Set / Checked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCondition()}
                  className="w-full text-xs h-8 gap-1.5 border-dashed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Condition
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── ACTION INSPECTOR ────────────────────────────────────────────── */}
        {selectedNode.type === "action" && currentAction && (
          <div className="space-y-4">
            {/* Action Type Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                Action Type
              </label>
              <Select
                value={currentAction.type}
                onValueChange={(val) =>
                  onActionUpdate(selectedNode.index, {
                    type: val as MemberRuleActionType,
                  })
                }
              >
                <SelectTrigger className="h-9 text-xs bg-background font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSIGN_MEMBERSHIP_TIER" className="text-xs">
                    🏆 Assign Membership Tier
                  </SelectItem>
                  <SelectItem value="EMAIL" className="text-xs">
                    ✉️ Send Onboarding Email (Email Studio)
                  </SelectItem>
                  <SelectItem value="COMMUNITY_JOIN" className="text-xs">
                    👥 Auto-Join Community Circle
                  </SelectItem>
                  <SelectItem value="NOTIFICATION" className="text-xs">
                    🔔 Mobile Push & Alert
                  </SelectItem>
                  <SelectItem value="ADD_MEMBER_TAG" className="text-xs">
                    🏷️ Assign Member Tags
                  </SelectItem>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                    <Mail className="w-4 h-4" />
                    <span>Email Studio Dispatch</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsGrapesModalOpen(true)}
                    className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1 shadow-xs"
                  >
                    <Paintbrush className="w-3.5 h-3.5" />
                    Email Studio
                  </Button>
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

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    Template: {currentAction.emailBody ? "Custom HTML Ready" : "Default Starter"}
                  </span>
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

      {/* ── GrapesJS Email Studio Fullscreen Modal ───────────────────────── */}
      <Dialog open={isGrapesModalOpen} onOpenChange={setIsGrapesModalOpen}>
        <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] max-h-[92vh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="p-3 border-b border-border bg-card shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-indigo-600" />
              Email Studio — Visual Designer
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-full relative">
            <GrapesJsEmailEditor
              initialData={{
                name: "Automation Rule Email",
                subject: currentAction?.emailSubject || "Welcome to our community!",
                html: currentAction?.emailBody || getDefaultStarter("welcome"),
                type: "welcome",
              }}
              onSave={handleSaveFromGrapes}
              onClose={() => setIsGrapesModalOpen(false)}
              isSaving={isSavingGrapes}
            />
          </div>
        </DialogContent>
      </Dialog>

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
    </aside>
  );
};
