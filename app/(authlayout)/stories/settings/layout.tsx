"use client";

import React from "react";
import { Settings, MessageCircleQuestion, BookOpen } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/stories/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/stories/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Book of Stories", href: "/stories" },
  { label: "Stories Configuration" },
];

function StoriesSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Stories Framework"
      description="Moderate storytelling interactions and configure the narrative engine for your ecosystem."
      headerIcon={BookOpen}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Narrative"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default StoriesSettingsLayout;
