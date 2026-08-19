"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Pencil,
  Calculator,
  Infinity as InfinityIcon,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Flame,
  ShieldCheck,
  Users,
  Compass,
  Calendar,
  Briefcase,
  GraduationCap,
  Vote,
  ShoppingBag,
  Boxes,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminTableTag } from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";

export interface ImpactRuleNode {
  id: string;
  module: string;
  action: string;
  category: string;
  points: number;
  dailyLimit?: number | null;
  formula?: string | null;
  enabled?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: {
    id?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  updatedBy?: {
    id?: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

interface ImpactRuleCardProps {
  rule: ImpactRuleNode;
  onToggle: (id: string, currentEnabled: boolean) => void;
  isToggling?: boolean;
}

const CATEGORY_STYLES: Record<
  string,
  {
    variant: "indigo" | "emerald" | "amber" | "purple" | "rose" | "default";
    borderClass: string;
    bgClass: string;
    textClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  ENGAGEMENT: {
    variant: "indigo",
    borderClass: "border-blue-200/80 dark:border-blue-900/50",
    bgClass: "bg-blue-50/50 dark:bg-blue-950/20",
    textClass: "text-blue-600 dark:text-blue-400",
    icon: MessageSquare,
  },
  CONTRIBUTION: {
    variant: "emerald",
    borderClass: "border-emerald-200/80 dark:border-emerald-900/50",
    bgClass: "bg-emerald-50/50 dark:bg-emerald-950/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    icon: Flame,
  },
  TRUST: {
    variant: "amber",
    borderClass: "border-amber-200/80 dark:border-amber-900/50",
    bgClass: "bg-amber-50/50 dark:bg-amber-950/20",
    textClass: "text-amber-600 dark:text-amber-400",
    icon: ShieldCheck,
  },
  NETWORK: {
    variant: "purple",
    borderClass: "border-purple-200/80 dark:border-purple-900/50",
    bgClass: "bg-purple-50/50 dark:bg-purple-950/20",
    textClass: "text-purple-600 dark:text-purple-400",
    icon: Users,
  },
  CONSISTENCY: {
    variant: "rose",
    borderClass: "border-rose-200/80 dark:border-rose-900/50",
    bgClass: "bg-rose-50/50 dark:bg-rose-950/20",
    textClass: "text-rose-600 dark:text-rose-400",
    icon: Compass,
  },
};

function getModuleIcon(moduleName?: string) {
  const lower = (moduleName || "").toLowerCase();
  if (lower.includes("event")) return Calendar;
  if (lower.includes("forum") || lower.includes("feed") || lower.includes("post") || lower.includes("chat"))
    return MessageSquare;
  if (lower.includes("job") || lower.includes("career")) return Briefcase;
  if (lower.includes("learn") || lower.includes("course")) return GraduationCap;
  if (lower.includes("poll") || lower.includes("survey")) return Vote;
  if (lower.includes("reward") || lower.includes("gamification") || lower.includes("impact"))
    return Award;
  if (lower.includes("shop") || lower.includes("store") || lower.includes("order"))
    return ShoppingBag;
  if (lower.includes("integration") || lower.includes("crm")) return Boxes;
  if (lower.includes("member") || lower.includes("community")) return Users;
  return Layers;
}

export function ImpactRuleCard({
  rule,
  onToggle,
  isToggling = false,
}: ImpactRuleCardProps) {
  const isEnabled = rule.enabled !== false;
  const catStyle =
    CATEGORY_STYLES[rule.category?.toUpperCase()] || {
      variant: "default" as const,
      borderClass: "border-border/60",
      bgClass: "bg-muted/30",
      textClass: "text-muted-foreground",
      icon: Layers,
    };
  const CategoryIcon = catStyle.icon;
  const ModuleIcon = getModuleIcon(rule.module);

  const formattedAction = (rule.action || "Untitled Action")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const formattedModule = (rule.module || "General")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const creatorName = rule.createdBy
    ? `${rule.createdBy.firstName || ""} ${rule.createdBy.lastName || ""}`.trim()
    : "System";

  const createdDate = rule.createdAt
    ? new Date(rule.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div
      className={cn(
        "relative group flex flex-col justify-between overflow-hidden rounded-xl border bg-card transition-all duration-200 shadow-2xs hover:shadow-md hover:border-primary/40",
        isEnabled
          ? "border-border/70"
          : "border-border/40 opacity-75 hover:opacity-100 bg-muted/10",
      )}
    >
      {/* Top Accent Line */}
      <div
        className={cn(
          "h-1 w-full transition-colors",
          isEnabled
            ? rule.points > 0
              ? "bg-emerald-500/80 group-hover:bg-emerald-500"
              : rule.points < 0
              ? "bg-rose-500/80 group-hover:bg-rose-500"
              : "bg-muted-foreground/30"
            : "bg-muted-foreground/20",
        )}
      />

      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        {/* Header Row: Category Tag, Module Badge & Switch */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <AdminTableTag variant={catStyle.variant}>
              <CategoryIcon className="h-3 w-3 mr-1 shrink-0" />
              {rule.category || "General"}
            </AdminTableTag>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/50 truncate">
              <ModuleIcon className="h-2.5 w-2.5 shrink-0" />
              {formattedModule}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => onToggle(rule.id, isEnabled)}
                      disabled={isToggling}
                      className="scale-75 data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isEnabled ? "Click to disable rule" : "Click to enable rule"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Action Title & Formula */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-start gap-1.5">
            <div
              className={cn(
                "p-1 rounded-md shrink-0 mt-0.5",
                rule.points > 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : rule.points < 0
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                {formattedAction}
              </h3>
              {rule.formula && (
                <div className="flex items-center gap-1 mt-1 text-[11px] font-mono text-muted-foreground bg-muted/50 border border-border/40 rounded px-1.5 py-0.5 w-fit max-w-full truncate">
                  <Calculator className="h-2.5 w-2.5 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">{rule.formula}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Pill Grid: Impact Points & Daily Cap */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Points Pill */}
          <div
            className={cn(
              "flex flex-col p-2 rounded-lg border",
              rule.points > 0
                ? "bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-900/40"
                : rule.points < 0
                ? "bg-rose-500/5 border-rose-200/60 dark:border-rose-900/40"
                : "bg-muted/30 border-border/50",
            )}
          >
            <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
              {rule.points > 0 ? (
                <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
              ) : rule.points < 0 ? (
                <TrendingDown className="h-2.5 w-2.5 text-rose-500" />
              ) : (
                <Sparkles className="h-2.5 w-2.5 text-muted-foreground" />
              )}
              Points
            </span>
            <span
              className={cn(
                "text-sm font-bold font-mono tracking-tight mt-0.5",
                rule.points > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : rule.points < 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-foreground",
              )}
            >
              {rule.points > 0 ? `+${rule.points}` : rule.points}
              <span className="text-[10px] font-normal text-muted-foreground ml-1">
                pts
              </span>
            </span>
          </div>

          {/* Daily Limit Pill */}
          <div className="flex flex-col p-2 rounded-lg border bg-muted/30 border-border/50">
            <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
              <Clock className="h-2.5 w-2.5 text-muted-foreground" />
              Daily Cap
            </span>
            <span className="text-sm font-bold font-mono tracking-tight text-foreground mt-0.5 flex items-center gap-1">
              {rule.dailyLimit ? (
                <>
                  {rule.dailyLimit}
                  <span className="text-[10px] font-normal text-muted-foreground">
                    x / day
                  </span>
                </>
              ) : (
                <>
                  <InfinityIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-[10px] font-normal text-muted-foreground">
                    No limit
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata and Edit Action */}
      <div className="px-3.5 py-2.5 bg-muted/20 border-t border-border/50 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 min-w-0 text-muted-foreground">
          <User className="h-3 w-3 shrink-0 opacity-70" />
          <span className="text-[11px] truncate font-medium">
            {creatorName}
          </span>
          <span className="text-[10px] text-muted-foreground/60">•</span>
          <span className="text-[10px] text-muted-foreground/70 shrink-0">
            {createdDate}
          </span>
        </div>

        <Link
          href={`/gamification/impact-score/rules/${rule.id}/edit`}
          className="shrink-0"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border/70 rounded-md transition-all gap-1 shadow-2xs"
          >
            <Pencil className="h-3 w-3" />
            <span>Edit</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ImpactRuleCard;
