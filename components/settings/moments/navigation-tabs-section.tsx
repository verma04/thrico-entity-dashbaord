"use client";

import React, { useState, useMemo } from "react";
import { FormikProps } from "formik";
import {
  Sliders,
  Eye,
  Plus,
  Video,
  Layers,
  Flame,
  Link as LinkIcon,
  Check,
  Search,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import {
  ModuleTabManager,
  ModuleTabItem,
} from "@/components/settings/shared/module-tab-manager";
import {
  MomentsFormValues,
  MomentsCtaType,
  resolveMomentsCtaPath,
} from "./types";
import {
  useGetMomentCampaigns,
  MomentCampaign,
} from "@/graphql/actions/moments/campaigns";
import { cn } from "@/lib/utils";

interface NavigationTabsSectionProps {
  formik: FormikProps<MomentsFormValues>;
  singularName: string;
  onPreviewNavbar: () => void;
  onAddCustomTab: () => void;
  onCurateTab: (tabId: string) => void;
  onDeleteCustomTab: (tabId: string) => void;
}

interface CtaModeOption {
  type: MomentsCtaType;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultPath: string;
}

const CTA_MODE_OPTIONS: CtaModeOption[] = [
  {
    type: "CREATE",
    title: "Standard Create Flow",
    subtitle: "Directs members to upload studio or video recorder (/moments/create)",
    badge: "Default Flow",
    icon: Video,
    defaultPath: "/moments/create",
  },
  {
    type: "CAMPAIGNS_ALL",
    title: "All Campaigns Hub",
    subtitle: "Directs members to browse and participate in all active campaigns",
    badge: "Directory",
    icon: Layers,
    defaultPath: "/moments/campaigns",
  },
  {
    type: "SPECIFIC_CAMPAIGN",
    title: "Specific Campaign",
    subtitle: "Pins the action directly to a selected challenge or frame composer",
    badge: "Targeted",
    icon: Flame,
    defaultPath: "/moments/campaigns/:id",
  },
  {
    type: "CUSTOM",
    title: "Custom Route",
    subtitle: "Specify any custom internal dashboard path or deep link",
    badge: "Custom Link",
    icon: LinkIcon,
    defaultPath: "/moments/create",
  },
];

export const NavigationTabsSection: React.FC<NavigationTabsSectionProps> = ({
  formik,
  singularName,
  onPreviewNavbar,
  onAddCustomTab,
  onCurateTab,
  onDeleteCustomTab,
}) => {
  const [campaignSearch, setCampaignSearch] = useState("");
  const [isChangingCampaign, setIsChangingCampaign] = useState(false);

  // Fetch campaigns for Specific Campaign selector
  const { data: campaignsData, loading: campaignsLoading, refetch: refetchCampaigns } =
    useGetMomentCampaigns({
      pagination: { page: 1, limit: 100 },
    });

  const campaignsList: MomentCampaign[] = useMemo(() => {
    return campaignsData?.getMomentCampaigns?.data || [];
  }, [campaignsData]);

  const filteredCampaigns = useMemo(() => {
    if (!campaignSearch.trim()) return campaignsList;
    const q = campaignSearch.toLowerCase();
    return campaignsList.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)),
    );
  }, [campaignsList, campaignSearch]);

  const selectedCampaign = useMemo(() => {
    if (!formik.values.ctaCampaignId) return null;
    return campaignsList.find((c) => c.id === formik.values.ctaCampaignId) || null;
  }, [campaignsList, formik.values.ctaCampaignId]);

  const handleTabsChange = (updatedTabs: ModuleTabItem[]) => {
    formik.setFieldValue("tabs", updatedTabs);
  };

  const currentCtaType: MomentsCtaType = formik.values.ctaType || "CREATE";

  const handleSelectMode = (mode: MomentsCtaType) => {
    formik.setFieldValue("ctaType", mode);
    if (mode === "CREATE") {
      formik.setFieldValue("ctaPath", "/moments/create");
    } else if (mode === "CAMPAIGNS_ALL") {
      formik.setFieldValue("ctaPath", "/moments/campaigns");
    } else if (mode === "SPECIFIC_CAMPAIGN") {
      if (selectedCampaign) {
        formik.setFieldValue("ctaPath", `/moments/campaigns/${selectedCampaign.id}`);
      } else if (campaignsList.length > 0) {
        const first = campaignsList[0];
        formik.setFieldValue("ctaCampaignId", first.id);
        formik.setFieldValue("ctaPath", `/moments/campaigns/${first.id}`);
      } else {
        formik.setFieldValue("ctaPath", "/moments/campaigns");
      }
    }
  };

  const handleSelectCampaign = (campaign: MomentCampaign) => {
    formik.setFieldValue("ctaCampaignId", campaign.id);
    formik.setFieldValue("ctaPath", `/moments/campaigns/${campaign.id}`);
    setIsChangingCampaign(false);
  };

  const resolvedPath = resolveMomentsCtaPath(
    currentCtaType,
    formik.values.ctaCampaignId,
    formik.values.ctaPath,
  );

  return (
    <PolarisFormCard
      step={1}
      title="Navigation Tabs & CTA Customization"
      description="Manage member navigation tabs and configure the primary call-to-action button label and click destination."
      badge="Navigation"
      badgeVariant="emerald"
      icon={Sliders}
    >
      <div className="space-y-5">
        {/* Tabs Manager Header */}
        <div className="flex items-center justify-between pb-1">
          <span className="text-[12px] font-semibold text-foreground">
            Member Tabs Arrangement
          </span>
          <button
            type="button"
            onClick={onPreviewNavbar}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Eye className="h-3 w-3" />
            <span>Preview Nav Bar</span>
          </button>
        </div>

        <ModuleTabManager
          tabs={formik.values.tabs}
          onChange={handleTabsChange}
          onAddCustomTab={onAddCustomTab}
          onCurateMoments={onCurateTab}
          onDeleteCustomTab={onDeleteCustomTab}
        />

        {/* Primary CTA Button & Destination Configuration Card */}
        <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Plus className="h-4 w-4 stroke-[2.5px]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Primary CTA Button & Destination
                </span>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Customize the button label and where it directs members (standard creator, all campaigns hub, or specific campaign).
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[9.5px] font-bold">
              Header Action
            </Badge>
          </div>

          {/* Input 1: Button Label */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ctaName"
                className="text-xs font-semibold text-foreground"
              >
                Button Label / Text
              </label>
              <span className="text-[10.5px] text-muted-foreground">
                Default: &quot;Create {singularName}&quot;
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="ctaName"
                type="text"
                name="ctaName"
                placeholder={`Create ${singularName}`}
                value={formik.values.ctaName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "h-9 px-3 rounded-lg border text-xs bg-background text-foreground w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors",
                  formik.touched.ctaName && formik.errors.ctaName
                    ? "border-destructive focus:ring-destructive"
                    : "border-border/70",
                )}
              />
              {currentCtaType === "CAMPAIGNS_ALL" && formik.values.ctaName !== "Explore Campaigns" && (
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("ctaName", "Explore Campaigns")}
                  className="shrink-0 h-9 px-2.5 rounded-lg border border-border/70 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  Use &quot;Explore Campaigns&quot;
                </button>
              )}
            </div>
            {formik.touched.ctaName && formik.errors.ctaName && (
              <span className="text-[11px] text-destructive font-medium mt-1 block">
                {formik.errors.ctaName}
              </span>
            )}
          </div>

          {/* Input 2: Action Destination (Interactive Selection Tiles) */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Action Destination Path
              </span>
              <span className="text-[10.5px] text-muted-foreground">
                Choose what happens when the button is clicked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CTA_MODE_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = currentCtaType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => handleSelectMode(opt.type)}
                    className={cn(
                      "p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative",
                      isSelected
                        ? "border-indigo-500 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-2xs ring-1 ring-indigo-500/20"
                        : "border-border/60 bg-card hover:bg-muted/30 hover:border-border",
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center border",
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                              : "bg-muted text-muted-foreground border-border/60",
                          )}
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0 rounded-[3px]",
                            isSelected
                              ? "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800"
                              : "text-muted-foreground",
                          )}
                        >
                          {opt.badge}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-[12px] font-semibold text-foreground flex items-center gap-1.5">
                          <span>{opt.title}</span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 stroke-[3px]" />
                          )}
                        </div>
                        <p className="text-[10.5px] text-muted-foreground leading-snug mt-1 line-clamp-2">
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Sub-panel: Specific Campaign Selector */}
          {currentCtaType === "SPECIFIC_CAMPAIGN" && (
            <div className="p-3.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-bold text-foreground">
                    Target Campaign Selection
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => refetchCampaigns?.()}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw
                    className={cn("h-3 w-3", campaignsLoading && "animate-spin")}
                  />
                  <span>Refresh Campaigns</span>
                </button>
              </div>

              {campaignsLoading ? (
                <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                  <span>Loading available campaigns...</span>
                </div>
              ) : selectedCampaign && !isChangingCampaign ? (
                /* Selected Campaign Highlight Card */
                <div className="p-3 rounded-lg border border-indigo-300 dark:border-indigo-800 bg-background shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted border border-border/60 flex items-center justify-center overflow-hidden shrink-0">
                      {selectedCampaign.frameUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={selectedCampaign.frameUrl}
                          alt={selectedCampaign.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Flame className="h-5 w-5 text-indigo-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {selectedCampaign.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0 rounded-[3px]",
                            selectedCampaign.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400",
                          )}
                        >
                          {selectedCampaign.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-mono">
                        Route: /moments/campaigns/{selectedCampaign.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {formik.values.ctaName !== `Join: ${selectedCampaign.title}` && (
                      <button
                        type="button"
                        onClick={() =>
                          formik.setFieldValue(
                            "ctaName",
                            selectedCampaign.title.length > 20
                              ? selectedCampaign.title
                              : `Join: ${selectedCampaign.title}`,
                          )
                        }
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
                      >
                        Auto-fill Button Text
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsChangingCampaign(true)}
                      className="h-7 px-2.5 rounded-md border border-border/70 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
                    >
                      Change Campaign
                    </button>
                  </div>
                </div>
              ) : (
                /* Campaign Search & Selection List */
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search campaign by title or slug..."
                      value={campaignSearch}
                      onChange={(e) => setCampaignSearch(e.target.value)}
                      className="h-8 pl-8.5 pr-3 rounded-lg border border-border/70 bg-background text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {filteredCampaigns.length === 0 ? (
                    <div className="p-4 rounded-lg border border-dashed border-border/70 text-center space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {campaignsList.length === 0
                          ? "No moment campaigns created yet."
                          : "No campaigns matching your search."}
                      </p>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                        Create campaigns in the Campaign Manager to feature them here.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto rounded-lg border border-border/70 divide-y divide-border/60 bg-background">
                      {filteredCampaigns.map((camp) => (
                        <button
                          key={camp.id}
                          type="button"
                          onClick={() => handleSelectCampaign(camp)}
                          className={cn(
                            "w-full p-2.5 text-left flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer",
                            formik.values.ctaCampaignId === camp.id &&
                              "bg-indigo-50/60 dark:bg-indigo-950/40",
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="h-7 w-7 rounded bg-muted border border-border/60 flex items-center justify-center shrink-0">
                              <Flame className="h-3.5 w-3.5 text-orange-500" />
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-semibold text-foreground block truncate">
                                {camp.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {camp.slug} • {camp.totalCompositions || 0} clips
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0",
                                camp.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400"
                                  : "text-muted-foreground",
                              )}
                            >
                              {camp.status}
                            </Badge>
                            {formik.values.ctaCampaignId === camp.id && (
                              <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 stroke-[3px]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedCampaign && isChangingCampaign && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setIsChangingCampaign(false)}
                        className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Conditional Sub-panel: Custom Route Input */}
          {currentCtaType === "CUSTOM" && (
            <div className="p-3.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-2 animate-in fade-in duration-200">
              <label
                htmlFor="ctaPath"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <LinkIcon className="h-3 w-3 text-indigo-500" />
                <span>Custom Target Path / URL</span>
              </label>
              <input
                id="ctaPath"
                type="text"
                name="ctaPath"
                placeholder="/moments/campaigns or https://..."
                value={formik.values.ctaPath}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "h-8 px-3 rounded-lg border font-mono text-xs bg-background text-foreground w-full focus:outline-none focus:ring-1 focus:ring-indigo-500",
                  formik.touched.ctaPath && formik.errors.ctaPath
                    ? "border-destructive focus:ring-destructive"
                    : "border-border/70",
                )}
              />
              <p className="text-[11px] text-muted-foreground">
                Enter an internal path (e.g. <code>/moments/campaigns</code>) or an external deep link.
              </p>
              {formik.touched.ctaPath && formik.errors.ctaPath && (
                <span className="text-[11px] text-destructive font-medium block">
                  {formik.errors.ctaPath}
                </span>
              )}
            </div>
          )}

          {/* Live Resolved Destination Bar */}
          <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-semibold text-foreground">Click Destination:</span>
              <code className="px-2 py-0.5 rounded-md bg-muted font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold border border-border/60 flex items-center gap-1">
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-[420px]">{resolvedPath}</span>
              </code>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>Preview:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 text-white font-medium text-[10.5px] shadow-2xs">
                {currentCtaType === "CAMPAIGNS_ALL" ? (
                  <Layers className="h-3 w-3" />
                ) : currentCtaType === "SPECIFIC_CAMPAIGN" ? (
                  <Flame className="h-3 w-3" />
                ) : currentCtaType === "CUSTOM" ? (
                  <ExternalLink className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
                <span>{formik.values.ctaName || `Create ${singularName}`}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
};

