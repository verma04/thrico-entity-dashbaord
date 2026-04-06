"use client";

import React from "react";
import { Settings, MessageCircleQuestion, ClipboardList } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/listing/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/listing/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Directory Management", href: "/listing" },
  { label: "Global Settings" },
];

function ListingSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Directory Management"
      description="Moderate directory infrastructure and configure automated validation workflows."
      headerIcon={ClipboardList}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Directory"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default ListingSettingsLayout;
