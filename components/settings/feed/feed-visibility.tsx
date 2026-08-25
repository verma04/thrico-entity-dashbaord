"use client";

import React, { useState, useEffect } from "react";
import {
  Rss,
  MessageSquare,
  BarChart2,
  Users2,
  ShieldAlert,
  Film,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  useEntitySettings,
  useUpdateEntitySettings,
  useUpdateFeedEntityName,
} from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedVisibilitySettings {
  allowEntityCommunityInFeed: boolean;
  allowEntityDiscussionForumInFeed: boolean;
  allowEntityPollsInFeed: boolean;
  allowEntityMomentsInFeed: boolean;
  allowEntityFeedInFeed: boolean;
  feedEntityName: string;
}

export default function FeedVisibility() {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});
  const [updateFeedName, { loading: loadingName }] =
    useUpdateFeedEntityName({});

  const initialSettings: FeedVisibilitySettings = {
    allowEntityCommunityInFeed:
      data?.getEntitySettings?.allowEntityCommunityInFeed ?? true,
    allowEntityDiscussionForumInFeed:
      data?.getEntitySettings?.allowEntityDiscussionForumInFeed ?? true,
    allowEntityPollsInFeed:
      data?.getEntitySettings?.allowEntityPollsInFeed ?? true,
    allowEntityMomentsInFeed:
      data?.getEntitySettings?.allowEntityMomentsInFeed ?? true,
    allowEntityFeedInFeed:
      data?.getEntitySettings?.allowEntityFeedInFeed ?? true,
    feedEntityName: data?.getEntitySettings?.feedEntityName || "",
  };

  const [formData, setFormData] =
    useState<FeedVisibilitySettings>(initialSettings);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      const serverSettings: FeedVisibilitySettings = {
        allowEntityCommunityInFeed:
          data.getEntitySettings.allowEntityCommunityInFeed ?? true,
        allowEntityDiscussionForumInFeed:
          data.getEntitySettings.allowEntityDiscussionForumInFeed ?? true,
        allowEntityPollsInFeed:
          data.getEntitySettings.allowEntityPollsInFeed ?? true,
        allowEntityMomentsInFeed:
          data.getEntitySettings.allowEntityMomentsInFeed ?? true,
        allowEntityFeedInFeed:
          data.getEntitySettings.allowEntityFeedInFeed ?? true,
        feedEntityName: data.getEntitySettings.feedEntityName || "",
      };
      setFormData(serverSettings);
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (field: keyof FeedVisibilitySettings) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: !prev[field] };
      setHasChanged(true);
      return next;
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
      const next = { ...prev, feedEntityName: value };
      setHasChanged(true);
      return next;
    });
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowEntityCommunityInFeed:
          data.getEntitySettings.allowEntityCommunityInFeed ?? true,
        allowEntityDiscussionForumInFeed:
          data.getEntitySettings.allowEntityDiscussionForumInFeed ?? true,
        allowEntityPollsInFeed:
          data.getEntitySettings.allowEntityPollsInFeed ?? true,
        allowEntityMomentsInFeed:
          data.getEntitySettings.allowEntityMomentsInFeed ?? true,
        allowEntityFeedInFeed:
          data.getEntitySettings.allowEntityFeedInFeed ?? true,
        feedEntityName: data.getEntitySettings.feedEntityName || "",
      });
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      const cleanSettings = {
        allowEntityCommunityInFeed: formData.allowEntityCommunityInFeed,
        allowEntityDiscussionForumInFeed:
          formData.allowEntityDiscussionForumInFeed,
        allowEntityPollsInFeed: formData.allowEntityPollsInFeed,
        allowEntityMomentsInFeed: formData.allowEntityMomentsInFeed,
        allowEntityFeedInFeed: formData.allowEntityFeedInFeed,
      };

      const promises = [];

      promises.push(
        update({
          variables: { input: cleanSettings },
        }),
      );

      if (formData.feedEntityName !== data?.getEntitySettings?.feedEntityName) {
        promises.push(
          updateFeedName({
            variables: { name: formData.feedEntityName },
          }),
        );
      }

      await Promise.all(promises);
      toast.success("Feed protocols synchronized successfully.");
      setHasChanged(false);
    } catch (error) {
      toast.error("Failed to update feed parameters.");
      console.error(error);
    }
  };

  const activeSourcesCount = [
    formData.allowEntityCommunityInFeed,
    formData.allowEntityDiscussionForumInFeed,
    formData.allowEntityPollsInFeed,
    formData.allowEntityMomentsInFeed,
    formData.allowEntityFeedInFeed,
  ].filter(Boolean).length;

  const contentSources = [
    {
      key: "allowEntityCommunityInFeed" as const,
      label: "Show Communities in Feed",
      description:
        "Surface community group activities and member announcements in the main feed stream.",
      icon: Users2,
      enabled: formData.allowEntityCommunityInFeed,
    },
    {
      key: "allowEntityDiscussionForumInFeed" as const,
      label: "Show Forum Posts in Feed",
      description:
        "Allow structured discussion forum topics and questions to appear in the stream.",
      icon: MessageSquare,
      enabled: formData.allowEntityDiscussionForumInFeed,
    },
    {
      key: "allowEntityPollsInFeed" as const,
      label: "Show Polls & Votes in Feed",
      description:
        "Allow interactive community voting polls and opinion cards directly in member feeds.",
      icon: BarChart2,
      enabled: formData.allowEntityPollsInFeed,
    },
    {
      key: "allowEntityMomentsInFeed" as const,
      label: "Show Video Moments in Feed",
      description:
        "Surface short-form vertical video clips and milestone moments in feed cards.",
      icon: Film,
      enabled: formData.allowEntityMomentsInFeed,
    },
    {
      key: "allowEntityFeedInFeed" as const,
      label: `Show ${formData.feedEntityName || "Admin"} Announcements`,
      description:
        "Surface official administrative broadcasts, alerts, and pinned entity updates.",
      icon: ShieldAlert,
      enabled: formData.allowEntityFeedInFeed,
    },
  ];

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Stream Preview Card */}
            <PolarisSidebarCard
              title="Feed Stream Simulation"
              badge="Live Protocols"
              icon={Sparkles}
            >
              <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#303030] text-white flex items-center justify-center text-[10px] font-bold">
                      <Rss className="h-3 w-3" />
                    </div>
                    <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
                      {formData.feedEntityName || "Community"} Feed
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 px-1.5 py-0.2 rounded-[4px]"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Live
                  </Badge>
                </div>

                {/* Enabled Content Types Pill Cloud */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-[#616161] dark:text-zinc-400">
                    Active Stream Sources ({activeSourcesCount}/5):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {contentSources.map((source) => (
                      <Badge
                        key={source.key}
                        variant={source.enabled ? "secondary" : "outline"}
                        className={cn(
                          "text-[11px] px-2 py-0.5 rounded-[4px] flex items-center gap-1 transition-all",
                          source.enabled
                            ? "bg-white dark:bg-zinc-800 border-[#d2d5d9] text-[#303030] dark:text-zinc-200 shadow-2xs"
                            : "opacity-40 line-through border-dashed text-[#8c9196]",
                        )}
                      >
                        <source.icon className="h-3 w-3" />
                        <span>{source.label.replace("Show ", "")}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Configuration Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Official Brand Tag"
                  value={formData.feedEntityName || "Default (Admin)"}
                />
                <PolarisSummaryRow
                  label="Enabled Protocols"
                  value={`${activeSourcesCount} of 5 Active`}
                  highlight={activeSourcesCount >= 4}
                />
                <PolarisSummaryRow
                  label="Stream Architecture"
                  value="Multi-Source Unified"
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Engagement Strategy Tip */}
            <PolarisTipCard title="Feed Optimization Tip">
              Enabling interactive sources like community polls and moments
              increases member return rates and keeps the home stream fresh with
              dynamic discussions.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Section 1: Official Brand Identity */}
          <PolarisFormCard
            step={1}
            icon={Sparkles}
            title="Official Feed Identity"
            description="Customize the brand name attached to official entity publications and pinned alerts."
            badge="Branding"
          >
            <div className="space-y-3">
              <PolarisInput
                id="feedEntityName"
                name="feedEntityName"
                label="Feed Brand Display Name"
                placeholder="e.g. Acme Official, Community Team"
                value={formData.feedEntityName}
                onChange={handleNameChange}
                helperText="This custom name will appear as the author name on official entity posts."
                prefix={<Sparkles className="h-4 w-4" />}
              />
            </div>
          </PolarisFormCard>

          {/* Section 2: Content Stream Protocols */}
          <PolarisFormCard
            step={2}
            icon={Layers}
            title="Content Stream Sources"
            description="Control which modules automatically aggregate content into the central community feed."
            badge="Aggregation"
          >
            <div className="space-y-3">
              {contentSources.map((source) => (
                <div
                  key={source.key}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-[8px] border transition-all",
                    source.enabled
                      ? "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
                      : "border-[#e1e3e5] dark:border-zinc-800/60 bg-[#f6f6f7]/40 dark:bg-zinc-900/30 opacity-75",
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border",
                        source.enabled
                          ? "bg-[#f6f6f7] dark:bg-zinc-800 border-[#d2d5d9] text-[#303030] dark:text-zinc-100"
                          : "bg-transparent border-transparent text-[#8c9196]",
                      )}
                    >
                      <source.icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <PolarisLabel className="cursor-pointer">
                        {source.label}
                      </PolarisLabel>
                      <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                        {source.description}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={source.enabled}
                    onCheckedChange={() => handleToggle(source.key)}
                  />
                </div>
              ))}
            </div>
          </PolarisFormCard>
        </div>
      </PolarisFormLayout>

      {/* Floating Save Action Bar */}
      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={false}
        isSaving={loadingBtn || loadingName}
        onSave={handleSave}
        onReset={handleReset}
        title="Unsaved Feed Protocols"
        description="You have modified content aggregation parameters."
        buttonText="Save Protocols"
      />
    </div>
  );
}
