"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Tag, ScrollText } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "Inventory Settings",
    icon: Settings,
    href: "/offers/settings",
  },
  {
    id: "terms",
    label: "Redemption Terms",
    icon: ScrollText,
    href: "/offers/settings/term_and_conditions",
  },
  {
    id: "faq",
    label: "Support Center",
    icon: MessageCircleQuestion,
    href: "/offers/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Marketplace & Deals", href: "/offers" },
  { label: "Offer Configuration" },
];

function OffersSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Offers Engine"
      description="Manage redemption logic, inventory parameters, and deal terms for your network."
      headerIcon={Tag}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Marketplace"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default OffersSettingsLayout;

