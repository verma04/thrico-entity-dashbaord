"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Users, Zap } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/members/settings",
  },
  {
    id: "automation",
    label: "Automation Rules",
    icon: Zap,
    href: "/members/automation",
  },
];

function MembersSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Member Settings & Governance"
      description="Manage member registration protocols, automated assignment workflows, and FAQ knowledge base."
      headerIcon={Users}
      tabs={TABS}
      breadcrumb={[
        { label: "Members", href: "/members" },
        { label: "Settings" },
      ]}
      badge="Active"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default MembersSettingsLayout;
