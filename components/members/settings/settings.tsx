"use client";

import React, { useState } from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Users, ShieldCheck, Zap, Mail, SlidersHorizontal } from "lucide-react";
import {
  PlatformSettingsPage,
  SettingsField,
} from "@/components/ui/platform/settings-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ActionEmailsSettings } from "./action-emails";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowNewUser",
    label: "Allow New Member Registration",
    description:
      "Temporarily pause or resume the onboarding of new ecosystem participants.",
    icon: ShieldCheck,
    section: "Registration Protocol",
  },
  {
    key: "autoApproveUser",
    label: "Auto Approve New Members",
    description:
      "Automatically approve new member registrations without manual intervention.",
    icon: Zap,
    section: "Registration Protocol",
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("protocols");
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: Record<string, unknown>) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Member protocols synchronized successfully.");
    } catch (error) {
      toast.error("Failed to update registry parameters.");
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header with Tabs ─────────────────────────────────── */}
      <div className="space-y-4 max-w-[1040px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Member Settings & Automations
                </h1>
                <Badge
                  variant="outline"
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold"
                >
                  Identity
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Configure member access protocols, auto-approval workflows, and action transactional emails.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-1 rounded-xl h-10 inline-flex gap-1">
            <TabsTrigger
              value="protocols"
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-xs flex items-center gap-2 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Member Protocols</span>
            </TabsTrigger>
            <TabsTrigger
              value="action-emails"
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-xs flex items-center gap-2 transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Action Emails</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="protocols" className="m-0 focus-visible:outline-none">
              <PlatformSettingsPage
                title="Member Protocols"
                description="Configure the foundational access and registration parameters for your community members."
                headerIcon={Users}
                badge="Identity"
                fields={FIELDS}
                data={data?.getEntitySettings}
                loading={loading}
                onSave={handleSave}
                isSaving={loadingBtn}
                hideHeader
              />
            </TabsContent>

            <TabsContent value="action-emails" className="m-0 focus-visible:outline-none">
              <ActionEmailsSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
