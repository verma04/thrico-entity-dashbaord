"use client";

import React from "react";
import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Bell,
  Mail,
} from "lucide-react";
import { Rank, useToggleRank } from "@/graphql/actions";
import { RankActions } from "./rank-actions";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RankCardCompactProps {
  rank: Rank;
  index: number;
  totalRanks: number;
  onEdit: (rank: Rank) => void;
  onOpenNotifications: (rank: Rank) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  refetch?: () => void;
}

export function RankCardCompact({
  rank,
  index,
  totalRanks,
  onEdit,
  onOpenNotifications,
  onMoveUp,
  onMoveDown,
  refetch,
}: RankCardCompactProps) {
  const [toggleRank, { loading: toggling }] = useToggleRank({
    onCompleted: () => {
      refetch?.();
      toast.success("Rank status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggle = async () => {
    try {
      await toggleRank({ variables: { id: rank.id } });
    } catch (err) {
      console.error("Failed to toggle rank:", err);
    }
  };

  const hasPush = rank.allowPushNotification !== false;
  const hasEmail = rank.allowEmailNotification !== false;

  const barColor = rank.color || (rank.isActive ? "#10b981" : "#f43f5e");

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
          <span
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border"
            style={{
              color: rank.color || "#6366f1",
              borderColor: `${rank.color || "#6366f1"}30`,
              backgroundColor: `${rank.color || "#6366f1"}10`,
            }}
          >
            Tier {index + 1}
          </span>

          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-muted text-muted-foreground border border-border">
            #{rank.order ?? index + 1}
          </span>
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <RankActions
            rank={rank}
            onEdit={onEdit}
            onOpenNotifications={onOpenNotifications}
            refetch={refetch}
          />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 pt-0.5">
            <div
              className="h-9 w-9 rounded-lg border overflow-hidden shrink-0 flex items-center justify-center shadow-2xs mt-0.5"
              style={{
                backgroundColor: `${rank.color || "#6366f1"}15`,
                borderColor: `${rank.color || "#6366f1"}30`,
              }}
            >
              <BadgeIcon
                icon={rank.icon}
                className="h-full w-full text-base flex items-center justify-center"
                imageClassName="rounded-md"
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h3
                className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
                title={rank.name}
              >
                {rank.name}
              </h3>
              <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground mt-0.5">
                <TrendingUp className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                <span>{rank.minPoints?.toLocaleString() ?? 0}</span>
                <span>–</span>
                <span>{rank.maxPoints?.toLocaleString() ?? 0} PTS</span>
              </div>
            </div>
          </div>

          {/* Reorder and Notification Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[10px] text-muted-foreground">
            {/* Reorder up/down buttons */}
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0 rounded text-muted-foreground hover:text-foreground hover:bg-muted",
                  index === 0 && "opacity-20 pointer-events-none",
                )}
                onClick={() => onMoveUp(index)}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0 rounded text-muted-foreground hover:text-foreground hover:bg-muted",
                  index === totalRanks - 1 && "opacity-20 pointer-events-none",
                )}
                onClick={() => onMoveDown(index)}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>

            {/* Notification alert badges */}
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
              checked={rank.isActive}
              onCheckedChange={handleToggle}
              disabled={toggling}
              className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
            />
            <AdminStatusBadge status={rank.isActive ? "APPROVED" : "DISABLED"}>
              {rank.isActive ? "Active" : "Hidden"}
            </AdminStatusBadge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankCardCompact;
