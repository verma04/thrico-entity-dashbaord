"use client";

import React from "react";
import { Zap, Coins, Bell, Mail, Settings, Sparkles, Repeat } from "lucide-react";
import { PointRule } from "@/graphql/actions";
import { PointRuleActions } from "./point-rule-actions";
import { Switch } from "@/components/ui/switch";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { renderModuleIcon } from "@/components/subscription/utils";
import { cn } from "@/lib/utils";

interface PointRuleCardCompactProps {
  rule: PointRule;
  modules: {
    id: string;
    name: string;
    icon: string;
    type?: "MODULE" | "INTEGRATION";
  }[];
  onEdit: (rule: PointRule) => void;
  onOpenNotifications: (rule: PointRule) => void;
  onToggleActive: (id: string) => void;
  toggling?: boolean;
}

export function PointRuleCardCompact({
  rule,
  modules,
  onEdit,
  onOpenNotifications,
  onToggleActive,
  toggling,
}: PointRuleCardCompactProps) {
  const moduleInfo = modules.find(
    (m) =>
      m.id?.toLowerCase() === rule.module?.toLowerCase() ||
      (m as any).uuid?.toLowerCase() === rule.module?.toLowerCase() ||
      (m as any).slug?.toLowerCase() === rule.module?.toLowerCase(),
  );

  const source = rule.source || moduleInfo?.type || "MODULE";
  const isIntegration = source === "INTEGRATION";
  const isRecurring = rule.trigger === "RECURRING";

  const hasPush = rule.allowPushNotification !== false;
  const hasEmail = rule.allowEmailNotification !== false;

  const barColor = rule.isActive ? "#10b981" : "#f43f5e";

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top status accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: barColor }}
      />

      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
            {renderModuleIcon(
              moduleInfo?.icon || "Settings",
              "h-2.5 w-2.5 shrink-0",
            )}
            {moduleInfo?.name || rule.module}
          </span>

          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border",
              isIntegration
                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
            )}
          >
            {isIntegration ? "Integration" : "Module"}
          </span>

          {isRecurring ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-tight bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 shadow-2xs">
              <Repeat className="h-2.5 w-2.5 text-sky-500" />
              Recurring
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-tight bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-2xs">
              <Sparkles className="h-2.5 w-2.5 text-amber-500 fill-amber-500/20" />
              One-Time
            </span>
          )}

          {rule.memberEligibility && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground border border-border">
              {rule.memberEligibility.replace(/_/g, " ")}
            </span>
          )}
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <PointRuleActions
            rule={rule}
            onEdit={onEdit}
            onOpenNotifications={onOpenNotifications}
            onToggleActive={onToggleActive}
          />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2 pt-0.5">
            <div className="flex items-start gap-1.5 min-w-0 flex-1">
              <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <h3
                className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors capitalize"
                title={rule.action.replace(/_/g, " ").toLowerCase()}
              >
                {rule.action.replace(/_/g, " ").toLowerCase()}
              </h3>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold shrink-0">
              <Coins className="h-3 w-3" />+{rule.points.toLocaleString()} PTS
            </div>
          </div>

          {rule.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {rule.description}
            </p>
          )}

          {/* Caps and Notification Badges */}
          <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
            {isRecurring ? (
              <div className="flex items-center gap-2 text-[10px]">
                <span className="inline-flex items-center gap-0.5">
                  <span className="text-muted-foreground">Daily:</span>
                  <strong className="text-foreground font-semibold">
                    {rule.dailyCap ? `${rule.dailyCap}x` : "∞"}
                  </strong>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5">
                  <span className="text-muted-foreground">Weekly:</span>
                  <strong className="text-foreground font-semibold">
                    {rule.weeklyCap ? `${rule.weeklyCap}x` : "∞"}
                  </strong>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5">
                  <span className="text-muted-foreground">Monthly:</span>
                  <strong className="text-foreground font-semibold">
                    {rule.monthlyCap ? `${rule.monthlyCap}x` : "∞"}
                  </strong>
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20">
                <Sparkles className="h-2.5 w-2.5 text-amber-500 fill-amber-500/20 shrink-0" />
                One-time milestone (No caps)
              </div>
            )}

            <div className="flex items-center gap-1">
              <div
                title={hasPush ? "Push Notification Enabled" : "Push Muted"}
                className={cn(
                  "p-1 rounded transition-colors",
                  hasPush
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground/40",
                )}
              >
                <Bell className="h-2.5 w-2.5" />
              </div>
              <div
                title={hasEmail ? "Email Notification Enabled" : "Email Muted"}
                className={cn(
                  "p-1 rounded transition-colors",
                  hasEmail
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground/40",
                )}
              >
                <Mail className="h-2.5 w-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Switch
              checked={rule.isActive}
              onCheckedChange={() => onToggleActive(rule.id)}
              disabled={toggling}
              className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
            />
            <AdminStatusBadge status={rule.isActive ? "APPROVED" : "DISABLED"}>
              {rule.isActive ? "Active" : "Disabled"}
            </AdminStatusBadge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointRuleCardCompact;
