"use client";

import React, { useState } from "react";
import {
  EnterpriseLeaderboardConfig,
  EnterpriseLeaderboardStatus,
  EnterpriseClient,
} from "@/graphql/actions/enterprise-leaderboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { safeFormat } from "@/lib/date-utils";
import {
  Trophy,
  Copy,
  Check,
  Code2,
  ShieldAlert,
  Edit2,
  Trash2,
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  Archive,
  Eye,
  Info,
  Plus,
} from "lucide-react";

interface EnterpriseLeaderboardsTableProps {
  leaderboards: EnterpriseLeaderboardConfig[];
  client?: EnterpriseClient | null;
  loading?: boolean;
  viewMode?: "table" | "grid";
  onCreateNew: () => void;
  onSelectEmbed: (code: string) => void;
  onInspectLeaderboard?: (leaderboard: EnterpriseLeaderboardConfig) => void;
  onEditLeaderboard?: (leaderboard: EnterpriseLeaderboardConfig) => void;
  onToggleStatus: (
    leaderboard: EnterpriseLeaderboardConfig,
    nextStatus: EnterpriseLeaderboardStatus
  ) => void;
  onDeleteLeaderboard: (leaderboard: EnterpriseLeaderboardConfig) => void;
}

export function EnterpriseLeaderboardsTable({
  leaderboards,
  client,
  loading = false,
  viewMode = "table",
  onCreateNew,
  onSelectEmbed,
  onInspectLeaderboard,
  onEditLeaderboard,
  onToggleStatus,
  onDeleteLeaderboard,
}: EnterpriseLeaderboardsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [leaderboardToDelete, setLeaderboardToDelete] =
    useState<EnterpriseLeaderboardConfig | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Leaderboard code "${code}" copied`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyEmbedSnippet = (code: string, id: string) => {
    const clientId = client?.clientId || "YOUR_CLIENT_ID";
    const snippet = `<div id="thrico-leaderboard" data-code="${code}"></div>\n<script src="https://cdn.thrico.io/leaderboard.v1.js" data-client="${clientId}"></script>`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    toast.success("Embed script snippet copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPeriodBadge = (period: string) => {
    switch (period) {
      case "DAILY":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800">
            DAILY BLITZ
          </span>
        );
      case "WEEKLY":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800">
            WEEKLY SPRINT
          </span>
        );
      case "MONTHLY":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            MONTHLY LEAGUE
          </span>
        );
      case "QUARTERLY":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
            QUARTERLY OKR
          </span>
        );
      case "YEARLY":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
            ANNUAL CUP
          </span>
        );
      case "ALL_TIME":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
            HALL OF FAME
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
            CUSTOM DATES
          </span>
        );
    }
  };

  const getStatusBadge = (lb: EnterpriseLeaderboardConfig) => {
    const isActive = lb.status === "ACTIVE";
    const isInactive = lb.status === "INACTIVE";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition-all cursor-pointer ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : isInactive
                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive
                  ? "bg-emerald-500 animate-pulse"
                  : isInactive
                  ? "bg-amber-500"
                  : "bg-zinc-400"
              }`}
            />
            {lb.status}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36 text-xs">
          <DropdownMenuItem onClick={() => onToggleStatus(lb, "ACTIVE")}>
            <PlayCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" />
            Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(lb, "INACTIVE")}>
            <PauseCircle className="h-3.5 w-3.5 mr-2 text-amber-600" />
            Inactive
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(lb, "ARCHIVED")}>
            <Archive className="h-3.5 w-3.5 mr-2 text-zinc-500" />
            Archived
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const deleteConfirmationDialog = (
    <AlertDialog
      open={!!leaderboardToDelete}
      onOpenChange={(open) => {
        if (!open) setLeaderboardToDelete(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Leaderboard?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {leaderboardToDelete?.name}
            </span>{" "}
            (
            <code className="font-mono text-xs">
              {leaderboardToDelete?.code}
            </code>
            )? This will permanently remove the configuration. Web embeds and headless API calls referencing this slug will fail.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setLeaderboardToDelete(null)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (leaderboardToDelete) {
                onDeleteLeaderboard(leaderboardToDelete);
                setLeaderboardToDelete(null);
              }
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-700 cursor-pointer"
          >
            Delete Leaderboard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs p-12 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span>Loading enterprise leaderboards & telemetry…</span>
        </div>
      </div>
    );
  }

  if (leaderboards.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs p-12 text-center space-y-3">
        <div className="h-10 w-10 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
          <Trophy className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-foreground">No Leaderboards Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Create your first headless leaderboard or choose from ready-made blueprints to power rankings on your apps and websites.
        </p>
        <Button
          size="sm"
          onClick={onCreateNew}
          className="h-8 gap-1.5 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer mt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Leaderboard
        </Button>
      </div>
    );
  }

  // ── Grid View ─────────────────────────────────────────────────────────────
  if (viewMode === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaderboards.map((lb) => (
            <Card
              key={lb.id}
              className="border-border/60 bg-card shadow-2xs hover:border-amber-300 dark:hover:border-amber-700/60 transition-all flex flex-col justify-between group"
            >
              <CardContent className="p-4 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="space-y-1 min-w-0 cursor-pointer"
                    onClick={() => onInspectLeaderboard?.(lb)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-foreground truncate group-hover:text-amber-600 transition-colors">
                        {lb.name}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <span>slug:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold truncate">
                        {lb.code}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(lb)}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {getPeriodBadge(lb.periodType)}
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Page: {lb.defaultPageSize} (max {lb.maxPageSize})
                  </Badge>
                  {lb.visibleFields?.maskUserName ? (
                    <Badge
                      variant="secondary"
                      className="text-[10px] gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200"
                    >
                      <ShieldAlert className="h-2.5 w-2.5" />
                      Masked
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-[10px] gap-1 bg-muted text-muted-foreground"
                    >
                      <Eye className="h-2.5 w-2.5" />
                      Public
                    </Badge>
                  )}
                </div>

                {/* Embed Snippet Box */}
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-mono text-muted-foreground select-all">
                    data-code=&quot;{lb.code}&quot;
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyEmbedSnippet(lb.code, lb.id)}
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy embed snippet"
                  >
                    {copiedId === lb.id ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-[10.5px] text-muted-foreground">
                    {safeFormat(lb.createdAt, "MMM d, yyyy")}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onInspectLeaderboard?.(lb)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Inspect Leaderboard Details"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onSelectEmbed(lb.code)}
                      className="h-7 text-xs gap-1 font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 cursor-pointer"
                    >
                      <Code2 className="h-3 w-3" />
                      Embed →
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 text-xs">
                        <DropdownMenuItem onClick={() => onInspectLeaderboard?.(lb)}>
                          <Info className="h-3.5 w-3.5 mr-2" />
                          Inspect Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditLeaderboard?.(lb)}>
                          <Edit2 className="h-3.5 w-3.5 mr-2" />
                          Edit Leaderboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCopyEmbedSnippet(lb.code, lb.id)}
                        >
                          <Copy className="h-3.5 w-3.5 mr-2" />
                          Copy Embed Snippet
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSelectEmbed(lb.code)}>
                          <Code2 className="h-3.5 w-3.5 mr-2" />
                          View in SDK Hub
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setLeaderboardToDelete(lb)}
                          className="text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete Leaderboard
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {deleteConfirmationDialog}
      </>
    );
  }

  // ── Table View ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-5 py-3.5 font-bold">Leaderboard Name & Slug</th>
                <th className="px-5 py-3.5 font-bold">Cadence / Period</th>
                <th className="px-5 py-3.5 font-bold">Visible Fields</th>
                <th className="px-5 py-3.5 font-bold">Pagination</th>
                <th className="px-5 py-3.5 font-bold">Embed Code</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {leaderboards.map((lb) => (
                <tr
                  key={lb.id}
                  className="hover:bg-muted/20 transition-colors group"
                >
                  {/* Name & Slug */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40 shrink-0">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div
                          onClick={() => onInspectLeaderboard?.(lb)}
                          className="font-bold text-xs text-foreground group-hover:text-amber-600 transition-colors truncate max-w-[220px] cursor-pointer"
                          title={lb.name}
                        >
                          {lb.name}
                        </div>
                        <div className="text-[10.5px] font-mono text-muted-foreground flex items-center gap-1">
                          <span>slug:</span>
                          <span className="text-amber-600 dark:text-amber-400 font-semibold truncate max-w-[150px]">
                            {lb.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(lb.code, lb.id)}
                            className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy slug"
                          >
                            {copiedId === lb.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cadence / Period */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {getPeriodBadge(lb.periodType)}
                  </td>

                  {/* Visible Fields */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                      {lb.visibleFields?.maskUserName ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          <ShieldAlert className="h-2.5 w-2.5" />
                          Masked Names
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                          Public
                        </span>
                      )}
                      {lb.visibleFields?.showAvatar !== false && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                          Avatar
                        </span>
                      )}
                      {lb.visibleFields?.showBadges !== false && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                          Badges
                        </span>
                      )}
                      {lb.visibleFields?.showRankMovement !== false && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                          ▲/▼
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Pagination */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="font-mono text-xs text-foreground">
                      {lb.defaultPageSize} items
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      max {lb.maxPageSize}
                    </div>
                  </td>

                  {/* Embed Snippet Quick Copy */}
                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                      <span className="truncate max-w-[140px] select-all">
                        data-code=&quot;{lb.code}&quot;
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmbedSnippet(lb.code, lb.id)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        title="Copy HTML embed snippet"
                      >
                        {copiedId === lb.id ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {getStatusBadge(lb)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onInspectLeaderboard?.(lb)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Inspect Leaderboard Details"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelectEmbed(lb.code)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="View Embed & SDK Code"
                      >
                        <Code2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditLeaderboard?.(lb)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Edit Leaderboard"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuItem onClick={() => onInspectLeaderboard?.(lb)}>
                            <Info className="h-3.5 w-3.5 mr-2" />
                            Inspect Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditLeaderboard?.(lb)}>
                            <Edit2 className="h-3.5 w-3.5 mr-2" />
                            Edit Leaderboard
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyEmbedSnippet(lb.code, lb.id)}
                          >
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            Copy Embed Snippet
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onSelectEmbed(lb.code)}>
                            <Code2 className="h-3.5 w-3.5 mr-2" />
                            View in SDK Hub
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setLeaderboardToDelete(lb)}
                            className="text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete Leaderboard
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {deleteConfirmationDialog}
    </>
  );
}

export default EnterpriseLeaderboardsTable;
