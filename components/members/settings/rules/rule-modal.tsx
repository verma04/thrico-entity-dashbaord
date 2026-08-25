"use client";

import React, { useState, useEffect } from "react";
import {
  MemberAutomationRule,
  CreateMemberAutomationRuleInput,
  UpdateMemberAutomationRuleInput,
  MemberRuleTrigger,
  MemberRuleConditionInput,
  MemberRuleActionInput,
} from "@/graphql/member-automation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConditionBuilder } from "./condition-builder";
import { ActionBuilder } from "./action-builder";
import { Sparkles, Users, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { toast } from "sonner";

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    input: CreateMemberAutomationRuleInput | UpdateMemberAutomationRuleInput,
    id?: string
  ) => Promise<void>;
  ruleToEdit?: MemberAutomationRule | null;
  loading?: boolean;
}

const TRIGGER_OPTIONS: {
  value: MemberRuleTrigger;
  label: string;
  description: string;
  icon: any;
}[] = [
  {
    value: "MEMBER_JOINED",
    label: "Member Registration / Joins",
    description: "Evaluated immediately when a user signs up or joins the ecosystem.",
    icon: Users,
  },
  {
    value: "MEMBER_APPROVED",
    label: "Member Approval",
    description: "Triggered when an admin or automated rule approves the applicant.",
    icon: CheckCircle2,
  },
  {
    value: "MEMBER_VERIFIED",
    label: "Identity / Profile Verification",
    description: "Triggered when identity documents or institutional email are verified.",
    icon: ShieldCheck,
  },
];

export const RuleModal: React.FC<RuleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  ruleToEdit,
  loading = false,
}) => {
  const isEditing = Boolean(ruleToEdit);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trigger, setTrigger] = useState<MemberRuleTrigger>("MEMBER_JOINED");
  const [conditionOperator, setConditionOperator] = useState<"AND" | "OR">(
    "AND"
  );
  const [conditions, setConditions] = useState<MemberRuleConditionInput[]>([]);
  const [actions, setActions] = useState<MemberRuleActionInput[]>([]);

  useEffect(() => {
    if (ruleToEdit) {
      setName(ruleToEdit.name || "");
      setDescription(ruleToEdit.description || "");
      setTrigger(ruleToEdit.trigger || "MEMBER_JOINED");
      setConditionOperator(
        (ruleToEdit.conditionOperator as "AND" | "OR") || "AND"
      );
      setConditions(
        ruleToEdit.conditions
          ? ruleToEdit.conditions.map((c) => ({
              field: c.field,
              operator: c.operator,
              value: c.value,
            }))
          : []
      );
      setActions(
        ruleToEdit.actions
          ? ruleToEdit.actions.map((a) => ({
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
          : []
      );
    } else {
      setName("");
      setDescription("");
      setTrigger("MEMBER_JOINED");
      setConditionOperator("AND");
      setConditions([]);
      setActions([
        {
          type: "ASSIGN_MEMBERSHIP_TIER",
        },
      ]);
    }
  }, [ruleToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a rule name.");
      return;
    }

    if (actions.length === 0) {
      toast.error("Please configure at least one automated action.");
      return;
    }

    // Clean conditions if any empty values (except for empty check operators)
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
      isActive: ruleToEdit ? ruleToEdit.isActive : true,
    };

    try {
      await onSave(payload, ruleToEdit?.id);
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save rule.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md z-20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {isEditing
                    ? "Edit Member Assignment Rule"
                    : "Create Member Assignment Rule"}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Automate member tier grants, community enrollment, emails, and tags based on user criteria.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* 1. Basic Rule Info */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
                  Rule Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Stanford University - Gold Tier & Auto-Join Alumni Circle"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 text-xs bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block mb-1.5">
                  Description <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <Textarea
                  placeholder="e.g. Automatically assigns the Gold tier, welcomes via email/push, and enrolls into Stanford Alumni Hub upon joining."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 resize-none min-h-[56px]"
                />
              </div>
            </div>

            {/* 2. Trigger Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                Trigger Event (WHEN)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TRIGGER_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = trigger === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTrigger(opt.value)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm"
                          : "bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected
                              ? "text-white dark:text-zinc-900"
                              : "text-zinc-500"
                          }`}
                        />
                        <span className="text-xs font-bold">{opt.label}</span>
                      </div>
                      <p
                        className={`text-[10px] leading-tight ${
                          isSelected
                            ? "text-zinc-300 dark:text-zinc-600"
                            : "text-zinc-500 dark:text-zinc-400"
                        }`}
                      >
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Conditions Builder */}
            <ConditionBuilder
              conditions={conditions}
              conditionOperator={conditionOperator}
              onConditionOperatorChange={setConditionOperator}
              onChange={setConditions}
            />

            {/* 4. Action Builder */}
            <ActionBuilder actions={actions} onChange={setActions} />
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 px-6 border-t border-zinc-100 dark:border-zinc-800/80 sticky bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md z-20 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-xs h-9 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white/90 gap-1.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5" />
              )}
              {isEditing ? "Save Changes" : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
