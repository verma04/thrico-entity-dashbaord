"use client";

import React from "react";
import { Zap } from "lucide-react";
import {
  PolarisFormCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurveyRuleTrigger } from "@/graphql/survey-automation";
import { TRIGGER_OPTIONS } from "../flow/inspector/inspector-constants";
import { cn } from "@/lib/utils";

interface SurveyRuleDetailsCardProps {
  name: string;
  description: string;
  surveyId: string | null;
  trigger: SurveyRuleTrigger;
  isActive: boolean;
  surveysList: any[];
  surveysLoading?: boolean;
  onNameChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onSurveyIdChange: (val: string | null) => void;
  onTriggerChange: (val: SurveyRuleTrigger) => void;
  onIsActiveChange: (val: boolean) => void;
}

export const SurveyRuleDetailsCard: React.FC<SurveyRuleDetailsCardProps> = ({
  name,
  description,
  surveyId,
  trigger,
  isActive,
  surveysList,
  surveysLoading,
  onNameChange,
  onDescriptionChange,
  onSurveyIdChange,
  onTriggerChange,
  onIsActiveChange,
}) => {
  return (
    <PolarisFormCard
      step={1}
      title="Rule Overview & Scope"
      description="Define the name, description, target survey, and triggering lifecycle event."
      icon={Zap}
    >
      <div className="space-y-4">
        <PolarisInput
          id="survey-rule-name"
          label="Rule Name"
          placeholder="e.g. Promoter Reward & Tier Upgrade Pipeline"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />

        {/* Survey Picker */}
        <div className="space-y-1.5">
          <PolarisLabel>Target Survey Scope</PolarisLabel>
          <Select
            value={surveyId || "ALL"}
            onValueChange={(val) => onSurveyIdChange(val === "ALL" ? null : val)}
            disabled={surveysLoading}
          >
            <SelectTrigger className="h-9 text-xs bg-background">
              <SelectValue placeholder="All Surveys (Global Scope)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs font-semibold">
                🌐 All Surveys (Global Trigger)
              </SelectItem>
              {surveysList.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">
                  📋 {s.title || "Untitled Survey"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PolarisTextarea
          id="survey-rule-desc"
          label="Description"
          placeholder="Describe when this rule triggers and what rewards it grants..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />

        {/* Trigger options */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          <PolarisLabel required>Trigger Lifecycle Event</PolarisLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {TRIGGER_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = trigger === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onTriggerChange(opt.value)}
                  className={cn(
                    "p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                      : "border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center shrink-0 border",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border mt-2">
          <div>
            <span className="text-xs font-bold text-foreground block">
              Rule Active Status
            </span>
            <span className="text-[11px] text-muted-foreground">
              When active, responses will be evaluated in real time.
            </span>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={onIsActiveChange}
            className="data-[state=checked]:bg-emerald-600"
          />
        </div>
      </div>
    </PolarisFormCard>
  );
};
