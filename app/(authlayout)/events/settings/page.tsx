"use client";

import React, { useState, useEffect } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { EntitySettings } from "@/graphql/actions/settings";
import {
  Calendar,
  CalendarCheck,
  Ticket,
  Zap,
  Sparkles,
  CheckCircle2,
  CalendarPlus,
  ShieldCheck,
  Sliders,
  Layers,
  Plus,
  Compass,
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
import {
  ModuleTabManager,
  ModuleTabItem,
} from "@/components/settings/shared/module-tab-manager";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

interface EventsSettingsState {
  allowEvents: boolean;
  autoApproveEvents: boolean;
  aiModerationEvents: boolean;
}

const DEFAULT_SETTINGS: EventsSettingsState = {
  allowEvents: true,
  autoApproveEvents: false,
  aiModerationEvents: true,
};

const createDefaultTabs = (
  moduleName: string,
  singularName: string,
  entitySettings?: EntitySettings
): ModuleTabItem[] => {
  const tabNames = (entitySettings?.eventsTabNames as Record<string, string>) || {};
  const tabOrder = (entitySettings?.eventsTabOrder as string[]) || [
    "discover",
    "myEvents",
    "attending",
    "calendar",
  ];
  const allowMyEvents = entitySettings?.allowEventsMyEventsTab ?? true;
  const allowAttending = entitySettings?.allowEventsAttendingTab ?? true;
  const allowCalendar = entitySettings?.allowEventsCalendarTab ?? true;

  const baseMap: Record<string, ModuleTabItem> = {
    discover: {
      id: "discover",
      key: "allowEventsDiscoverTab",
      defaultName: "Discover",
      label: tabNames["discover"] || "",
      description: `Explore upcoming public and featured ${moduleName.toLowerCase()}.`,
      icon: Compass,
      canHide: false, // Discover tab CANNOT be hidden
      enabled: true,
    },
    myEvents: {
      id: "myEvents",
      key: "allowEventsMyEventsTab",
      defaultName: `My ${moduleName}`,
      label: tabNames["myEvents"] || "",
      description: `${moduleName} organized, coordinated, or hosted by the member.`,
      icon: CalendarCheck,
      canHide: true,
      enabled: allowMyEvents,
    },
    attending: {
      id: "attending",
      key: "allowEventsAttendingTab",
      defaultName: "Attending",
      label: tabNames["attending"] || "",
      description: `${moduleName} the member has RSVP'd to, purchased tickets for, or registered.`,
      icon: Ticket,
      canHide: true,
      enabled: allowAttending,
    },
    calendar: {
      id: "calendar",
      key: "allowEventsCalendarTab",
      defaultName: "Calendar",
      label: tabNames["calendar"] || "",
      description: `Monthly and weekly interactive agenda of scheduled ${moduleName.toLowerCase()}.`,
      icon: Calendar,
      canHide: true,
      enabled: allowCalendar,
    },
  };

  const ordered: ModuleTabItem[] = [];
  tabOrder.forEach((id) => {
    if (baseMap[id]) ordered.push(baseMap[id]);
  });
  Object.keys(baseMap).forEach((id) => {
    if (!ordered.find((t) => t.id === id)) {
      ordered.push(baseMap[id]);
    }
  });

  return ordered;
};

function EventsSettings() {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const [formData, setFormData] = useState<EventsSettingsState>(() => ({
    allowEvents: data?.getEntitySettings?.allowEvents ?? true,
    autoApproveEvents: data?.getEntitySettings?.autoApproveEvents ?? false,
    aiModerationEvents: data?.getEntitySettings?.aiModerationEvents ?? true,
  }));

  const [tabs, setTabs] = useState<ModuleTabItem[]>(() =>
    createDefaultTabs(moduleName, singularName, data?.getEntitySettings)
  );

  const [ctaName, setCtaName] = useState<string>(
    data?.getEntitySettings?.eventsCtaName || ""
  );

  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData({
        allowEvents: data.getEntitySettings.allowEvents ?? true,
        autoApproveEvents: data.getEntitySettings.autoApproveEvents ?? false,
        aiModerationEvents: data.getEntitySettings.aiModerationEvents ?? true,
      });
      setTabs(createDefaultTabs(moduleName, singularName, data.getEntitySettings));
      setCtaName(data.getEntitySettings.eventsCtaName || "");
      setHasChanged(false);
    }
  }, [data, moduleName, singularName]);

  const handleToggle = (key: keyof EventsSettingsState) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanged(true);
      return next;
    });
  };

  const handleTabsChange = (updatedTabs: ModuleTabItem[]) => {
    setTabs(updatedTabs);
    setHasChanged(true);
  };

  const handleCtaNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCtaName(e.target.value);
    setHasChanged(true);
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowEvents: data.getEntitySettings.allowEvents ?? true,
        autoApproveEvents: data.getEntitySettings.autoApproveEvents ?? false,
        aiModerationEvents: data.getEntitySettings.aiModerationEvents ?? true,
      });
      setTabs(createDefaultTabs(moduleName, singularName, data.getEntitySettings));
      setCtaName(data.getEntitySettings.eventsCtaName || "");
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      if (data?.getEntitySettings) {
        const eventsTabNames: Record<string, string> = {};
        tabs.forEach((t) => {
          if (t.label && t.label.trim()) {
            eventsTabNames[t.id] = t.label.trim();
          }
        });

        const myEventsTab = tabs.find((t) => t.id === "myEvents");
        const attendingTab = tabs.find((t) => t.id === "attending");
        const calendarTab = tabs.find((t) => t.id === "calendar");

        await update({
          variables: {
            input: {
              allowEvents: formData.allowEvents,
              autoApproveEvents: formData.autoApproveEvents,
              aiModerationEvents: formData.aiModerationEvents,
              allowEventsDiscoverTab: true,
              allowEventsMyEventsTab: myEventsTab ? myEventsTab.enabled : true,
              allowEventsAttendingTab: attendingTab ? attendingTab.enabled : true,
              allowEventsCalendarTab: calendarTab ? calendarTab.enabled : true,
              eventsTabNames,
              eventsTabOrder: tabs.map((t) => t.id),
              eventsCtaName: ctaName.trim() || null,
            },
          },
        });
      }
      toast.success(`${singularName} settings synchronized successfully.`);
      setHasChanged(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${singularName.toLowerCase()} settings.`);
    }
  };

  const activeTabs = tabs.filter((t) => t.enabled);

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Navigation Tabs Preview */}
            <PolarisSidebarCard
              title="Navigation Bar Preview"
              badge="Live View"
              icon={Sliders}
            >
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-3 shadow-2xs">
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
                    {activeTabs.length} of {tabs.length} Visible
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
                        {idx === 0 && (
                          <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500 shrink-0 ml-1">
                            Default
                          </span>
                        )}
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
                    <span>{ctaName || `Create ${singularName}`}</span>
                  </div>
                </div>
              </div>

              {/* Summary Rows */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Discover Tab"
                  value="Always Active"
                  highlight
                />
                <PolarisSummaryRow
                  label="Attending Tab"
                  value={tabs.find((t) => t.id === "attending")?.enabled ? "Visible" : "Hidden"}
                />
                <PolarisSummaryRow
                  label="Calendar Tab"
                  value={tabs.find((t) => t.id === "calendar")?.enabled ? "Visible" : "Hidden"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Live Governance Preview Card */}
            <PolarisSidebarCard
              title="Ticketing & Staging"
              badge="Live Status"
              icon={Sparkles}
            >
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                      <Calendar className="h-3 w-3" />
                    </div>
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      {singularName} Publishing
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9.5px] font-bold gap-1 px-1.5 py-0 rounded-[3px]",
                      formData.allowEvents
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    )}
                  >
                    {formData.allowEvents ? "Open" : "Restricted"}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Organizer Status:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.allowEvents ? "Members Permitted" : "Admin Only"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Approval Protocol:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.autoApproveEvents ? "Auto Published" : "Manual Staging"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>AI Safety:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.aiModerationEvents ? "Active Sentinel" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Publishing Rights"
                  value={formData.allowEvents ? "Universal" : "Curated"}
                  highlight={formData.allowEvents}
                />
                <PolarisSummaryRow
                  label="Review Pipeline"
                  value={formData.autoApproveEvents ? "Direct Live" : "Review Queue"}
                />
                <PolarisSummaryRow
                  label="AI Verification"
                  value={formData.aiModerationEvents ? "Enforced" : "Inactive"}
                  highlight={formData.aiModerationEvents}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard title="Scheduling & Navigation Tip">
              The <strong>Discover</strong> tab cannot be hidden, ensuring attendees can browse event listings. Drag tabs to re-prioritize the Calendar or Attending views.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Navigation Tabs & CTA Configuration */}
          <PolarisFormCard
            step={1}
            title="Navigation Tabs & CTA Customization"
            description={`Configure attendee navigation tabs (Discover is locked on; My ${moduleName}, Attending, and Calendar can be hidden). Reorder and rename tabs to match your event program.`}
            badge="Navigation"
            badgeVariant="emerald"
            icon={Sliders}
          >
            <div className="space-y-4">
              {/* Reusable Tab Manager Component */}
              <ModuleTabManager tabs={tabs} onChange={handleTabsChange} />

              {/* Primary CTA Button Label Customization */}
              <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Plus className="h-3.5 w-3.5 stroke-[2.5px]" />
                    </div>
                    <div>
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Primary CTA Button Name
                      </span>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                        Customize the button label used across the member header to host or create events.
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9.5px] font-bold">
                    Header Action
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70">
                  <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                    Button Text: <span className="text-[10px] text-[#8c9196]">(Default: &quot;Create {singularName}&quot;)</span>
                  </span>
                  <input
                    type="text"
                    placeholder={`Create ${singularName}`}
                    value={ctaName}
                    onChange={handleCtaNameChange}
                    className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full sm:w-[240px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 2: Hosting Permissions */}
          <PolarisFormCard
            step={2}
            title="Hosting & Staging Access"
            description={`Configure access rights for member-hosted ${moduleName.toLowerCase()}.`}
            badge="Publishing"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.allowEvents
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
                  )}
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Allow Member {singularName} Creation
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.allowEvents
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      {formData.allowEvents ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Authorize network members to schedule, promote, and sell tickets to their own hosted sessions.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.allowEvents}
                onCheckedChange={() => handleToggle("allowEvents")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 3: Verification Pipeline */}
          <PolarisFormCard
            step={3}
            title="Review & Publishing Pipeline"
            description={`Determine whether member-submitted ${moduleName.toLowerCase()} require admin staging before opening registration.`}
            badge="Pipeline"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.autoApproveEvents
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
                  )}
                >
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Auto-Approve New {moduleName}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.autoApproveEvents
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      {formData.autoApproveEvents ? "Immediate" : "Review Required"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Instantly publish newly scheduled {moduleName.toLowerCase()} to the public ecosystem without manual review.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.autoApproveEvents}
                onCheckedChange={() => handleToggle("autoApproveEvents")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 4: AI Safety Sentinel */}
          <PolarisFormCard
            step={4}
            title="AI Content Moderation"
            description={`Scan event descriptions, agendas, speaker profiles, and ticket policies for compliance.`}
            badge="AI Safety"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.aiModerationEvents
                      ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      AI Content Moderation
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.aiModerationEvents
                          ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      {formData.aiModerationEvents ? "Active Sentinel" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Automatically analyze event listings for terms of service violations, prohibited materials, and ticketing spam.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.aiModerationEvents}
                onCheckedChange={() => handleToggle("aiModerationEvents")}
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
          title={`Save ${singularName} Settings`}
          description={`You have unsaved changes to ${singularName.toLowerCase()} configurations.`}
          buttonText="Save Settings"
        />
      </PolarisFormLayout>
    </div>
  );
}

export default withSubscriptionCheck(withModulePermission(EventsSettings, "Events"));
