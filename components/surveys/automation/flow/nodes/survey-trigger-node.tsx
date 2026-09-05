"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Zap,
  ClipboardList,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SurveyRuleTrigger } from "@/graphql/survey-automation";
import { cn } from "@/lib/utils";

export const SurveyTriggerNode = memo(({ data, selected }: NodeProps<any>) => {
  const trigger = (data.trigger as SurveyRuleTrigger) || "SURVEY_SUBMITTED";
  const surveyName = data.surveyName || "All Surveys (Universal)";

  const getTriggerMeta = () => {
    switch (trigger) {
      case "SURVEY_SUBMITTED":
        return {
          title: "Survey Response Submitted",
          desc: "Triggered instantly when a respondent submits their survey answers.",
          icon: ClipboardList,
          color: "from-cyan-500 to-blue-600",
          border: "border-cyan-500/40 dark:border-cyan-500/30",
          bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
          badge: "Submit Event",
        };
      case "SURVEY_COMPLETED":
        return {
          title: "Survey Full Completion",
          desc: "Triggered when 100% of required survey sections are finalized.",
          icon: CheckCircle2,
          color: "from-emerald-500 to-teal-600",
          border: "border-emerald-500/40 dark:border-emerald-500/30",
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          badge: "Completion",
        };
      case "SURVEY_CREATED":
        return {
          title: "New Survey Published",
          desc: "Triggered when a survey is launched to announce or notify cohorts.",
          icon: PlusCircle,
          color: "from-indigo-500 to-purple-600",
          border: "border-indigo-500/40 dark:border-indigo-500/30",
          bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
          badge: "Launch Event",
        };
      default:
        return {
          title: "Survey Event",
          desc: "Lifecycle trigger for survey automation.",
          icon: Zap,
          color: "from-amber-500 to-orange-600",
          border: "border-amber-500/40 dark:border-amber-500/30",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          badge: "Event",
        };
    }
  };

  const meta = getTriggerMeta();
  const Icon = meta.icon;

  return (
    <div
      onClick={data.onSelect}
      className={cn(
        "group relative w-[320px] rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-md",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]"
          : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      )}
    >
      {/* Top Accent Bar */}
      <div className={cn("h-2 w-full rounded-t-2xl bg-gradient-to-r", meta.color)} />

      <div className="p-4 space-y-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shadow-xs",
                meta.bg
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Survey Trigger
              </span>
              <h4 className="text-xs font-bold text-foreground leading-tight">
                {meta.title}
              </h4>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-[9px] font-bold px-1.5 py-0.5", meta.bg, meta.border)}
          >
            {meta.badge}
          </Badge>
        </div>

        {/* Survey Scope Pill */}
        <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-border/80 flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Survey:</span>
          <span className="font-semibold text-foreground truncate max-w-[190px]">
            {surveyName}
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {meta.desc}
        </p>

        {/* Footer */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <Zap className="w-3 h-3 text-amber-500" />
            Branches evaluate in parallel
          </span>
          <span className="font-semibold text-primary group-hover:underline">
            Configure Scope →
          </span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3.5 !h-3.5 !bg-primary !border-2 !border-background shadow-xs transition-transform group-hover:scale-125"
      />
    </div>
  );
});

SurveyTriggerNode.displayName = "SurveyTriggerNode";
