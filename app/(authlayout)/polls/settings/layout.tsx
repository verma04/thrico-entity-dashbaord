"use client";

import React from "react";
import { Settings, MessageCircleQuestion, BarChart2 } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";
import { useModuleStore } from "@/store/useModuleStore";

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

function PollsSettingsLayout({ children }: { children: React.ReactNode }) {
  const singularName = useModuleStore((state) => state.pollSingularName);

  const BREADCRUMB = [
    { label: `${singularName} Framework`, href: "/polls" },
    { label: `${singularName} Configuration` },
  ];

  return (
    <PlatformSettingsLayout
      title={`${singularName} Framework`}
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
