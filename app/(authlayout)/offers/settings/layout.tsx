"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Percent } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";
import { useModuleStore } from "@/store/useModuleStore";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/offers/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/offers/settings/faq",
  },
];

const BREADCRUMB = (moduleName: string) => [
  { label: moduleName, href: "/offers" },
  { label: `${moduleName} Configuration` },
];

function OffersSettingsLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.offerModuleName);

  return (
    <PlatformSettingsLayout
      title={moduleName}
      description="Configure perks, discounts, and automated incentive delivery workflows."
      headerIcon={Percent}
      tabs={TABS}
      breadcrumb={BREADCRUMB(moduleName)}
      badge="Perks"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default OffersSettingsLayout;
