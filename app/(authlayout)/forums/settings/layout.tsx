"use client";

import React from "react";
import { Settings, MessageCircleQuestion, MessageSquare } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";
import { useModuleStore } from "@/store/useModuleStore";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/forums/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/forums/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Community Modules", href: "/forums" },
  { label: "Discussion Engine" },
];

function ForumsSettingsLayout({ children }: { children: React.ReactNode }) {
  const singularName = useModuleStore((state) => state.forumSingularName);
  return (
    <PlatformSettingsLayout
      title={`${singularName} Governance`}
      description="Moderate interactions and configure the discussion engine for your ecosystem."
      headerIcon={MessageSquare}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Active Engine"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default ForumsSettingsLayout;
