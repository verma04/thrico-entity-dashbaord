"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  Eye,
  Sliders,
  Pin,
  Film,
  Video,
  Play,
  Check,
  Sparkles,
  Send,
  Heart,
  MessageSquare,
  Share2,
  Layers,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { ModuleTabItem } from "@/components/settings/shared/module-tab-manager";
import { Moment } from "@/graphql/actions/moments";
import { MomentsFormValues, PreviewTabId, PREVIEW_TABS } from "./types";
import { cn } from "@/lib/utils";

interface MomentsSettingsSidebarProps {
  previewTab: PreviewTabId;
  onSelectPreviewTab: (tab: PreviewTabId) => void;
  formValues: MomentsFormValues;
  singularName: string;
  activeTabs: ModuleTabItem[];
  allTabs: ModuleTabItem[];
  pinnedMomentIds: string[];
  momentsByIdMap: Map<string, Moment>;
}

export const MomentsSettingsSidebar: React.FC<MomentsSettingsSidebarProps> = ({
  previewTab,
  onSelectPreviewTab,
  formValues,
  singularName,
  activeTabs,
  allTabs,
  pinnedMomentIds,
  momentsByIdMap,
}) => {
  return (
    <div className="space-y-4">
      {/* Interactive Live Preview Card for All Components */}
      <PolarisSidebarCard
        title="Interactive Live Preview"
        badge={
          previewTab === "step1"
            ? "Upload Modal"
            : previewTab === "step2"
            ? "Trimmer View"
            : previewTab === "step3"
            ? "Publish View"
            : previewTab === "feed"
            ? "Feed Card"
            : previewTab === "pinned"
            ? "Pinned Feed"
            : "Navigation"
        }
        icon={Eye}
      >
        {/* Preview Mode Selector Pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 mb-3 overflow-x-auto scrollbar-none">
          {PREVIEW_TABS.map((t) => {
            const TabIcon = t.icon;
            const active = previewTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectPreviewTab(t.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-[5px] text-[10.5px] font-medium transition-all shrink-0 cursor-pointer",
                  active
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs"
                    : "text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-200"
                )}
              >
                <TabIcon className="h-3 w-3" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* View 1: Step 1 Upload / Select Video Screen */}
        {previewTab === "step1" && (
          <div
            className="rounded-xl border border-white/10 p-4 text-white space-y-3.5 shadow-xl relative overflow-hidden animate-in fade-in duration-200"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, #1a1f3d 0%, #0d1025 60%, #080a16 100%)",
            }}
          >
            <div className="flex items-center justify-between text-[10.5px] text-white/50 border-b border-white/10 pb-2">
              <span className="font-semibold text-white">Step 1 of 3</span>
              <span className="text-[9.5px] uppercase tracking-wider">Select Video</span>
            </div>

            {/* Center Pulse Circle with Video Icon */}
            <div className="flex justify-center pt-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Upload Title & Subtitle */}
            <div className="text-center space-y-1">
              <h4 className="text-[13px] font-bold text-white tracking-tight leading-snug">
                {formValues.momentsUploadTitle || `Capture the ${singularName}`}
              </h4>
              <p className="text-[10px] text-zinc-400 leading-tight">
                {formValues.momentsUploadDescription ||
                  "Share your story with the world in a vertical short-form video."}
              </p>
            </div>

            {/* Specs Box: Duration & Format */}
            <div className="rounded-lg bg-white/[0.06] border border-white/10 p-2 flex items-center justify-around text-center">
              <div>
                <div className="text-[8px] uppercase tracking-wider font-bold text-zinc-400">
                  Duration
                </div>
                <div className="text-[11px] font-extrabold text-white">
                  3-{formValues.momentsMaxDuration || 60}s
                </div>
              </div>
              <div className="w-px h-5 bg-white/10" />
              <div>
                <div className="text-[8px] uppercase tracking-wider font-bold text-zinc-400">
                  Format
                </div>
                <div className="text-[11px] font-extrabold text-white">
                  {formValues.momentsUploadFormat || "9:16"}
                </div>
              </div>
            </div>

            {/* Action Card Mock */}
            <div className="p-2.5 rounded-lg border border-indigo-500/30 bg-gradient-to-r from-indigo-600/20 to-indigo-600/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Film className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">
                    {formValues.momentsUploadCardTitle || "Select from Library"}
                  </div>
                  <div className="text-[9px] text-zinc-400 truncate">
                    {formValues.momentsUploadCardDescription ||
                      "Choose your best video or drag & drop here"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Step 2 Trimmer Screen */}
        {previewTab === "step2" && (
          <div
            className="rounded-xl border border-white/10 p-4 text-white space-y-3 shadow-xl relative overflow-hidden animate-in fade-in duration-200"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, #1a1f3d 0%, #0d1025 60%, #080a16 100%)",
            }}
          >
            <div className="flex items-center justify-between text-[10.5px] text-white/50 border-b border-white/10 pb-2">
              <span className="font-semibold text-white">Step 2 of 3</span>
              <span className="text-[9.5px] uppercase tracking-wider">Trim Video</span>
            </div>

            {/* Simulated Phone Video Player */}
            <div className="relative mx-auto w-32 aspect-[9/16] rounded-xl bg-black border border-white/15 overflow-hidden flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <div className="absolute bottom-1 right-1 text-[8.5px] px-1 py-0.2 bg-black/60 rounded text-white/80 font-mono">
                0:15
              </div>
            </div>

            {/* Trimmer Controls Box */}
            <div className="p-2.5 rounded-lg bg-white/[0.06] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-extrabold text-white">15.0s</div>
                  <div className="text-[8.5px] text-white/50 uppercase tracking-wider font-semibold">
                    Selected Span
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border-indigo-400/40"
                >
                  Max {formValues.momentsMaxDuration || 60}s
                </Badge>
              </div>

              {/* Timeline bar with selected window */}
              <div className="relative h-4 bg-white/10 rounded-md overflow-hidden flex items-center px-1">
                <div className="absolute left-[10%] w-[50%] h-full bg-indigo-500/50 border-x-2 border-indigo-400" />
              </div>

              {/* Sounds Good Button */}
              <div className="w-full h-8 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 shadow-md">
                <span>Sounds Good</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* View 3: Step 3 Post / Sharing Screen */}
        {previewTab === "step3" && (
          <div
            className="rounded-xl border border-white/10 p-4 text-white space-y-3 shadow-xl relative overflow-hidden animate-in fade-in duration-200"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, #1a1f3d 0%, #0d1025 60%, #080a16 100%)",
            }}
          >
            <div className="flex items-center justify-between text-[10.5px] text-white/50 border-b border-white/10 pb-2">
              <span className="font-semibold text-white">Step 3 of 3</span>
              <span className="text-[9.5px] uppercase tracking-wider">Post Details</span>
            </div>

            {/* Thumbnail & Caption Mock */}
            <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 flex gap-2.5">
              <div className="w-12 aspect-[9/16] rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 text-white/40">
                <Film className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-zinc-300 font-medium">Write a catchy caption...</div>
                <div className="text-[9px] text-zinc-500 mt-2">0/500 characters</div>
              </div>
            </div>

            {/* AI Label Disclosure Preview Card */}
            <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Sparkles className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">
                    {formValues.momentsAiLabelTitle || "Add AI Label"}
                  </div>
                  <div className="text-[9px] text-zinc-400 truncate">
                    {formValues.momentsAiLabelDescription || "Label realistic content made with AI."}
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8.5px] font-bold px-1 py-0 rounded-[2px]",
                  formValues.allowMomentsAiLabel
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                )}
              >
                {formValues.allowMomentsAiLabel ? "ON" : "OFF"}
              </Badge>
            </div>

            {/* Share in Feed Preview Card */}
            <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                <div className="w-6 h-6 rounded-md bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                  <Send className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">
                    {formValues.momentsShareInFeedTitle || "Share in Feed"}
                  </div>
                  <div className="text-[9px] text-zinc-400 truncate">
                    {formValues.momentsShareInFeedDescription || "Make this visible across your community feed"}
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8.5px] font-bold px-1 py-0 rounded-[2px]",
                  formValues.allowMomentsShareInFeed
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                )}
              >
                {formValues.allowMomentsShareInFeed ? "ON" : "OFF"}
              </Badge>
            </div>

            {/* Share CTA */}
            <div className="w-full h-8 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 shadow-md">
              <span>Share {singularName}</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* View 4: Feed Post Card Preview */}
        {previewTab === "feed" && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 space-y-2.5 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[11px] font-bold text-white">
                  AM
                </div>
                <div>
                  <div className="text-[11.5px] font-semibold text-[#303030] dark:text-zinc-100 leading-tight">
                    Alex Morgan
                  </div>
                  <div className="text-[9.5px] text-[#8c9196] leading-tight">@creator • 2h ago</div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8.5px] font-bold px-1 py-0 rounded-[2px]",
                  formValues.allowEntityMomentsInFeed
                    ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400"
                    : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                )}
              >
                {formValues.allowEntityMomentsInFeed ? "Included in Feed" : "Excluded"}
              </Badge>
            </div>

            {/* Video Tile with play overlay and AI badge */}
            <div className="relative aspect-[9/12] rounded-lg bg-zinc-900 overflow-hidden flex items-center justify-center shadow-inner">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>

              {formValues.allowMomentsAiLabel && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[8.5px] font-bold text-purple-300 border border-purple-400/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AI Generated</span>
                </div>
              )}

              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono font-medium text-white/90">
                0:15 / {formValues.momentsMaxDuration || 60}s
              </div>
            </div>

            {/* Feed Caption & Engagement */}
            <p className="text-[11px] text-[#303030] dark:text-zinc-200 leading-snug">
              Exploring new {singularName.toLowerCase()}s! #creation ✨
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-[#8c9196]">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>148</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>24</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </div>
            </div>
          </div>
        )}

        {/* View 5: Navigation Bar & Tabs Preview */}
        {previewTab === "navbar" && (
          <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-3 shadow-2xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                  Member Tab Strip
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] font-bold px-1.5 py-0 rounded-[3px] bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
              >
                {activeTabs.length} of {allTabs.length} Visible
              </Badge>
            </div>

            {/* Tabs Preview Pills */}
            <div className="space-y-1.5">
              {activeTabs.map((tab, idx) => {
                const TabIcon = tab.icon;
                return (
                  <div
                    key={tab.id}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 rounded-[4px] border text-[11.5px] transition-all",
                      idx === 0
                        ? "bg-white dark:bg-zinc-800 border-indigo-300 dark:border-indigo-700 font-semibold text-indigo-700 dark:text-indigo-300 shadow-2xs"
                        : "bg-white/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-[#616161] dark:text-zinc-300"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <TabIcon className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {tab.label || tab.defaultName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {tab.isCustom && (
                        <Badge
                          variant="outline"
                          className="text-[8.5px] px-1 py-0 rounded-[2px] bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                        >
                          {tab.momentIds?.length || 0} clips
                        </Badge>
                      )}
                      {idx === 0 && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Primary CTA Button Preview */}
            <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                Action Button:
              </span>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] bg-indigo-600 text-white text-[10.5px] font-medium shadow-2xs">
                <Plus className="h-3 w-3 stroke-[2.5px]" />
                <span>{formValues.ctaName || `Create ${singularName}`}</span>
              </div>
            </div>
          </div>
        )}

        {/* View 6: Pinned Discover Stream Preview */}
        {previewTab === "pinned" && (
          <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#e1e3e5] dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <Pin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                  Pinned Discover Stream
                </span>
              </div>
              <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 rounded-[3px] bg-indigo-50 text-indigo-700 border-indigo-200">
                {pinnedMomentIds.length} Pinned
              </Badge>
            </div>

            {pinnedMomentIds.length === 0 ? (
              <div className="p-3 text-center text-[11px] text-[#8c9196]">
                No moments currently pinned to Discover.
              </div>
            ) : (
              <div className="space-y-1.5">
                {pinnedMomentIds.map((id, idx) => {
                  const moment = momentsByIdMap.get(id);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 p-1.5 rounded-[4px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-2xs"
                    >
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 w-4 text-center">
                        #{idx + 1}
                      </span>
                      {moment?.thumbnailUrl ? (
                        <img
                          src={moment.thumbnailUrl}
                          alt=""
                          className="h-7 w-7 rounded-[3px] object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-[3px] bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center shrink-0 text-[#8c9196]">
                          <Film className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium truncate text-[#303030] dark:text-zinc-100">
                          {moment?.caption || "Untitled Moment"}
                        </p>
                        <span className="text-[9.5px] text-[#8c9196] block truncate">
                          {moment?.owner ? `${moment.owner.firstName || ""} ${moment.owner.lastName || ""}`.trim() : "Member"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </PolarisSidebarCard>

      {/* Settings Overview Card */}
      <PolarisSidebarCard
        title="Overview & Metrics"
        badge="Parameters"
        icon={Sliders}
      >
        <div className="space-y-1">
          <PolarisSummaryRow
            label="Discover Tab"
            value="Always Active"
            highlight
          />
          <PolarisSummaryRow
            label="Pinned Moments"
            value={`${pinnedMomentIds.length} Pinned`}
            highlight={pinnedMomentIds.length > 0}
          />
          <PolarisSummaryRow
            label="Custom Tabs"
            value={`${allTabs.filter((t) => t.isCustom).length} Created`}
          />
          <PolarisSummaryRow
            label="Max Duration"
            value={`${formValues.momentsMaxDuration}s (${formValues.momentsMaxDuration > 60 ? (formValues.momentsMaxDuration / 60).toFixed(1) + "m" : formValues.momentsMaxDuration + "s"})`}
            highlight
          />
          <PolarisSummaryRow
            label="Share in Feed"
            value={formValues.allowMomentsShareInFeed ? "Enabled" : "Disabled"}
            highlight={formValues.allowMomentsShareInFeed}
          />
          <PolarisSummaryRow
            label="Instant Publish (≤16MB)"
            value={formValues.allowMomentsInstantPublish ? "Enabled" : "Disabled"}
            highlight={formValues.allowMomentsInstantPublish}
          />
          <PolarisSummaryRow
            label="AI Content Label"
            value={formValues.allowMomentsAiLabel ? "Enabled" : "Disabled"}
          />
          <PolarisSummaryRow
            label="Feed Integration"
            value={formValues.allowEntityMomentsInFeed ? "Included" : "Excluded"}
          />
        </div>
      </PolarisSidebarCard>

      <PolarisTipCard title="Pro-Tip">
        Click any of the preview tabs above (Upload, Trimmer, Publish, Feed, Nav, Pinned) to see exactly how your settings render for your community in real time.
      </PolarisTipCard>
    </div>
  );
};
