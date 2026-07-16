"use client";

import React from "react";
import { Settings, MessageCircleQuestion, Calendar } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/events/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/events/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Community Events", href: "/events" },
  { label: "Event Configuration" },
];

function EventsSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Events Management"
      description="Configure scheduling protocols and automated event validation for your ecosystem."
      headerIcon={Calendar}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Active"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default EventsSettingsLayout;
