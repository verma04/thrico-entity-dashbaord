"use client";

import React, { useState, useEffect } from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import {
  Users,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  Lock,
  UserCheck,
  UserPlus,
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
import { cn } from "@/lib/utils";

interface MemberSettingsState {
  allowNewUser: boolean;
  autoApproveUser: boolean;
}

export default function MemberSettings() {
  const { data, loading } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const initialSettings: MemberSettingsState = {
    allowNewUser: data?.getEntitySettings?.allowNewUser ?? true,
    autoApproveUser: data?.getEntitySettings?.autoApproveUser ?? false,
  };

  const [formData, setFormData] = useState<MemberSettingsState>(initialSettings);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData({
        allowNewUser: data.getEntitySettings.allowNewUser ?? true,
        autoApproveUser: data.getEntitySettings.autoApproveUser ?? false,
      });
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (key: keyof MemberSettingsState) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanged(true);
      return next;
    });
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowNewUser: data.getEntitySettings.allowNewUser ?? true,
        autoApproveUser: data.getEntitySettings.autoApproveUser ?? false,
      });
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      await update({
        variables: {
          input: {
            allowNewUser: formData.allowNewUser,
            autoApproveUser: formData.autoApproveUser,
          },
        },
      });
      toast.success("Member settings synchronized successfully.");
      setHasChanged(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update member settings.");
    }
  };

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Governance Preview Card */}
            <PolarisSidebarCard
              title="Access & Governance"
              badge="Active Protocol"
              icon={Sparkles}
            >
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                      <Users className="h-3 w-3" />
                    </div>
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Registration Gateway
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9.5px] font-bold gap-1 px-1.5 py-0 rounded-[3px]",
                      formData.allowNewUser
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
                    )}
                  >
                    {formData.allowNewUser ? "Open" : "Paused"}
                  </Badge>
                </div>

                {/* Status Badges */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>New Signups:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.allowNewUser ? "Enabled (Accepting)" : "Disabled (Restricted)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Approval Mode:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.autoApproveUser ? "Instant (Auto-Approve)" : "Manual Verification"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Rows */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Registration"
                  value={formData.allowNewUser ? "Open to Public" : "Paused"}
                  highlight={formData.allowNewUser}
                />
                <PolarisSummaryRow
                  label="Verification Flow"
                  value={formData.autoApproveUser ? "Automated" : "Admin Review"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard title="Member Onboarding Tip">
              Enabling <strong>Auto-Approve</strong> accelerates onboarding by
              letting verified email accounts access community features
              immediately without waiting for admin approval.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Registration Access */}
          <PolarisFormCard
            step={1}
            title="Registration Access & Gateway"
            description="Control whether new prospective members are permitted to sign up and create accounts."
            badge="Access"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.allowNewUser
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Allow New Member Registration
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.allowNewUser
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.allowNewUser ? "Open" : "Paused"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    When active, newcomers can sign up through your onboarding
                    flow. Toggle off to temporarily freeze new registrations.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.allowNewUser}
                onCheckedChange={() => handleToggle("allowNewUser")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 2: Verification & Auto-Approval */}
          <PolarisFormCard
            step={2}
            title="Verification & Approval Flow"
            description="Configure automated approval rules for newly registered member profiles."
            badge="Governance"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.autoApproveUser
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Auto-Approve New Members
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.autoApproveUser
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.autoApproveUser ? "Auto" : "Manual"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Instantly grant active member privileges upon registration.
                    If disabled, new accounts require manual approval by an
                    administrator.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.autoApproveUser}
                onCheckedChange={() => handleToggle("autoApproveUser")}
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
          title="Save Member Settings"
          description="You have unsaved changes to member access protocols."
          buttonText="Save Settings"
        />
      </PolarisFormLayout>
    </div>
  );
}
