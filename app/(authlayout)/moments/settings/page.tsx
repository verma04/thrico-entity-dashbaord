"use client";

import React, { useState, useEffect } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import {
  Film,
  Globe,
  Video,
  Bell,
  Shield,
  ShieldCheck,
  Sparkles,
  PlaySquare,
  CheckCircle2,
  Rss,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

interface MomentsSettingsState {
  allowPublicMoments: boolean;
  enableShortUploads: boolean;
  allowEntityMomentsInFeed: boolean;
  uploadNotifications: boolean;
  autoModeration: boolean;
  moderatedFeed: boolean;
}

const DEFAULT_SETTINGS: MomentsSettingsState = {
  allowPublicMoments: true,
  enableShortUploads: true,
  allowEntityMomentsInFeed: true,
  uploadNotifications: false,
  autoModeration: true,
  moderatedFeed: false,
};

function MomentsSettingsPage() {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);

  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const [formData, setFormData] = useState<MomentsSettingsState>(() => ({
    ...DEFAULT_SETTINGS,
    allowEntityMomentsInFeed:
      data?.getEntitySettings?.allowEntityMomentsInFeed ?? true,
  }));
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData((prev) => ({
        ...prev,
        allowEntityMomentsInFeed:
          data.getEntitySettings.allowEntityMomentsInFeed ?? true,
      }));
    }
  }, [data]);

  const handleToggle = (key: keyof MomentsSettingsState) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanged(true);
      return next;
    });
  };

  const handleReset = () => {
    setFormData({
      ...DEFAULT_SETTINGS,
      allowEntityMomentsInFeed:
        data?.getEntitySettings?.allowEntityMomentsInFeed ?? true,
    });
    setHasChanged(false);
  };

  const handleSave = async () => {
    try {
      if (data?.getEntitySettings) {
        await update({
          variables: {
            input: {
              allowEntityMomentsInFeed: formData.allowEntityMomentsInFeed,
            },
          },
        });
      }
      toast.success(`${moduleName} settings synchronized successfully.`);
      setHasChanged(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${moduleName.toLowerCase()} settings.`);
    }
  };

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Media Stream Preview */}
            <PolarisSidebarCard
              title={`${moduleName} Stream`}
              badge="Media Engine"
              icon={Sparkles}
            >
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                      <Film className="h-3 w-3" />
                    </div>
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Video Discovery
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9.5px] font-bold gap-1 px-1.5 py-0 rounded-[3px]",
                      formData.allowPublicMoments
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
                    )}
                  >
                    {formData.allowPublicMoments ? "Public" : "Restricted"}
                  </Badge>
                </div>

                {/* Status breakdown */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Short-Form Uploads:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.enableShortUploads ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Main Feed Placement:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.allowEntityMomentsInFeed ? "Included" : "Hidden"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Moderation Mode:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.autoModeration ? "Automated AI" : "Manual Queue"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Rows */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Community Creator Uploads"
                  value={formData.enableShortUploads ? "Active" : "Paused"}
                  highlight={formData.enableShortUploads}
                />
                <PolarisSummaryRow
                  label="Feed Stream Synergy"
                  value={formData.allowEntityMomentsInFeed ? "Integrated" : "Standalone"}
                />
                <PolarisSummaryRow
                  label="Review Gate"
                  value={formData.moderatedFeed ? "Strict Moderation" : "Direct Publishing"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard title="Video Engagement Tip">
              Short video moments increase member dwell time by over 40%.
              Keeping <strong>Main Feed Placement</strong> active ensures highlights are seen
              by casual visitors.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Visibility & Creator Controls */}
          <PolarisFormCard
            step={1}
            title="Visibility & Creator Permissions"
            description="Configure discoverability parameters and creator upload rights."
            badge="Visibility"
          >
            <div className="space-y-2.5">
              {/* Allow Public Discoverability */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.allowPublicMoments
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Allow Public {moduleName}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.allowPublicMoments
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.allowPublicMoments ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Enable ecosystem-wide video discoverability so non-members can browse highlights.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.allowPublicMoments}
                  onCheckedChange={() => handleToggle("allowPublicMoments")}
                />
              </div>

              {/* Enable Short Uploads */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.enableShortUploads
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <Video className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Enable Member Video Uploads
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.enableShortUploads
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.enableShortUploads ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Allow registered community members to record, draft, and post {singularName.toLowerCase()} clips.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.enableShortUploads}
                  onCheckedChange={() => handleToggle("enableShortUploads")}
                />
              </div>

              {/* Surface in Main Feed */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.allowEntityMomentsInFeed
                        ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <Rss className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Show {moduleName} in Central Feed
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.allowEntityMomentsInFeed
                            ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.allowEntityMomentsInFeed ? "Included" : "Excluded"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Embed playable {singularName.toLowerCase()} video tiles into the central community feed timeline.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.allowEntityMomentsInFeed}
                  onCheckedChange={() => handleToggle("allowEntityMomentsInFeed")}
                />
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 2: Moderation & Quality Protocols */}
          <PolarisFormCard
            step={2}
            title="Moderation & Quality Protocols"
            description="Configure automated safety checks and manual moderation gateways."
            badge="Moderation"
          >
            <div className="space-y-2.5">
              {/* Content Auto-Moderation */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.autoModeration
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Automated AI Safety Screening
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.autoModeration
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.autoModeration ? "Active" : "Off"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Automatically screen uploaded clips against policy violations and copyright standards.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.autoModeration}
                  onCheckedChange={() => handleToggle("autoModeration")}
                />
              </div>

              {/* Moderated Feed Gate */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.moderatedFeed
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Require Admin Approval Before Publishing
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.moderatedFeed
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.moderatedFeed ? "Manual Queue" : "Instant"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Hold newly uploaded videos in a review queue before showing them to other members.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.moderatedFeed}
                  onCheckedChange={() => handleToggle("moderatedFeed")}
                />
              </div>

              {/* Upload Notifications */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.uploadNotifications
                        ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Admin Upload Alerts
                      </span>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Receive in-app and email notifications when members post new videos.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.uploadNotifications}
                  onCheckedChange={() => handleToggle("uploadNotifications")}
                />
              </div>
            </div>
          </PolarisFormCard>
        </div>

        {/* Floating Save Action Bar */}
        <FloatingSavePanel
          hasChanged={hasChanged}
          saved={false}
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleReset}
          title={`Save ${moduleName} Settings`}
          description={`You have unsaved changes to ${singularName.toLowerCase()} configuration parameters.`}
          buttonText="Save Settings"
        />
      </PolarisFormLayout>
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsSettingsPage, "MOMENTS", "canEdit"),
  "moments",
);
