"use client";

import React from "react";
import { Settings, MessageCircleQuestion, BarChart2 } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/polls/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/polls/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Opinion Framework", href: "/polls" },
  { label: "Poll Configuration" },
];

function PollsSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Opinion Framework"
      description="Configure public sentiment gathering and automated polling workflows."
      headerIcon={BarChart2}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Sentiment"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default PollsSettingsLayout;
