"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Users } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/members/settings",
  },
  {
    id: "faq",
    label: "Faq",
    icon: MessageCircleQuestion,
    href: "/members/settings/faq",
  },
];

function aalsoe({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Member Settings"
      description="Manage member registration settings"
      headerIcon={Users}
      tabs={TABS}
      breadcrumb={[
        { label: "Members", href: "/members" }
      ]}
      badge="Active"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default aalsoe;
