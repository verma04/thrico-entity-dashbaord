"use client";

import React, { useState, useMemo } from "react";
import {
  EnterpriseLeaderboardConfig,
  EnterpriseLeaderboardStatus,
  useUpdateEnterpriseLeaderboard,
} from "@/graphql/actions/enterprise-leaderboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Archive,
  Code2,
  Copy,
  Check,
  Trophy,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { EditLeaderboardDialog } from "./edit-leaderboard-dialog";
import { DeleteLeaderboardDialog } from "./delete-leaderboard-dialog";

interface EnterpriseLeaderboardsTableProps {
  leaderboards: EnterpriseLeaderboardConfig[];
  loading?: boolean;
  onCreateNew: () => void;
  onSelectEmbed: (code: string) => void;
}

export function EnterpriseLeaderboardsTable({
  leaderboards,
  loading = false,
  onCreateNew,
  onSelectEmbed,
}: EnterpriseLeaderboardsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [periodFilter, setPeriodFilter] = useState<string>("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal states
  const [selectedLeaderboard, setSelectedLeaderboard] =
    useState<EnterpriseLeaderboardConfig | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [updateLeaderboard] = useUpdateEnterpriseLeaderboard({
    onCompleted: (data) => {
      const updated = data.updateEnterpriseLeaderboard;
      toast.success(
        `Leaderboard "${updated.name}" is now ${updated.status.toLowerCase()}`
      );
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update leaderboard status");
    },
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (lb: EnterpriseLeaderboardConfig) => {
    const newStatus: EnterpriseLeaderboardStatus =
      lb.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    updateLeaderboard({
      variables: {
        id: lb.id,
        input: {
          status: newStatus,
        },
      },
    });
  };

  const filtered = useMemo(() => {
    return leaderboards.filter((lb) => {
      // Search filter
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lb.name.toLowerCase().includes(q) ||
        lb.code.toLowerCase().includes(q) ||
        (lb.description && lb.description.toLowerCase().includes(q));

      // Status filter
      const matchesStatus =
        statusFilter === "ALL" || lb.status === statusFilter;

      // Period filter
      const matchesPeriod =
        periodFilter === "ALL" || lb.periodType === periodFilter;

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [leaderboards, searchTerm, statusFilter, periodFilter]);

  return (
    <div className="space-y-4">
      {/* ── Filter & Search Toolbar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, code slug..."
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs bg-background w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="ACTIVE" className="text-xs">Active</SelectItem>
              <SelectItem value="INACTIVE" className="text-xs">Inactive</SelectItem>
              <SelectItem value="ARCHIVED" className="text-xs">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Period Filter */}
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="h-8 text-xs bg-background w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Periods</SelectItem>
              <SelectItem value="DAILY" className="text-xs">Daily</SelectItem>
              <SelectItem value="WEEKLY" className="text-xs">Weekly</SelectItem>
              <SelectItem value="MONTHLY" className="text-xs">Monthly</SelectItem>
              <SelectItem value="QUARTERLY" className="text-xs">Quarterly</SelectItem>
              <SelectItem value="YEARLY" className="text-xs">Yearly</SelectItem>
              <SelectItem value="ALL_TIME" className="text-xs">All-Time</SelectItem>
              <SelectItem value="CUSTOM" className="text-xs">Custom Dates</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Button */}
        <Button
          size="sm"
          onClick={onCreateNew}
          className="h-8 gap-1.5 text-xs font-medium shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Leaderboard
        </Button>
      </div>

      {/* ── Table Content ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p>Loading enterprise leaderboards...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                {leaderboards.length === 0
                  ? "No Enterprise Leaderboards Yet"
                  : "No Leaderboards Match Your Filters"}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {leaderboards.length === 0
                  ? "Create your first headless leaderboard to power rankings on your website, intranet, or mobile app."
                  : "Try clearing your search query or adjusting the status and period filters."}
              </p>
            </div>
            {leaderboards.length === 0 && (
              <Button
                size="sm"
                onClick={onCreateNew}
                className="h-8 gap-1.5 text-xs font-medium mt-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Leaderboard
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3">
                  Leaderboard & Code
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Period / Cadence
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Visible Fields
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Page Size
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right pr-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lb) => {
                const isArchived = lb.status === "ARCHIVED";
                const isActive = lb.status === "ACTIVE";

                return (
                  <TableRow key={lb.id} className="hover:bg-muted/20 transition-colors">
                    {/* Name & Code */}
                    <TableCell className="py-3 font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-foreground">
                          {lb.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-primary border border-border select-all">
                            {lb.code}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(lb.code)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
                            title="Copy code slug"
                          >
                            {copiedCode === lb.code ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        {lb.description && (
                          <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {lb.description}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Period Type */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Badge variant="secondary" className="w-fit text-[10px] font-medium">
                          {lb.periodType}
                        </Badge>
                        {lb.periodType === "CUSTOM" && lb.startDate && lb.endDate && (
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(lb.startDate).toLocaleDateString()} -{" "}
                            {new Date(lb.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Visible Fields Pills */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {lb.visibleFields?.showAvatar && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50">
                            Avatar
                          </span>
                        )}
                        {lb.visibleFields?.showBadges && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50">
                            Badges
                          </span>
                        )}
                        {lb.visibleFields?.showRankMovement && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50">
                            +/- Move
                          </span>
                        )}
                        {lb.visibleFields?.maskUserName && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Masked
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Page Size */}
                    <TableCell>
                      <div className="text-xs text-foreground font-mono">
                        {lb.defaultPageSize || 20}{" "}
                        <span className="text-muted-foreground text-[10px]">
                          (max: {lb.maxPageSize || 100})
                        </span>
                      </div>
                    </TableCell>

                    {/* Status with Toggle */}
                    <TableCell>
                      {isArchived ? (
                        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 font-medium">
                          Archived
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={isActive}
                            onCheckedChange={() => handleToggleStatus(lb)}
                            className="scale-90"
                          />
                          <span
                            className={`text-xs font-medium ${
                              isActive
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectEmbed(lb.code)}
                          className="h-7 px-2 gap-1 text-[11px] font-medium bg-card border-border shadow-2xs hover:text-primary"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          Embed
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedLeaderboard(lb);
                                setShowEditDialog(true);
                              }}
                              className="text-xs cursor-pointer gap-2"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                              Edit Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCopyCode(lb.code)}
                              className="text-xs cursor-pointer gap-2"
                            >
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              Copy Code Slug
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedLeaderboard(lb);
                                setShowDeleteDialog(true);
                              }}
                              className="text-xs cursor-pointer gap-2 text-destructive focus:text-destructive"
                            >
                              <Archive className="h-3.5 w-3.5 text-destructive" />
                              Archive Board
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Dialog */}
      <EditLeaderboardDialog
        leaderboard={selectedLeaderboard}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Delete/Archive Dialog */}
      <DeleteLeaderboardDialog
        leaderboard={selectedLeaderboard}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
}
