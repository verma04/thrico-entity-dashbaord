"use client";

import React, { useState } from "react";
import {
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  Plus,
  Trash2,
  Paintbrush,
  Smartphone,
  GitBranch,
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
import {
  SurveyRuleActionInput,
  SurveyRuleActionType,
  SurveyRuleConditionInput,
} from "@/graphql/survey-automation";
import {
  SURVEY_CONDITION_FIELDS,
  SURVEY_CONDITION_OPERATORS,
  SUGGESTED_TAGS,
} from "./inspector-constants";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ActionInspectorProps {
  action: SurveyRuleActionInput;
  actionIndex: number;
  tiers: any[];
  tiersLoading?: boolean;
  emailTemplates: any[];
  emailsLoading?: boolean;
  communities: any[];
  communitiesLoading?: boolean;
  onActionUpdate: (index: number, action: Partial<SurveyRuleActionInput>) => void;
  onActionDelete: (index: number) => void;
}

export const ActionInspector: React.FC<ActionInspectorProps> = ({
  action,
  actionIndex,
  tiers,
  tiersLoading,
  emailTemplates,
  emailsLoading,
  communities,
  communitiesLoading,
  onActionUpdate,
  onActionDelete,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [isGrapesModalOpen, setIsGrapesModalOpen] = useState(false);
  const [isSavingGrapes, setIsSavingGrapes] = useState(false);

  const handleAddTag = (t: string) => {
    const trimmed = t.trim();
    if (!trimmed) return;
    const existing = action.tags || [];
    if (!existing.includes(trimmed)) {
      onActionUpdate(actionIndex, {
        tags: [...existing, trimmed],
      });
    }
    setTagInput("");
  };

  const handleRemoveTag = (t: string) => {
    const existing = action.tags || [];
    onActionUpdate(actionIndex, {
      tags: existing.filter((item) => item !== t),
    });
  };

  const handleAddActionCondition = (presetField?: string) => {
    const existing = action.conditions || [];
    const newCond: SurveyRuleConditionInput = {
      field: presetField || "context.selectedOptions",
      operator: "contains",
      value: "Mentorship",
    };
    onActionUpdate(actionIndex, {
      conditions: [...existing, newCond],
      conditionOperator: action.conditionOperator || "AND",
    });
  };

  const handleRemoveActionCondition = (condIdx: number) => {
    const existing = action.conditions || [];
    onActionUpdate(actionIndex, {
      conditions: existing.filter((_, i) => i !== condIdx),
    });
  };

  const handleUpdateActionCondition = (
    condIdx: number,
    field: keyof SurveyRuleConditionInput,
    val: any
  ) => {
    const existing = [...(action.conditions || [])];
    existing[condIdx] = {
      ...existing[condIdx],
      [field]: val,
    };
    if (
      field === "operator" &&
      (val === "is_not_empty" || val === "is_empty")
    ) {
      existing[condIdx].value = true;
    }
    onActionUpdate(actionIndex, {
      conditions: existing,
    });
  };

  const handleSaveFromGrapes = async (data: {
    html: string;
    json: string;
    subject: string;
  }) => {
    try {
      setIsSavingGrapes(true);
      onActionUpdate(actionIndex, {
        emailBody: data.html,
        emailSubject: data.subject || action.emailSubject,
      });
      setIsGrapesModalOpen(false);
      toast.success("Email template updated successfully!");
    } catch (err: any) {
      toast.error("Failed to save email design.");
    } finally {
      setIsSavingGrapes(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Type Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground block">
          Action Type
        </label>
        <Select
          value={action.type}
          onValueChange={(val) =>
            onActionUpdate(actionIndex, {
              type: val as SurveyRuleActionType,
            })
          }
        >
          <SelectTrigger className="h-8 text-xs bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASSIGN_MEMBERSHIP_TIER" className="text-xs">
              🏆 Assign Membership Tier
            </SelectItem>
            <SelectItem value="EMAIL" className="text-xs">
              ✉️ Send Email (Email Studio)
            </SelectItem>
            <SelectItem value="COMMUNITY_JOIN" className="text-xs">
              👥 Auto-Join Community Circle
            </SelectItem>
            <SelectItem value="NOTIFICATION" className="text-xs">
              🔔 Mobile Push Notification
            </SelectItem>
            <SelectItem value="ADD_MEMBER_TAG" className="text-xs">
              🏷️ Assign Member Tags
            </SelectItem>
            <SelectItem value="WHATSAPP_TEMPLATE" className="text-xs">
              💬 WhatsApp Template Message
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── ASSIGN MEMBERSHIP TIER ────────────────── */}
      {action.type === "ASSIGN_MEMBERSHIP_TIER" && (
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <Award className="w-4 h-4" />
            <span>Target Membership Tier</span>
          </div>

          <Select
            value={action.tierId || ""}
            onValueChange={(val) => {
              onActionUpdate(actionIndex, {
                tierId: val,
              });
            }}
            disabled={tiersLoading}
          >
            <SelectTrigger className="h-8 text-xs bg-background">
              <SelectValue placeholder="Choose a membership tier" />
            </SelectTrigger>
            <SelectContent>
              {tiers.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  👑 {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10.5px] text-muted-foreground">
            Qualified survey respondents will be automatically awarded this membership rank.
          </p>
        </div>
      )}

      {/* ── EMAIL STUDIO ─────────────────────────── */}
      {action.type === "EMAIL" && (
        <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Email Notification Details</span>
            </div>
            <Badge variant="outline" className="text-[9px] bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
              GrapesJS Studio
            </Badge>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground">
              Email Subject Line
            </label>
            <Input
              type="text"
              placeholder="e.g. Thanks for your valuable feedback! 🎉"
              value={action.emailSubject || ""}
              onChange={(e) =>
                onActionUpdate(actionIndex, {
                  emailSubject: e.target.value,
                })
              }
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsGrapesModalOpen(true)}
              className="w-full text-xs h-8 gap-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer"
            >
              <Paintbrush className="w-3.5 h-3.5" />
              Open GrapesJS Email Studio
            </Button>
          </div>

          <Dialog open={isGrapesModalOpen} onOpenChange={setIsGrapesModalOpen}>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden">
              <DialogHeader className="p-4 border-b border-border flex items-center justify-between">
                <DialogTitle className="text-sm font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  Visual Email Template Designer
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 w-full h-full relative">
                <GrapesJsEmailEditor
                  initialData={{
                    name: "Survey Automation Email",
                    subject:
                      action.emailSubject || "Survey Feedback Acknowledgment",
                    html: action.emailBody || getDefaultStarter("welcome"),
                    type: "welcome",
                  }}
                  onSave={handleSaveFromGrapes}
                  onClose={() => setIsGrapesModalOpen(false)}
                  isSaving={isSavingGrapes}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* ── COMMUNITY JOIN ───────────────────────── */}
      {action.type === "COMMUNITY_JOIN" && (
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <Users className="w-4 h-4" />
            <span>Target Community Circle</span>
          </div>

          <Select
            value={action.communityId || ""}
            onValueChange={(val) => {
              onActionUpdate(actionIndex, {
                communityId: val,
              });
            }}
            disabled={communitiesLoading}
          >
            <SelectTrigger className="h-8 text-xs bg-background">
              <SelectValue placeholder="Choose a community circle" />
            </SelectTrigger>
            <SelectContent>
              {communities.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  🌐 {c.title || c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── NOTIFICATION ─────────────────────────── */}
      {action.type === "NOTIFICATION" && (
        <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 font-bold text-xs">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span>Mobile Push & In-App Alert</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Switch
                checked={action.push ?? true}
                onCheckedChange={(val) =>
                  onActionUpdate(actionIndex, { push: val })
                }
                className="scale-75 data-[state=checked]:bg-purple-600"
              />
              <span className="text-[10px] font-bold text-muted-foreground">
                Push
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground">
              Push Alert Title
            </label>
            <Input
              type="text"
              placeholder="e.g. Survey Reward Granted! ✨"
              value={action.pushTitle || ""}
              onChange={(e) =>
                onActionUpdate(actionIndex, {
                  pushTitle: e.target.value,
                })
              }
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground">
              Alert Message Body
            </label>
            <Textarea
              rows={2}
              placeholder="e.g. Thanks for your survey feedback! Your perks are now unlocked."
              value={action.pushBody || action.notificationMessage || ""}
              onChange={(e) =>
                onActionUpdate(actionIndex, {
                  pushBody: e.target.value,
                  notificationMessage: e.target.value,
                })
              }
              className="text-xs bg-background resize-none"
            />
          </div>

          {/* iOS Lock Screen Notification Mockup Preview */}
          <div className="p-2.5 rounded-xl bg-zinc-900 text-white shadow-md border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <div className="flex items-center gap-1 font-semibold">
                <Smartphone className="w-3 h-3 text-purple-400" />
                <span>THRiCO · now</span>
              </div>
            </div>
            <h5 className="text-xs font-bold text-white truncate">
              {action.pushTitle || "Notification Title"}
            </h5>
            <p className="text-[10.5px] text-zinc-300 line-clamp-2 leading-relaxed">
              {action.pushBody || action.notificationMessage || "Message preview will appear here..."}
            </p>
          </div>
        </div>
      )}

      {/* ── MEMBER TAGS ──────────────────────────── */}
      {action.type === "ADD_MEMBER_TAG" && (
        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Assign Member Profile Tags</span>
            </div>
            <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              {(action.tags || []).length} Tags
            </Badge>
          </div>

          <div className="flex gap-1.5">
            <Input
              type="text"
              placeholder="Type a tag name and hit Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag(tagInput);
                }
              }}
              className="h-8 text-xs bg-background"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => handleAddTag(tagInput)}
              className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              Add
            </Button>
          </div>

          {/* Active Tags Chips */}
          <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-background border border-border">
            {(action.tags || []).length === 0 ? (
              <span className="text-[11px] text-muted-foreground italic">
                No tags added yet.
              </span>
            ) : (
              (action.tags || []).map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-500 cursor-pointer ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Suggested Tags */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Suggested Presets
            </span>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_TAGS.map((sTag) => (
                <button
                  key={sTag}
                  type="button"
                  onClick={() => handleAddTag(sTag)}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                >
                  + {sTag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WHATSAPP TEMPLATE ────────────────────── */}
      {action.type === "WHATSAPP_TEMPLATE" && (
        <div className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/20 space-y-3">
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
              placeholder="e.g. survey_completion_thanks"
              value={action.whatsAppTemplateName || ""}
              onChange={(e) =>
                onActionUpdate(actionIndex, {
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
              value={action.whatsAppLanguage || "en_US"}
              onValueChange={(val) =>
                onActionUpdate(actionIndex, {
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
              Map variables to placeholders ({"{{1}}"}, {"{{2}}"}, etc.).
            </p>
            <Input
              type="text"
              placeholder="e.g. {{user.firstName}}, {{entity.name}}"
              value={action.whatsAppVariables?.join(", ") || ""}
              onChange={(e) =>
                onActionUpdate(actionIndex, {
                  whatsAppVariables: e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
                })
              }
              className="h-8 text-xs bg-background"
            />
          </div>

          {/* Fallback */}
          <div className="pt-2 border-t border-green-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-green-600" />
                Fallback Channel
              </label>
              <Switch
                checked={action.fallbackToEmail || false}
                onCheckedChange={(checked) =>
                  onActionUpdate(actionIndex, {
                    fallbackToEmail: checked,
                    fallbackChannel: checked ? "EMAIL" : undefined,
                  })
                }
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Failover to email or push if WhatsApp delivery fails.
            </p>

            {action.fallbackToEmail && (
              <div className="space-y-2 pl-2 border-l-2 border-green-500/30">
                <Select
                  value={action.fallbackChannel || "EMAIL"}
                  onValueChange={(val) =>
                    onActionUpdate(actionIndex, {
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

                {action.fallbackChannel === "EMAIL" && (
                  <Input
                    type="text"
                    placeholder="Fallback email subject line"
                    value={action.fallbackEmailSubject || ""}
                    onChange={(e) =>
                      onActionUpdate(actionIndex, {
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

      {/* ── ACTION BRANCH CRITERIA ───────────────── */}
      <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-300">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Action Branch Filter</span>
          </div>

          {(action.conditions || []).length > 1 && (
            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md border border-border">
              <button
                type="button"
                onClick={() =>
                  onActionUpdate(actionIndex, { conditionOperator: "AND" })
                }
                className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded",
                  (action.conditionOperator || "AND") === "AND"
                    ? "bg-card text-cyan-600 shadow-2xs"
                    : "text-muted-foreground"
                )}
              >
                AND
              </button>
              <button
                type="button"
                onClick={() =>
                  onActionUpdate(actionIndex, { conditionOperator: "OR" })
                }
                className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded",
                  action.conditionOperator === "OR"
                    ? "bg-card text-cyan-600 shadow-2xs"
                    : "text-muted-foreground"
                )}
              >
                OR
              </button>
            </div>
          )}
        </div>

        <p className="text-[10.5px] text-muted-foreground">
          Only execute this specific action if response satisfies the criteria below.
        </p>

        {(action.conditions || []).length === 0 ? (
          <div className="p-2.5 rounded-lg border border-dashed border-cyan-500/30 text-center space-y-1">
            <p className="text-[10.5px] text-muted-foreground">
              No branch criteria. Runs for all responses reaching this step.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddActionCondition()}
              className="h-6 text-[10.5px] gap-1 text-cyan-700 dark:text-cyan-300 border-cyan-500/30"
            >
              <Plus className="w-3 h-3" />
              Add Branch Filter
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {(action.conditions || []).map((cond, ci) => (
              <div
                key={ci}
                className="p-2 rounded-lg bg-card border border-cyan-500/30 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-cyan-700 dark:text-cyan-300 uppercase">
                    Filter #{ci + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveActionCondition(ci)}
                    className="text-rose-500 hover:text-rose-700 font-bold"
                  >
                    × Remove
                  </button>
                </div>

                <Select
                  value={cond.field}
                  onValueChange={(val) =>
                    handleUpdateActionCondition(ci, "field", val)
                  }
                >
                  <SelectTrigger className="h-7 text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SURVEY_CONDITION_FIELDS.map((f) => (
                      <SelectItem key={f.value} value={f.value} className="text-xs">
                        [{f.category}] {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-1.5">
                  <Select
                    value={cond.operator}
                    onValueChange={(val) =>
                      handleUpdateActionCondition(ci, "operator", val)
                    }
                  >
                    <SelectTrigger className="h-7 text-xs bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SURVEY_CONDITION_OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value} className="text-xs">
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    placeholder="Value..."
                    value={cond.value ?? ""}
                    onChange={(e) =>
                      handleUpdateActionCondition(ci, "value", e.target.value)
                    }
                    className="h-7 text-xs bg-background"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddActionCondition()}
              className="w-full h-6 text-[10.5px] gap-1 text-cyan-700 dark:text-cyan-300 border-dashed border-cyan-500/30"
            >
              <Plus className="w-3 h-3" />
              + Add Another Filter
            </Button>
          </div>
        )}
      </div>

      {/* Delete Action Button */}
      <div className="pt-2 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onActionDelete(actionIndex)}
          className="w-full text-xs h-8 gap-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete This Action Block
        </Button>
      </div>
    </div>
  );
};
