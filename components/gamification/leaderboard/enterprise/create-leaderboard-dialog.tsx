"use client";

import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateEnterpriseLeaderboard,
  EnterprisePeriodType,
} from "@/graphql/actions/enterprise-leaderboard";
import { toast } from "sonner";
import {
  Trophy,
  Sliders,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Crown,
  Flame,
  Shield,
  Target,
  Shuffle,
  Check,
  RotateCcw,
  Code2,
  Copy,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

interface CreateLeaderboardDialogProps {
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

interface BlueprintPreset {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  defaultName: string;
  codeSlug: string;
  description: string;
  periodType: EnterprisePeriodType;
  tieBreaker: string;
  showName: boolean;
  showAvatar: boolean;
  showBadges: boolean;
  showRankMovement: boolean;
  maskUserName: boolean;
  badgeVisibility: boolean;
  defaultPageSize: string;
  maxPageSize: string;
  tagline: string;
}

const BLUEPRINT_PRESETS: BlueprintPreset[] = [
  {
    id: "weekly_sprint",
    name: "Weekly Sprint",
    badge: "High Velocity",
    icon: Zap,
    defaultName: "Weekly Sprint Velocity",
    codeSlug: "weekly_sprint_velocity",
    description: "Dynamic weekly sprint leaderboard resetting Mondays at 00:00 UTC to maintain steady user momentum.",
    periodType: "WEEKLY",
    tieBreaker: "EARLIEST_ACHIEVED",
    showName: true,
    showAvatar: true,
    showBadges: true,
    showRankMovement: true,
    maskUserName: false,
    badgeVisibility: true,
    defaultPageSize: "10",
    maxPageSize: "50",
    tagline: "Resets Mondays • Fast paced • Top 10 focus",
  },
  {
    id: "monthly_champions",
    name: "Monthly League",
    badge: "Most Popular",
    icon: Trophy,
    defaultName: "Monthly Champions League",
    codeSlug: "monthly_champions_league",
    description: "Core monthly rankings resetting on the 1st of every calendar month for regular reward distributions.",
    periodType: "MONTHLY",
    tieBreaker: "TOTAL_ACTIVITY",
    showName: true,
    showAvatar: true,
    showBadges: true,
    showRankMovement: true,
    maskUserName: false,
    badgeVisibility: true,
    defaultPageSize: "20",
    maxPageSize: "100",
    tagline: "Resets 1st of month • Activity weighted • Quota friendly",
  },
  {
    id: "daily_blitz",
    name: "Daily Blitz",
    badge: "Retention",
    icon: Flame,
    defaultName: "Daily Blitz Challenge",
    codeSlug: "daily_blitz_challenge",
    description: "24-hour rapid streak leaderboard designed for continuous daily active retention and micro-competitions.",
    periodType: "DAILY",
    tieBreaker: "EARLIEST_ACHIEVED",
    showName: true,
    showAvatar: true,
    showBadges: true,
    showRankMovement: true,
    maskUserName: false,
    badgeVisibility: true,
    defaultPageSize: "10",
    maxPageSize: "25",
    tagline: "24-hour cycle • Speed tie-breaker • Daily active streaks",
  },
  {
    id: "all_time_hall",
    name: "Hall of Fame",
    badge: "Prestige",
    icon: Crown,
    defaultName: "All-Time Hall of Fame",
    codeSlug: "all_time_hall_of_fame",
    description: "Cumulative lifetime standings honoring top-tier contributors, veterans, and VIP members permanently.",
    periodType: "ALL_TIME",
    tieBreaker: "EARLIEST_ACHIEVED",
    showName: true,
    showAvatar: true,
    showBadges: true,
    showRankMovement: true,
    maskUserName: false,
    badgeVisibility: true,
    defaultPageSize: "25",
    maxPageSize: "100",
    tagline: "Cumulative lifetime • Permanent rank • VIP status",
  },
  {
    id: "privacy_external",
    name: "Privacy / Web Embed",
    badge: "GDPR Safe",
    icon: Shield,
    defaultName: "External Partner Showcase",
    codeSlug: "external_partner_showcase",
    description: "Privacy-first ranking board with masked member names and anonymized profiles for public website embedding.",
    periodType: "MONTHLY",
    tieBreaker: "RANDOM_STABLE",
    showName: true,
    showAvatar: false,
    showBadges: true,
    showRankMovement: true,
    maskUserName: true,
    badgeVisibility: true,
    defaultPageSize: "10",
    maxPageSize: "50",
    tagline: "Masked names • Safe for public iframe / web embeds",
  },
  {
    id: "quarterly_milestone",
    name: "Quarterly OKRs",
    badge: "Corporate",
    icon: Target,
    defaultName: "Quarterly Milestone Race",
    codeSlug: "quarterly_milestone_race",
    description: "Strategic quarterly performance and target leaderboard resetting every 3 calendar months.",
    periodType: "QUARTERLY",
    tieBreaker: "TOTAL_ACTIVITY",
    showName: true,
    showAvatar: true,
    showBadges: true,
    showRankMovement: true,
    maskUserName: false,
    badgeVisibility: true,
    defaultPageSize: "20",
    maxPageSize: "100",
    tagline: "90-day cycle • Target focused • Corporate quarterly",
  },
];

const NAME_CATEGORIES = ["All", "Sales", "Engineering", "Community", "Retention"] as const;
type NameCategory = (typeof NAME_CATEGORIES)[number];

const NAME_SUGGESTIONS_BY_CATEGORY: Record<NameCategory, { label: string; desc: string }[]> = {
  All: [
    { label: "Monthly Champions League", desc: "Flagship monthly leaderboard tracking cumulative performance" },
    { label: "Sprint Velocity Heroes", desc: "Fast-moving sprint competition rewarding rapid task turnaround" },
    { label: "All-Time Hall of Fame", desc: "Permanent lifetime achievement ranking for VIP members" },
    { label: "Revenue Titans Club", desc: "Top quota achievers and sales pipeline leaders" },
    { label: "7-Day Streak Masters", desc: "Continuous daily engagement and retention scoreboard" },
    { label: "Quarterly OKR Champions", desc: "Quarterly target achievement and strategic OKR race" },
    { label: "Rising Star Contributors", desc: "Recognizing rapid breakthrough contributors and new members" },
    { label: "Bug Squashers & Builders", desc: "Engineering velocity and code quality leaderboard" },
  ],
  Sales: [
    { label: "Revenue Titans Club", desc: "Top sales closers and revenue generators" },
    { label: "President's Circle", desc: "Annualized elite club for the top 5% performers" },
    { label: "Deal Velocity Champions", desc: "Fastest pipeline conversion and closed deals" },
    { label: "Pipeline Pioneers", desc: "New business development and outreach leaders" },
    { label: "Golden Quota Achievers", desc: "Monthly quota over-attainment scoreboard" },
  ],
  Engineering: [
    { label: "Code Maestros", desc: "Top engineering velocity and pull request contributions" },
    { label: "Bug Squashers & Builders", desc: "Most QA resolutions and verified defect fixes" },
    { label: "Ship-It Velocity Sprint", desc: "Fastest feature delivery and sprint completion" },
    { label: "Architecture All-Stars", desc: "Core system resilience and architectural upgrades" },
    { label: "Hackathon Innovators", desc: "Innovation sprint and prototype competition" },
  ],
  Community: [
    { label: "Community Advocates", desc: "Top community forum contributors and discussion leaders" },
    { label: "Superfans & Champions", desc: "Most enthusiastic brand and community ambassadors" },
    { label: "Impact Trailblazers", desc: "Highest peer appreciation and helpful responses" },
    { label: "Hall of Fame VIPs", desc: "Long-standing veteran members and mentors" },
    { label: "Rising Voices Guild", desc: "Breakout active newcomers in community channels" },
  ],
  Retention: [
    { label: "7-Day Streak Masters", desc: "Unbroken consecutive daily activity champions" },
    { label: "Daily Blitz Race", desc: "High-energy 24-hour sprint for daily active retention" },
    { label: "Daily XP Leaderboard", desc: "Daily task and micro-quest completion points" },
    { label: "Weekend Sprint Clash", desc: "Weekend-only competitive sprint leaderboard" },
    { label: "Momentum Multipliers", desc: "Week-over-week engagement growth leaders" },
  ],
};

export function CreateLeaderboardDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateLeaderboardDialogProps) {
  // Form State
  const [code, setCode] = useState("");
  const [autoCode, setAutoCode] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

  // Suggestions & Blueprint States
  const [activeBlueprintId, setActiveBlueprintId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NameCategory>("All");
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [copiedSdk, setCopiedSdk] = useState(false);

  const [createLeaderboard, { loading }] = useCreateEnterpriseLeaderboard({
    onCompleted: () => {
      toast.success("Leaderboard created successfully");
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create leaderboard");
    },
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setActiveBlueprintId(null);
    if (autoCode) {
      setCode(slugify(val));
    }
  };

  const applyBlueprint = (preset: BlueprintPreset) => {
    setActiveBlueprintId(preset.id);
    setName(preset.defaultName);
    setCode(preset.codeSlug);
    setAutoCode(false);
    setDescription(preset.description);
    setPeriodType(preset.periodType);
    setTieBreaker(preset.tieBreaker);
    setShowName(preset.showName);
    setShowAvatar(preset.showAvatar);
    setShowBadges(preset.showBadges);
    setShowRankMovement(preset.showRankMovement);
    setMaskUserName(preset.maskUserName);
    setBadgeVisibility(preset.badgeVisibility);
    setDefaultPageSize(preset.defaultPageSize);
    setMaxPageSize(preset.maxPageSize);

    toast.info(`Applied "${preset.name}" blueprint`);
  };

  const applyNameSuggestion = (suggestion: { label: string; desc: string }) => {
    setName(suggestion.label);
    if (autoCode) {
      setCode(slugify(suggestion.label));
    }
    if (!description.trim() || description.startsWith("Dynamic") || description.startsWith("Core") || description.startsWith("Flagship")) {
      setDescription(suggestion.desc);
    }
    toast.info(`Applied suggestion: "${suggestion.label}"`);
  };

  const handleShuffleSuggestions = () => {
    setShuffleIndex((prev) => prev + 1);
  };

  const handleCopySdk = () => {
    const slug = code.trim().toLowerCase() || "leaderboard_code";
    navigator.clipboard.writeText(`thrico.leaderboard.getEntries("${slug}")`);
    setCopiedSdk(true);
    toast.success("SDK query snippet copied!");
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  const resetForm = () => {
    setCode("");
    setAutoCode(true);
    setName("");
    setDescription("");
    setPeriodType("MONTHLY");
    setStartDate("");
    setEndDate("");
    setTieBreaker("EARLIEST_ACHIEVED");
    setShowName(true);
    setShowAvatar(true);
    setShowBadges(true);
    setShowRankMovement(true);
    setMaskUserName(false);
    setBadgeVisibility(true);
    setDefaultPageSize("20");
    setMaxPageSize("100");
    setActiveBlueprintId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = code.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      toast.error("Please enter a leaderboard name");
      return;
    }

    if (!cleanCode) {
      toast.error("Please enter a unique leaderboard code slug");
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(cleanCode)) {
      toast.error("Code can only contain lowercase letters, numbers, hyphens, and underscores");
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

    createLeaderboard({
      variables: {
        input: {
          code: cleanCode,
          name: cleanName,
          description: description.trim() || undefined,
          periodType,
          startDate: periodType === "CUSTOM" ? startDate : undefined,
          endDate: periodType === "CUSTOM" ? endDate : undefined,
          rankingRules: {
            tieBreaker,
            excludedUserIds: [],
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

  // Visible suggestions computed with shuffle offset
  const rawSuggestions = NAME_SUGGESTIONS_BY_CATEGORY[selectedCategory];
  const offset = shuffleIndex % rawSuggestions.length;
  const currentSuggestions = [
    ...rawSuggestions.slice(offset),
    ...rawSuggestions.slice(0, offset),
  ].slice(0, 5);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-[620px] w-full p-0 flex flex-col gap-0 border-l border-border bg-card overflow-hidden"
      >
        <SheetHeader className="p-6 border-b border-border/80 shrink-0 bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-semibold text-foreground">
                  Create Enterprise Leaderboard
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                  Configure a new headless ranking board for web embed or native SDK integration.
                </SheetDescription>
              </div>
            </div>

            {activeBlueprintId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                title="Clear blueprint and start fresh"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            )}
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* ── Suggested Starter Blueprints ─────────────────────────────────── */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-3.5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Suggested Starter Blueprints</span>
                  <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0 h-4 border-primary/30 text-primary bg-primary/5">
                    1-Click Apply
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Auto-fills settings & rules
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BLUEPRINT_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = activeBlueprintId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyBlueprint(preset)}
                      className={`relative flex flex-col items-start text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-xs"
                          : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mb-1 text-primary">
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs font-semibold text-foreground truncate">
                          {preset.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 leading-tight">
                        {preset.tagline}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-[9px] px-1 py-0.2 rounded bg-muted/60 text-muted-foreground font-mono">
                          {preset.periodType.toLowerCase()}
                        </span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-muted/60 text-muted-foreground">
                          p.{preset.defaultPageSize}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Basic Information ────────────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  Identity & Naming
                </div>

                {/* Shuffle Suggestions Button */}
                <button
                  type="button"
                  onClick={handleShuffleSuggestions}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  title="Shuffle name suggestions"
                >
                  <Shuffle className="h-3 w-3" />
                  <span>Shuffle Ideas</span>
                </button>
              </div>

              {/* Name Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                <span className="text-[10px] text-muted-foreground font-medium shrink-0 mr-1">
                  Ideas:
                </span>
                {NAME_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5">
                {currentSuggestions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => applyNameSuggestion(item)}
                    className={`text-[11px] px-2 py-1 rounded-md border text-left transition-all cursor-pointer ${
                      name === item.label
                        ? "border-primary bg-primary/10 text-primary font-medium shadow-2xs"
                        : "border-border/70 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-muted/40"
                    }`}
                    title={item.desc}
                  >
                    <span className="inline-block mr-1 text-[10px] text-primary">✦</span>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Leaderboard Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. SmartEarn Champions"
                    className="h-8 text-xs bg-background"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-foreground">
                      Code Slug <span className="text-destructive">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={() => setAutoCode(!autoCode)}
                      className="text-[10px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {autoCode ? "Manual Slug" : "Auto Slug"}
                    </button>
                  </div>
                  <Input
                    value={code}
                    onChange={(e) => {
                      setAutoCode(false);
                      setCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_"));
                    }}
                    placeholder="e.g. smartearn_champions"
                    className="h-8 text-xs font-mono bg-background"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Used in SDK: <code className="font-mono text-primary font-semibold">getEntries("{code || "slug"}")</code>
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Description (Optional)
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for public leaderboard header or internal tracking"
                  className="text-xs bg-background min-h-[58px]"
                  rows={2}
                />
              </div>
            </div>

            {/* ── Period & Reset Cadence ───────────────────────────────────────── */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Period & Reset Cadence
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Controls leaderboard cycle
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Calculation Period
                </Label>
                <Select
                  value={periodType}
                  onValueChange={(v) => {
                    setPeriodType(v as EnterprisePeriodType);
                    setActiveBlueprintId(null);
                  }}
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

            {/* ── Ranking Logic & Tie-Breaker ─────────────────────────────────── */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Sliders className="h-3.5 w-3.5 text-primary" />
                Ranking Logic & Tie-Breaker
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Tie-Breaker Rule
                </Label>
                <Select
                  value={tieBreaker}
                  onValueChange={(val) => {
                    setTieBreaker(val);
                    setActiveBlueprintId(null);
                  }}
                >
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
                <p className="text-[10px] text-muted-foreground">
                  When members have equal points, this deterministically decides who ranks higher.
                </p>
              </div>
            </div>

            {/* ── Public SDK Field Visibility & Privacy ───────────────────────── */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  Public SDK Field Visibility & Privacy
                </div>
                {maskUserName && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    GDPR Privacy Mode
                  </Badge>
                )}
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
                      Anonymize names for privacy (e.g. "R****l S.") for external web embeds
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

            {/* ── Live Configuration Insights & SDK Embed Preview ────────────── */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <span>Configuration Insights</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySdk}
                  className="flex items-center gap-1 text-[10px] text-primary hover:underline cursor-pointer"
                >
                  {copiedSdk ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy SDK Call</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground space-y-1 leading-relaxed">
                {periodType === "DAILY" && (
                  <p>
                    ⚡ <strong className="text-foreground">Daily Sprint:</strong> Best paired with 10–20 page size and "Earliest Timestamp" tie-breaker to incentivize rapid daily engagement.
                  </p>
                )}
                {periodType === "WEEKLY" && (
                  <p>
                    📅 <strong className="text-foreground">Weekly Sprint:</strong> Resets every Monday at 00:00 UTC. Ideal for weekly team retrospectives, sales sprints, and active customer loops.
                  </p>
                )}
                {periodType === "MONTHLY" && (
                  <p>
                    🏆 <strong className="text-foreground">Monthly League:</strong> Resets on the 1st of each month. Standard for sales quotas, active user programs, and monthly rewards.
                  </p>
                )}
                {periodType === "QUARTERLY" && (
                  <p>
                    🎯 <strong className="text-foreground">Quarterly OKRs:</strong> Resets every 3 calendar months. Ideal for corporate targets and sustained seasonal milestones.
                  </p>
                )}
                {periodType === "ALL_TIME" && (
                  <p>
                    👑 <strong className="text-foreground">Hall of Fame:</strong> Lifetime cumulative score. Avatar and Badge visibility recommended to showcase VIP status.
                  </p>
                )}
                {periodType === "CUSTOM" && (
                  <p>
                    📆 <strong className="text-foreground">Custom Campaign:</strong> Perfect for time-boxed hackathons, product launch events, and seasonal holiday sprints.
                  </p>
                )}
                {maskUserName && (
                  <p className="text-amber-600 dark:text-amber-400">
                    🔒 <strong className="text-foreground">Privacy Protection:</strong> Names are anonymized (e.g. "J*** D.") for public website embeds to safeguard user PII.
                  </p>
                )}
              </div>

              {/* Code Preview Bar */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-background/80 border border-border/60 text-[10px] font-mono text-muted-foreground">
                <span className="truncate">
                  <span className="text-primary font-semibold">thrico</span>.leaderboard.getEntries("
                  <span className="text-foreground font-semibold">{code.trim() || "slug"}</span>")
                </span>
                <Code2 className="h-3 w-3 shrink-0 text-muted-foreground ml-2" />
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
              {loading ? "Creating..." : "Create Leaderboard"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
