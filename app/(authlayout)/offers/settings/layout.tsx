"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Percent } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

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

const BREADCRUMB = [
  { label: "Benefit Ecosystem", href: "/offers" },
  { label: "Offers Configuration" },
];

function OffersSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Benefit Ecosystem"
      description="Configure perks, discounts, and automated incentive delivery workflows."
      headerIcon={Percent}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Perks"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default OffersSettingsLayout;
