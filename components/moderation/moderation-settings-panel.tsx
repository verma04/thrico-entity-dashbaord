"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetModerationSettings,
  useUpdateModerationSettings,
  useGetAiModerationSettings,
  useUpdateAiModerationSettings,
} from "@/graphql/moderation/hooks";
import { AiModerationSettings } from "@/graphql/moderation/types";
import { toast } from "sonner";
import {
  Settings,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Users,
  Save,
  RotateCcw,
  BrainCircuit,
  Loader2,
  MessageSquare,
  Radio,
  MessageCircle,
  Calendar,
  MessagesSquare,
  Briefcase,
  Compass,
  Store,
  ShoppingBag,
  Tag,
  TrendingUp,
  ClipboardCheck,
  BarChart2,
  Sparkles,
  Layers,
  CheckCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { PlatformContainer } from "@/components/ui/platform/container";
import { cn } from "@/lib/utils";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";

interface AiModuleConfig {
  key: keyof AiModerationSettings;
  label: string;
  category: string;
  description: string;
  icon: React.ElementType;
}

const AI_MODULES: AiModuleConfig[] = [
  {
    key: "aiModerationFeed",
    label: "Feed Posts & Moments",
    category: "Content & Media",
    description: "Scan ecosystem posts and multimedia moments for spam, hate speech, explicit visuals, and policy breaches.",
    icon: Radio,
  },
  {
    key: "aiModerationComments",
    label: "Comments & Discussions",
    category: "Engagement",
    description: "Analyze thread replies and comment chains to suppress toxicity, troll attacks, and repetitive bot activity.",
    icon: MessageCircle,
  },
  {
    key: "aiModerationCommunities",
    label: "Communities & Groups",
    category: "Social Hubs",
    description: "Validate group titles, descriptions, and rules against hate speech, fraudulent schemes, and brand impersonation.",
    icon: Users,
  },
  {
    key: "aiModerationDiscussionForums",
    label: "Discussion Forums",
    category: "Communication",
    description: "Detect provocative arguments, spam threads, and policy-violating topics in community forum boards.",
    icon: MessagesSquare,
  },
  {
    key: "aiModerationEvents",
    label: "Events & Meetups",
    category: "Activities",
    description: "Inspect event descriptions, registration criteria, and host details to prevent deceptive or dangerous gatherings.",
    icon: Calendar,
  },
  {
    key: "aiModerationJobs",
    label: "Job Postings",
    category: "Commerce & Career",
    description: "Filter out fraudulent employment offers, pyramid schemes, illegal requests, and misleading compensation.",
    icon: Briefcase,
  },
  {
    key: "aiModerationMentorship",
    label: "Mentorship Programs",
    category: "Commerce & Career",
    description: "Scan mentor bios, objective proposals, and session agendas for deceptive claims and unprofessional conduct.",
    icon: Compass,
  },
  {
    key: "aiModerationListing",
    label: "Marketplace & Classifieds",
    category: "Commerce & Career",
    description: "Flag prohibited goods, counterfeit products, fraudulent pricing, and prohibited transactions.",
    icon: Store,
  },
  {
    key: "aiModerationShop",
    label: "Shop & Products",
    category: "Commerce & Career",
    description: "Evaluate product listings, item descriptions, and digital inventory against prohibited goods guidelines.",
    icon: ShoppingBag,
  },
  {
    key: "aiModerationOffers",
    label: "Offers & Perks",
    category: "Commerce & Career",
    description: "Inspect promotional claims, coupon codes, and reward criteria for misleading advertisements.",
    icon: Tag,
  },
  {
    key: "aiModerationOpportunities",
    label: "Opportunities & Grants",
    category: "Content & Media",
    description: "Verify collaboration requests, partner proposals, and grant opportunities for authenticity and safety.",
    icon: TrendingUp,
  },
  {
    key: "aiModerationSurveys",
    label: "Research Surveys",
    category: "Engagement",
    description: "Monitor survey questions and multiple-choice options for intrusive personal data harvesting and offensive prompts.",
    icon: ClipboardCheck,
  },
  {
    key: "aiModerationPolls",
    label: "Sentiment Polls",
    category: "Engagement",
    description: "Review member-created poll questions and voting options for sensitive, harassing, or manipulative themes.",
    icon: BarChart2,
  },
  {
    key: "aiModerationStories",
    label: "Stories & Highlights",
    category: "Content & Media",
    description: "Autonomous computer vision and NLP scanning for story slides, stickers, and ephemeral updates.",
    icon: Sparkles,
  },
];

export function ModerationSettingsPanel() {
  const { data, loading, error, refetch } = useGetModerationSettings();
  const [updateSettings, { loading: updating }] = useUpdateModerationSettings();

  const {
    data: aiData,
    loading: aiLoading,
    refetch: refetchAi,
  } = useGetAiModerationSettings();
  const [updateAiSettings, { loading: updatingAi }] = useUpdateAiModerationSettings();

  const [settings, setSettings] = useState({
    autoModerationEnabled: true,
    bannedWordsAction: "FLAG",
    blockedLinksAction: "BLOCK",
    spamDetectionEnabled: true,
    spamThreshold: 80,
    autoFlagThreshold: 3,
    autoHideThreshold: 5,
  });

  const [aiSettings, setAiSettings] = useState<AiModerationSettings>({
    aiModerationFeed: true,
    aiModerationComments: true,
    aiModerationEvents: true,
    aiModerationCommunities: true,
    aiModerationDiscussionForums: true,
    aiModerationJobs: true,
    aiModerationMentorship: true,
    aiModerationListing: true,
    aiModerationShop: true,
    aiModerationOffers: true,
    aiModerationOpportunities: true,
    aiModerationSurveys: true,
    aiModerationPolls: true,
    aiModerationStories: true,
  });

  const [originalSettings, setOriginalSettings] = useState<any>(null);
  const [originalClassifications, setOriginalClassifications] = useState<any>(null);
  const [originalAiSettings, setOriginalAiSettings] = useState<AiModerationSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [classificationDefinitions, setClassificationDefinitions] = useState({
    safe: "Content that adheres to all community guidelines and contains no harmful signals.",
    spam: "Unsolicited, repetitive, or strictly promotional content that degrades user experience.",
    offensive: "Content that may be disturbing, rude, or contains profanity that breaches etiquette.",
    harassment: "Targeted attacks, bullying, or persistent unwanted interaction towards specific individuals."
  });

  useEffect(() => {
    if (data?.getModerationSettings) {
      const { id, __typename, aiClassificationDefinitions, ...rest } = data.getModerationSettings;
      setSettings(rest as any);
      setOriginalSettings(rest as any);
      if (aiClassificationDefinitions) {
        setClassificationDefinitions(aiClassificationDefinitions);
        setOriginalClassifications(aiClassificationDefinitions);
      } else {
        setOriginalClassifications({});
      }
    }
  }, [data]);

  useEffect(() => {
    if (aiData?.getAiModerationSettings) {
      const { __typename, ...rest } = aiData.getAiModerationSettings;
      setAiSettings(rest as AiModerationSettings);
      setOriginalAiSettings(rest as AiModerationSettings);
    }
  }, [aiData]);

  const generalHasChanged = originalSettings 
    ? JSON.stringify(settings) !== JSON.stringify(originalSettings) || 
      JSON.stringify(classificationDefinitions) !== JSON.stringify(originalClassifications)
    : false;

  const aiHasChanged = originalAiSettings
    ? JSON.stringify(aiSettings) !== JSON.stringify(originalAiSettings)
    : false;

  const hasChanged = generalHasChanged || aiHasChanged;
  const isSaving = updating || updatingAi;

  const handleToggleAiModule = (key: keyof AiModerationSettings) => {
    setAiSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSetAllAiModules = (enable: boolean) => {
    const updated = { ...aiSettings };
    AI_MODULES.forEach((mod) => {
      updated[mod.key] = enable;
    });
    setAiSettings(updated);
  };

  const handleReset = () => {
    if (originalSettings) setSettings(originalSettings);
    if (originalClassifications) setClassificationDefinitions(originalClassifications);
    if (originalAiSettings) setAiSettings(originalAiSettings);
  };

  const handleSave = async () => {
    try {
      const promises: Promise<any>[] = [];
      if (generalHasChanged) {
        promises.push(
          updateSettings({
            variables: {
              input: {
                ...settings,
                aiClassificationDefinitions: classificationDefinitions,
              },
            },
          })
        );
      }
      if (aiHasChanged) {
        promises.push(
          updateAiSettings({
            variables: {
              input: aiSettings,
            },
          })
        );
      }
      await Promise.all(promises);
      toast.success("Moderation settings updated");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      refetch();
      refetchAi();
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    }
  };

  if (error) {
    return (
      <div className="p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-600">
        <p className="text-sm font-medium">
          Failed to load moderation settings.
        </p>
      </div>
    );
  }

  return (
    <PlatformContainer className="py-0">
      {/* ── Page Header ── */}
      <EcosystemHeader
        title="Moderation Engine"
        description="Global parameters for content filtering, reporting thresholds, and automated safety protocols."
        badgeText="Safety"
        icon={Settings}
        breadcrumbs={[
          { label: "Moderation", href: "/moderation" },
          { label: "Settings" }
        ]}
        actions={
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-background/50 backdrop-blur shadow-sm",
            settings.autoModerationEnabled ? "text-emerald-600 border-emerald-100" : "text-muted-foreground border-border"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              settings.autoModerationEnabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {settings.autoModerationEnabled ? "Active" : "Disabled"}
            </span>
          </div>
        }
      />

      <div className="grid gap-6 max-w-4xl mt-2">
          {/* Master Toggle */}

          <div className="p-5 rounded-xl border border-border bg-card flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                  settings.autoModerationEnabled
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Global Auto-Moderation
                </p>
                <p className="text-xs text-muted-foreground">
                  Toggle all autonomous content review pipelines across the
                  platform.
                </p>
              </div>
            </div>
            <Switch
              checked={settings.autoModerationEnabled}
              onCheckedChange={(c) =>
                setSettings({ ...settings, autoModerationEnabled: c })
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Content Filters */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-bold text-foreground">
                  Policy Enforcement
                </p>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Banned Words Policy
                  </Label>
                  <Select
                    value={settings.bannedWordsAction}
                    onValueChange={(v) =>
                      setSettings({ ...settings, bannedWordsAction: v })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FLAG" className="font-medium">
                        Flag for Review
                      </SelectItem>
                      <SelectItem value="BLOCK" className="font-medium">
                        Block Immediately
                      </SelectItem>
                      <SelectItem value="REPLACE" className="font-medium">
                        Obfuscate (***)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Restricted Link Policy
                  </Label>
                  <Select
                    value={settings.blockedLinksAction}
                    onValueChange={(v) =>
                      setSettings({ ...settings, blockedLinksAction: v })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BLOCK" className="font-medium">
                        Block Immediately
                      </SelectItem>
                      <SelectItem value="WARN" className="font-medium">
                        Warn User
                      </SelectItem>
                      <SelectItem value="FLAG" className="font-medium">
                        Flag for Review
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* AI Intelligence */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-bold text-foreground">
                    Automated Protection
                  </p>
                </div>
                <Switch
                  checked={settings.spamDetectionEnabled}
                  onCheckedChange={(c) =>
                    setSettings({ ...settings, spamDetectionEnabled: c })
                  }
                />
              </div>
              <div className="p-5 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Sensitivity Threshold
                    </Label>
                    <span className="text-sm font-bold text-emerald-600 font-mono">
                      {settings.spamThreshold}%
                    </span>
                  </div>
                  <Slider
                    value={[settings.spamThreshold]}
                    max={100}
                    step={1}
                    onValueChange={([v]) =>
                      setSettings({ ...settings, spamThreshold: v })
                    }
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                    <span>Aggressive</span>
                    <span>Lenient</span>
                  </div>
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/50">
                  System analyzes linguistic patterns and metadata to predict spam.
                  Higher sensitivity targets borderline behavior.
                </p>
              </div>
            </div>
          </div>

          {/* AI Autonomous Module Sentinel Matrix */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      AI Module Sentinel Matrix
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[9.5px] font-bold px-1.5 py-0 rounded-[4px] bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                    >
                      {Object.values(aiSettings).filter(Boolean).length} / 14 Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Granular autonomous inspection and content safety per ecosystem vertical.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetAllAiModules(true)}
                  className="h-7 text-[11px] font-medium gap-1 px-2.5 rounded-md hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                >
                  <CheckCheck className="h-3 w-3" />
                  Enable All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetAllAiModules(false)}
                  className="h-7 text-[11px] font-medium gap-1 px-2.5 rounded-md hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                >
                  <XCircle className="h-3 w-3" />
                  Disable All
                </Button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="px-5 py-2.5 border-b border-border/60 bg-muted/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {["All", "Communication", "Commerce & Career", "Engagement", "Content & Media", "Social Hubs", "Activities"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-semibold rounded-full transition-colors whitespace-nowrap",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Modules Grid */}
            <div className="p-5 grid sm:grid-cols-2 gap-3.5">
              {AI_MODULES.filter(
                (mod) => selectedCategory === "All" || mod.category === selectedCategory
              ).map((mod) => {
                const IconComponent = mod.icon;
                const isEnabled = !!aiSettings[mod.key];

                return (
                  <div
                    key={mod.key}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3",
                      isEnabled
                        ? "bg-card border-border shadow-2xs hover:border-border/80"
                        : "bg-muted/20 border-border/50 opacity-75 hover:opacity-100"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                            isEnabled
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
                              : "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] font-bold text-foreground">
                              {mod.label}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                                isEnabled
                                  ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                                  : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                              )}
                            >
                              {isEnabled ? "Protected" : "Bypassed"}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-[15px]">
                            {mod.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={() => handleToggleAiModule(mod.key)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Classification Definitions */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-bold text-foreground">
                  Classification Taxonomy
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] font-bold uppercase tracking-tight h-5"
              >
                Informational
              </Badge>
            </div>
            <div className="p-6">
              <div className="mb-8 p-4 bg-muted/30 border border-border/50 rounded-lg">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Define the criteria and behavioral expectations for each automated filter
                  classification label used across the entity. <strong className="text-foreground">The more detailed text and examples you provide, the better the system becomes at accurately classifying content.</strong>
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { key: "safe", label: "Safe", icon: "✅", color: "emerald", desc: "Baseline for acceptable community interactions." },
                  { key: "spam", label: "Spam", icon: "🚫", color: "amber", desc: "Unwanted promotional or repetitive content." },
                  { key: "offensive", label: "Offensive", icon: "⚠️", color: "orange", desc: "Profanity, disturbing imagery, or rude behavior." },
                  { key: "harassment", label: "Harassment", icon: "🚨", color: "rose", desc: "Targeted attacks, hate speech, or bullying." },
                ].map((item) => (
                  <div key={item.key} className="space-y-4 p-5 rounded-xl border border-border/60 bg-muted/10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-transparent",
                            `bg-${item.color}-100 text-${item.color}-700`,
                          )}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <Label className="text-base font-bold text-foreground block">
                            {item.label} Definition
                          </Label>
                          <span className="text-xs text-muted-foreground font-medium">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px] font-mono", (classificationDefinitions[item.key as keyof typeof classificationDefinitions]?.length || 0) > 0 ? "text-indigo-600 bg-indigo-50 border-indigo-200" : "text-muted-foreground")}>
                        {classificationDefinitions[item.key as keyof typeof classificationDefinitions]?.length || 0} chars
                      </Badge>
                    </div>

                    <div className="pt-2">
                      <Textarea 
                         value={classificationDefinitions[item.key as keyof typeof classificationDefinitions] || ""}
                         onChange={(e) => setClassificationDefinitions({
                            ...classificationDefinitions,
                            [item.key]: e.target.value
                         })}
                         className="min-h-[140px] text-[14px] leading-relaxed resize-y focus:ring-indigo-500/20 bg-background shadow-sm border-border/80"
                         placeholder={`Enter the specific criteria used to identify ${item.label.toLowerCase()} content. Feel free to add as much text as needed—include detailed guidelines, specific examples, and critical edge cases...`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                <Cpu className="h-5 w-5 text-indigo-600 shrink-0" />
                <p className="text-[11px] text-indigo-900 leading-normal">
                  <strong>System Training Signal:</strong> Definitions set here are
                  used to fine-tune the heuristic assessment thresholds and
                  provide context for manual moderation reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Community Reporting */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-bold text-foreground">
                Community Consensus
              </p>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Auto-Flag Count
                </Label>
                <Input
                  type="number"
                  value={settings.autoFlagThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoFlagThreshold: parseInt(e.target.value) || 0,
                    })
                  }
                  className="h-10 text-sm font-bold"
                />
                <p className="text-[11px] text-muted-foreground leading-snug pt-1">
                  Reports required to automatically move content into the manual
                  review queue.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Auto-Hide Count
                </Label>
                <Input
                  type="number"
                  value={settings.autoHideThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoHideThreshold: parseInt(e.target.value) || 0,
                    })
                  }
                  className="h-10 text-sm font-bold"
                />
                <p className="text-[11px] text-muted-foreground leading-snug pt-1">
                  Critical threshold where content is hidden from the public
                  feed until manually verified.
                </p>
              </div>
            </div>
          </div>
      </div>

      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={saved}
        isSaving={isSaving}
        onSave={handleSave}
        onReset={handleReset}
      />
    </PlatformContainer>
  );
}
