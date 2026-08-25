"use client";

import React, { useState, useEffect } from "react";
import { Images, MessageCircle, Sparkles, CheckCircle2, MessageSquareText } from "lucide-react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
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
import {
  EcosystemWrapper,
  EcosystemHeader,
  EcosystemContainer,
} from "@/components/layout/ecosystem";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaGallerySettingsState {
  allowMediaGalleryComments: boolean;
}

const MediaGallerySettings = () => {
  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const initialSettings: MediaGallerySettingsState = {
    allowMediaGalleryComments:
      data?.getEntitySettings?.allowMediaGalleryComments ?? true,
  };

  const [formData, setFormData] =
    useState<MediaGallerySettingsState>(initialSettings);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData({
        allowMediaGalleryComments:
          data.getEntitySettings.allowMediaGalleryComments ?? true,
      });
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (key: keyof MediaGallerySettingsState) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanged(true);
      return next;
    });
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowMediaGalleryComments:
          data.getEntitySettings.allowMediaGalleryComments ?? true,
      });
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      await update({
        variables: {
          input: {
            allowMediaGalleryComments: formData.allowMediaGalleryComments,
          },
        },
      });
      toast.success("Media gallery settings synchronized successfully.");
      setHasChanged(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update media gallery settings.");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Media Gallery Framework"
        description="Control the media gallery experience, album interactions, and member comments."
        badgeText="Gallery"
        icon={Images}
        breadcrumbs={[
          { label: "Media Gallery", href: "/media-gallery" },
          { label: "Settings" },
        ]}
      />
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              {/* Live Gallery State Preview */}
              <PolarisSidebarCard
                title="Gallery Protocols"
                badge="Media State"
                icon={Sparkles}
              >
                <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                        <Images className="h-3 w-3" />
                      </div>
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Album Feedback
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9.5px] font-bold gap-1 px-1.5 py-0 rounded-[3px]",
                        formData.allowMediaGalleryComments
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.allowMediaGalleryComments ? "Open" : "Disabled"}
                    </Badge>
                  </div>

                  {/* Status breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#616161]">
                      <span>Image Comments:</span>
                      <span className="font-semibold text-[#303030] dark:text-zinc-200">
                        {formData.allowMediaGalleryComments
                          ? "Allowed (Public)"
                          : "Locked"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#616161]">
                      <span>Moderation Rights:</span>
                      <span className="font-semibold text-[#303030] dark:text-zinc-200">
                        Admin Moderated
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary Rows */}
                <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                  <PolarisSummaryRow
                    label="Image Commentary"
                    value={formData.allowMediaGalleryComments ? "Permitted" : "Disabled"}
                    highlight={formData.allowMediaGalleryComments}
                  />
                  <PolarisSummaryRow
                    label="Admin Moderation"
                    value="Always Enabled"
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* Tip Card */}
              <PolarisTipCard title="Gallery Engagement Tip">
                Allowing comments on album photos encourages storytelling and event memories.
                Administrators can delete inappropriate comments directly from the lightbox view.
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-3.5">
            {/* Section 1: Interaction & Comment Policy */}
            <PolarisFormCard
              step={1}
              title="Interaction & Discussion Policy"
              description="Configure whether members can participate in conversations under media gallery items."
              badge="Comments"
            >
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.allowMediaGalleryComments
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <MessageSquareText className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Allow Member Comments on Images
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.allowMediaGalleryComments
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.allowMediaGalleryComments ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      When enabled, community members can leave comments on images and albums in the media gallery.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.allowMediaGalleryComments}
                  onCheckedChange={() => handleToggle("allowMediaGalleryComments")}
                />
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
            title="Save Media Gallery Settings"
            description="You have unsaved changes to gallery interaction protocols."
            buttonText="Save Settings"
          />
        </PolarisFormLayout>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default MediaGallerySettings;
