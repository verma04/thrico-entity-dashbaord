"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurveyRuleTrigger } from "@/graphql/survey-automation";
import { TRIGGER_OPTIONS } from "./inspector-constants";
import { cn } from "@/lib/utils";

interface TriggerInspectorProps {
  surveyId?: string | null;
  trigger: SurveyRuleTrigger;
  surveysList: any[];
  surveysLoading?: boolean;
  onSurveyIdChange: (surveyId: string | null) => void;
  onTriggerChange: (trigger: SurveyRuleTrigger) => void;
}

export const TriggerInspector: React.FC<TriggerInspectorProps> = ({
  surveyId,
  trigger,
  surveysList,
  surveysLoading,
  onSurveyIdChange,
  onTriggerChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Survey Scope Dropdown */}
      <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border">
        <label className="text-xs font-bold text-foreground block">
          Target Survey Scope
        </label>
        <Select
          value={surveyId || "ALL"}
          onValueChange={(val) => onSurveyIdChange(val === "ALL" ? null : val)}
          disabled={surveysLoading}
        >
          <SelectTrigger className="h-8 text-xs bg-background">
            <SelectValue placeholder="All Surveys (Global)" />
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
        <p className="text-[10.5px] text-muted-foreground">
          Limit rule execution to a specific survey, or apply universally across all surveys.
        </p>
      </div>

      {/* Trigger Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground block">
          Lifecycle Event
        </label>
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
                        isSelected &&
                          "bg-primary/10 text-primary border-primary/30"
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
    </div>
  );
};
