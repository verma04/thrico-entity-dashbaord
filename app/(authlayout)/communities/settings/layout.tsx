"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Users, Globe } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";
import { useModuleStore } from "@/store/useModuleStore";

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

function CommunitySettingsLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const BREADCRUMB = [
    { label: `${singularName} Ecosystem`, href: "/communities" },
    { label: "Global Settings" },
  ];

  return (
    <PlatformSettingsLayout
      title={`${singularName} Governance`}
      description={`Define the underlying frameworks and automated systems for your ${moduleName.toLowerCase()} network.`}
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
