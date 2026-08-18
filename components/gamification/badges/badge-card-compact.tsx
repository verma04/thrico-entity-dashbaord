"use client";

import React from "react";
import {
  Zap,
  Coins,
  Award,
  Bell,
  Mail,
  Settings,
} from "lucide-react";
import { Badge } from "@/graphql/actions";
import { BadgeActions } from "./badge-actions";
import { BadgeIcon } from "./badge-icon";
import { Switch } from "@/components/ui/switch";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { renderModuleIcon } from "@/components/subscription/utils";
import { cn } from "@/lib/utils";

interface BadgeCardCompactProps {
  badge: Badge;
  modules: { id: string; name: string; icon: string; type?: "MODULE" | "INTEGRATION" }[];
  onEdit: (badge: Badge) => void;
  onOpenNotifications: (badge: Badge) => void;
  onToggleActive: (id: string) => void;
  toggling?: boolean;
}

export function BadgeCardCompact({
  badge,
  modules,
  onEdit,
  onOpenNotifications,
  onToggleActive,
  toggling,
}: BadgeCardCompactProps) {
  const moduleInfo = modules.find(
    (m) =>
      m.id?.toLowerCase() === badge.module?.toLowerCase() ||
      (m as any).uuid?.toLowerCase() === badge.module?.toLowerCase() ||
      (m as any).slug?.toLowerCase() === badge.module?.toLowerCase(),
  );

  const source = badge.source || moduleInfo?.type || "MODULE";
  const isIntegration = source === "INTEGRATION";
  const isAction = badge.type === "ACTION";

  const hasPush = badge.allowPushNotification !== false;
  const hasEmail = badge.allowEmailNotification !== false;

  const barColor = badge.isActive ? "#10b981" : "#f43f5e";

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
          {moduleInfo ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
              {renderModuleIcon(
                moduleInfo.icon || "Settings",
                "h-2.5 w-2.5 shrink-0",
              )}
              {moduleInfo.name}
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-muted text-muted-foreground border border-border">
              Global
            </span>
          )}

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

          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground border border-border">
            {isAction ? "Action" : "Points"}
          </span>
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <BadgeActions
            badge={badge}
            onEdit={onEdit}
            onOpenNotifications={onOpenNotifications}
            onToggleActive={onToggleActive}
          />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 pt-0.5">
            <BadgeIcon
              icon={badge.icon}
              className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-lg shrink-0 flex items-center justify-center mt-0.5 shadow-2xs"
            />

            <div className="flex flex-col min-w-0 flex-1">
              <h3
                className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
                title={badge.name}
              >
                {badge.name}
              </h3>
              {badge.description && (
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                  {badge.description}
                </p>
              )}
            </div>
          </div>

          {/* Criteria Requirement & Notifications */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              {isAction ? (
                <Zap className="h-3 w-3 text-amber-500 shrink-0" />
              ) : (
                <Coins className="h-3 w-3 text-indigo-500 shrink-0" />
              )}
              <span className="font-semibold text-foreground font-mono text-[10px]">
                {isAction
                  ? `${(badge.condition?.action || badge.action || "Action").replace(/_/g, " ")} × ${badge.condition?.count || badge.targetValue || 1}`
                  : `${(badge.condition?.pointsRequired || badge.targetValue || 0).toLocaleString()} PTS`}
              </span>
            </div>

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
              checked={badge.isActive}
              onCheckedChange={() => onToggleActive(badge.id)}
              disabled={toggling}
              className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
            />
            <AdminStatusBadge status={badge.isActive ? "APPROVED" : "DISABLED"}>
              {badge.isActive ? "Active" : "Disabled"}
            </AdminStatusBadge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BadgeCardCompact;
