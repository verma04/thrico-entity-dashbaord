"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  EnterpriseLeaderboardConfig,
  EnterpriseLeaderboardStatus,
  EnterpriseClient,
} from "@/graphql/actions/enterprise-leaderboard";
import { safeFormat } from "@/lib/date-utils";
import {
  Trophy,
  Copy,
  Check,
  Calendar,
  Layers,
  ShieldAlert,
  Edit2,
  Trash2,
  PlayCircle,
  PauseCircle,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface LeaderboardDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaderboard: EnterpriseLeaderboardConfig | null;
  client: EnterpriseClient | null;
  onEdit?: (leaderboard: EnterpriseLeaderboardConfig) => void;
  onToggleStatus?: (
    leaderboard: EnterpriseLeaderboardConfig,
    nextStatus: EnterpriseLeaderboardStatus
  ) => void;
  onDelete?: (leaderboard: EnterpriseLeaderboardConfig) => void;
  onSelectEmbed?: (code: string) => void;
}

export function LeaderboardDetailsModal({
  open,
  onOpenChange,
  leaderboard,
  client,
  onEdit,
  onToggleStatus,
  onDelete,
  onSelectEmbed,
}: LeaderboardDetailsModalProps) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!leaderboard) return null;

  const isActive = leaderboard.status === "ACTIVE";
  const isInactive = leaderboard.status === "INACTIVE";

  const clientId = client?.clientId || "YOUR_CLIENT_ID";
  const snippet = `<div id="thrico-leaderboard" data-code="${leaderboard.code}"></div>
<script src="https://cdn.thrico.io/leaderboard.v1.js" data-client="${clientId}"></script>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    toast.success("Embed HTML snippet copied to clipboard");
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(leaderboard.code);
    setCopiedCode(true);
    toast.success(`Slug "${leaderboard.code}" copied`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      );
    }
    if (isInactive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        Archived
      </span>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <SheetHeader className="p-0 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40 shrink-0">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <SheetTitle className="text-base font-bold text-foreground">
                    {leaderboard.name}
                  </SheetTitle>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                    <span>slug:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      {leaderboard.code}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy code"
                    >
                      {copiedCode ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div>{getStatusBadge()}</div>
            </div>
            {leaderboard.description && (
              <SheetDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
                {leaderboard.description}
              </SheetDescription>
            )}
          </SheetHeader>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-border/70 bg-card space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Cadence & Period
              </span>
              <span className="font-semibold text-foreground block">
                {leaderboard.periodType}
              </span>
              {leaderboard.startDate && leaderboard.endDate && (
                <span className="text-[10.5px] text-muted-foreground block font-mono">
                  {safeFormat(leaderboard.startDate, "MMM d")} - {safeFormat(leaderboard.endDate, "MMM d, yyyy")}
                </span>
              )}
            </div>

            <div className="p-3 rounded-lg border border-border/70 bg-card space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Pagination & Limit
              </span>
              <span className="font-semibold text-foreground block">
                {leaderboard.defaultPageSize} per page
              </span>
              <span className="text-[10.5px] text-muted-foreground block font-mono">
                max limit: {leaderboard.maxPageSize}
              </span>
            </div>
          </div>

          {/* Display & Privacy Configuration */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Visible Fields & GDPR Privacy
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                {leaderboard.visibleFields?.showName !== false ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>Show Member Name</span>
              </div>

              <div className="flex items-center gap-2">
                {leaderboard.visibleFields?.showAvatar !== false ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>Show Avatars</span>
              </div>

              <div className="flex items-center gap-2">
                {leaderboard.visibleFields?.showBadges !== false ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>Show Earned Badges</span>
              </div>

              <div className="flex items-center gap-2">
                {leaderboard.visibleFields?.showRankMovement !== false ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>Rank Movement (▲/▼)</span>
              </div>

              <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-border/40">
                {leaderboard.visibleFields?.maskUserName ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px]">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Mask User Names Enabled (e.g. J*** D**)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-medium bg-muted text-muted-foreground text-[11px]">
                    <Eye className="h-3.5 w-3.5" />
                    Public Display (Unmasked Names)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ranking Rule & Tie-Breaker */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Ranking Rules & Tie-Breaker
            </span>
            <div className="text-xs space-y-1">
              <span className="font-semibold text-foreground">
                Tie-Breaker:{" "}
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {leaderboard.rankingRules?.tieBreaker || "EARLIEST_ACHIEVED"}
                </span>
              </span>
              <p className="text-muted-foreground text-[11px]">
                {leaderboard.rankingRules?.tieBreaker === "TOTAL_ACTIVITY"
                  ? "Members with the same score are ranked by highest action count."
                  : leaderboard.rankingRules?.tieBreaker === "RANDOM_STABLE"
                  ? "Deterministic stable hash used to resolve score collisions."
                  : "First member to cross the milestone takes higher position."}
              </p>
            </div>
          </div>

          {/* Quick Embed Snippet Box */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Embed Snippet
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySnippet}
                className="h-7 text-xs gap-1.5 font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-zinc-800">
              {snippet}
            </pre>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground">
                Works in React, Vue, WordPress, Webflow, and HTML.
              </span>
              {onSelectEmbed && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onSelectEmbed(leaderboard.code);
                  }}
                  className="text-xs p-0 h-auto text-amber-600 dark:text-amber-400 font-semibold"
                >
                  View in SDK Hub →
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <SheetFooter className="p-4 border-t border-border bg-muted/20 flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {onToggleStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onToggleStatus(leaderboard, isActive ? "INACTIVE" : "ACTIVE")
                }
                className="h-8 text-xs gap-1 cursor-pointer"
              >
                {isActive ? (
                  <>
                    <PauseCircle className="h-3.5 w-3.5 text-amber-600" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-3.5 w-3.5 text-emerald-600" />
                    Activate
                  </>
                )}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onDelete(leaderboard);
                }}
                className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Close
            </Button>
            {onEdit && (
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(leaderboard);
                }}
                className="h-8 gap-1.5 text-xs font-medium bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Leaderboard
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default LeaderboardDetailsModal;
