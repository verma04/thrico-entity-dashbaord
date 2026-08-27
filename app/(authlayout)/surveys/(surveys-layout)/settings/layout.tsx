"use client";

import React from "react";
import { Settings, MessageCircleQuestion, FileText } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "settings",
    label: "General Settings",
    icon: Settings,
    href: "/surveys/settings",
  },
  {
    id: "faq",
    label: "FAQ Support",
    icon: MessageCircleQuestion,
    href: "/surveys/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Data Protocols", href: "/surveys" },
  { label: "Survey Configuration" },
];

function SurveysSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Data Protocols"
      description="Moderate research-grade surveys and configure automated validation workflows."
      headerIcon={FileText}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Research"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default SurveysSettingsLayout;
