"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EnterpriseLeaderboardConfig,
  EnterprisePeriodType,
  EnterpriseLeaderboardStatus,
  useUpdateEnterpriseLeaderboard,
} from "@/graphql/actions/enterprise-leaderboard";
import { toast } from "sonner";
import {
  Settings2,
  Sliders,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  Lock,
} from "lucide-react";

interface EditLeaderboardDialogProps {
  leaderboard: EnterpriseLeaderboardConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PERIOD_OPTIONS: { value: EnterprisePeriodType; label: string; desc: string }[] = [
  { value: "MONTHLY", label: "Monthly", desc: "Resets on the 1st of every month" },
  { value: "WEEKLY", label: "Weekly", desc: "Resets every Monday" },
  { value: "DAILY", label: "Daily", desc: "24-hour sprint leaderboard" },
  { value: "QUARTERLY", label: "Quarterly", desc: "Every 3 calendar months" },
  { value: "YEARLY", label: "Annual", desc: "Calendar year leaderboard" },
  { value: "ALL_TIME", label: "All-Time", desc: "Cumulative lifetime standings" },
  { value: "CUSTOM", label: "Custom Dates", desc: "Defined start and end dates" },
];

const TIE_BREAKER_OPTIONS = [
  {
    value: "EARLIEST_ACHIEVED",
    label: "Earliest Timestamp (First to Reach Score)",
  },
  {
    value: "TOTAL_ACTIVITY",
    label: "Activity Count (Most Actions Completed)",
  },
  {
    value: "RANDOM_STABLE",
    label: "Deterministic Stable Tie-Breaker",
  },
];

export function EditLeaderboardDialog({
  leaderboard,
  open,
  onOpenChange,
  onSuccess,
}: EditLeaderboardDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<EnterpriseLeaderboardStatus>("ACTIVE");
  const [periodType, setPeriodType] = useState<EnterprisePeriodType>("MONTHLY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Ranking Rules
  const [tieBreaker, setTieBreaker] = useState("EARLIEST_ACHIEVED");

  // Visibility Settings
  const [showName, setShowName] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [showRankMovement, setShowRankMovement] = useState(true);
  const [maskUserName, setMaskUserName] = useState(false);
  const [badgeVisibility, setBadgeVisibility] = useState(true);

  // Pagination
  const [defaultPageSize, setDefaultPageSize] = useState("20");
  const [maxPageSize, setMaxPageSize] = useState("100");

  useEffect(() => {
    if (leaderboard) {
      setName(leaderboard.name || "");
      setDescription(leaderboard.description || "");
      setStatus(leaderboard.status || "ACTIVE");
      setPeriodType(leaderboard.periodType || "MONTHLY");
      setStartDate(leaderboard.startDate ? leaderboard.startDate.slice(0, 10) : "");
      setEndDate(leaderboard.endDate ? leaderboard.endDate.slice(0, 10) : "");
      setTieBreaker(leaderboard.rankingRules?.tieBreaker || "EARLIEST_ACHIEVED");

      setShowName(leaderboard.visibleFields?.showName ?? true);
      setShowAvatar(leaderboard.visibleFields?.showAvatar ?? true);
      setShowBadges(leaderboard.visibleFields?.showBadges ?? true);
      setShowRankMovement(leaderboard.visibleFields?.showRankMovement ?? true);
      setMaskUserName(leaderboard.visibleFields?.maskUserName ?? false);
      setBadgeVisibility(leaderboard.badgeVisibility ?? true);

      setDefaultPageSize(String(leaderboard.defaultPageSize || 20));
      setMaxPageSize(String(leaderboard.maxPageSize || 100));
    }
  }, [leaderboard]);

  const [updateLeaderboard, { loading }] = useUpdateEnterpriseLeaderboard({
    onCompleted: () => {
      toast.success("Leaderboard updated successfully");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update leaderboard");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderboard) return;

    const cleanName = name.trim();
    if (!cleanName) {
      toast.error("Please enter a leaderboard name");
      return;
    }

    if (periodType === "CUSTOM") {
      if (!startDate || !endDate) {
        toast.error("Custom period requires both Start Date and End Date");
        return;
      }
      if (new Date(startDate) >= new Date(endDate)) {
        toast.error("End Date must be after Start Date");
        return;
      }
    }

    updateLeaderboard({
      variables: {
        id: leaderboard.id,
        input: {
          name: cleanName,
          description: description.trim() || undefined,
          status,
          periodType,
          startDate: periodType === "CUSTOM" ? startDate : undefined,
          endDate: periodType === "CUSTOM" ? endDate : undefined,
          rankingRules: {
            tieBreaker,
            excludedUserIds: leaderboard.rankingRules?.excludedUserIds || [],
          },
          visibleFields: {
            showName,
            showAvatar,
            showBadges,
            showRankMovement,
            maskUserName,
          },
          badgeVisibility,
          defaultPageSize: parseInt(defaultPageSize, 10) || 20,
          maxPageSize: parseInt(maxPageSize, 10) || 100,
        },
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-[580px] w-full p-0 flex flex-col gap-0 border-l border-border bg-card overflow-hidden"
      >
        <SheetHeader className="p-6 border-b border-border/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold">
                Edit Leaderboard Settings
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Update parameters, status, and SDK visibility rules.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ── Basic Information ────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Identity & Status
            </div>

            {/* Read-Only Code */}
            <div className="space-y-1.5 p-2.5 rounded-lg border border-border/80 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3" /> Leaderboard Code (Permanent)
                </Label>
                <span className="text-[10px] text-muted-foreground font-mono">SDK Identifier</span>
              </div>
              <div className="font-mono text-xs text-foreground font-semibold">
                {leaderboard?.code}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Leaderboard Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SmartEarn Champions"
                  className="h-8 text-xs bg-background"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as EnterpriseLeaderboardStatus)}
                >
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE" className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Active (Accepting queries)
                    </SelectItem>
                    <SelectItem value="INACTIVE" className="text-xs font-medium text-muted-foreground">
                      Inactive (Suspended)
                    </SelectItem>
                    <SelectItem value="ARCHIVED" className="text-xs font-medium text-destructive">
                      Archived (Soft deleted)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Description (Optional)
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description for internal tracking or public leaderboard cards"
                className="text-xs bg-background min-h-[60px]"
                rows={2}
              />
            </div>
          </div>

          {/* ── Period & Schedule ────────────────────────────────────────────── */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Period & Reset Cadence
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Calculation Period
              </Label>
              <Select
                value={periodType}
                onValueChange={(v) => setPeriodType(v as EnterprisePeriodType)}
              >
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="Select period type" />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      <span className="font-medium">{opt.label}</span>
                      <span className="text-muted-foreground ml-2 text-[11px]">
                        — {opt.desc}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {periodType === "CUSTOM" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg border border-border/80 bg-muted/20">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-8 text-xs bg-background"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    End Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-8 text-xs bg-background"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Ranking & Tie-Breaker ───────────────────────────────────────── */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sliders className="h-3.5 w-3.5 text-primary" />
              Ranking Logic & Tie-Breaker
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Tie-Breaker Rule
              </Label>
              <Select value={tieBreaker} onValueChange={setTieBreaker}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="Select tie breaker" />
                </SelectTrigger>
                <SelectContent>
                  {TIE_BREAKER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Privacy & Field Visibility ──────────────────────────────────── */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Eye className="h-3.5 w-3.5 text-primary" />
              Public SDK Field Visibility & Privacy
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/20">
                <span className="text-xs font-medium text-foreground">Show Member Name</span>
                <Switch checked={showName} onCheckedChange={setShowName} />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/20">
                <span className="text-xs font-medium text-foreground">Show Avatar Image</span>
                <Switch checked={showAvatar} onCheckedChange={setShowAvatar} />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/20">
                <span className="text-xs font-medium text-foreground">Show Badges</span>
                <Switch checked={showBadges} onCheckedChange={setShowBadges} />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/20">
                <span className="text-xs font-medium text-foreground">Rank Movement (+/-)</span>
                <Switch checked={showRankMovement} onCheckedChange={setShowRankMovement} />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-muted/20 sm:col-span-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-foreground">Mask Member Names</span>
                  <p className="text-[10px] text-muted-foreground">
                    Anonymize names for privacy (e.g. "R****l S.")
                  </p>
                </div>
                <Switch checked={maskUserName} onCheckedChange={setMaskUserName} />
              </div>
            </div>
          </div>

          {/* ── Pagination Limits ───────────────────────────────────────────── */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Pagination & Page Sizes
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Default Page Size
                </Label>
                <Input
                  type="number"
                  value={defaultPageSize}
                  onChange={(e) => setDefaultPageSize(e.target.value)}
                  min={5}
                  max={50}
                  className="h-8 text-xs bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Max Page Size
                </Label>
                <Input
                  type="number"
                  value={maxPageSize}
                  onChange={(e) => setMaxPageSize(e.target.value)}
                  min={10}
                  max={100}
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>
          </div>

          </div>

          <SheetFooter className="p-4 border-t border-border bg-muted/20 shrink-0 flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-xs font-medium gap-1.5"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
