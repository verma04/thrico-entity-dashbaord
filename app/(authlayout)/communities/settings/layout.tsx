"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Users, Globe } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/communities/settings",
  },
  {
    id: "faq",
    label: "Knowledge Management",
    icon: MessageCircleQuestion,
    href: "/communities/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Community Ecosystem", href: "/communities" },
  { label: "Global Settings" },
];

function CommunitySettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Community Governance"
      description="Define the underlying frameworks and automated systems for your community network."
      headerIcon={Users}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Active"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default CommunitySettingsLayout;
