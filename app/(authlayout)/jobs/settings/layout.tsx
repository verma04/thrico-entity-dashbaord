"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Briefcase } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/jobs/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/jobs/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Career Marketplace", href: "/jobs" },
  { label: "Jobs Configuration" },
];

function JobsSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Career Marketplace"
      description="Configure employment protocols and automated hiring workflows for your workspace."
      headerIcon={Briefcase}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Career"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default JobsSettingsLayout;
