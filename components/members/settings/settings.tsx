"use client";

import React, { useState } from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import {
  Users,
  ShieldCheck,
  Zap,
  Mail,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
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
    <div className="space-y-6 max-w-[1080px]">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Member Settings & Protocols
              </h1>
              <Badge
                variant="outline"
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold"
              >
                Governance
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Configure registration protocols, auto-approvals, and automated
              transactional emails.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ──────────────────────────────── */}
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
    </div>
  );
};

export default Settings;
