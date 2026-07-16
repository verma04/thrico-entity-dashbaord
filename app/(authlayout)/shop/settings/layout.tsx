"use client";

import React from "react";
import { Settings, MessageCircleQuestion, ShoppingBag } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/shop/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/shop/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Commerce Engine", href: "/shop" },
  { label: "Marketplace Configuration" },
];

function ShopSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Commerce Engine"
      description="Moderate digital storefronts and configure automated product validation."
      headerIcon={ShoppingBag}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Commerce"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default ShopSettingsLayout;
