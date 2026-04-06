"use client";

import React from "react";
import { Settings, MessageCircleQuestion, GraduationCap } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/mentorship/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/mentorship/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Mentorship Network", href: "/mentorship" },
  { label: "Learning Configuration" },
];

function MentorshipSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Mentorship Network"
      description="Configure peer-to-peer learning ecosystems and automated mentor validation."
      headerIcon={GraduationCap}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Learning"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default MentorshipSettingsLayout;
