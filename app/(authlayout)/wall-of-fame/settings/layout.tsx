"use client";

import React from "react";
import { MessageCircleQuestion, Trophy } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

const TABS = [
  {
    id: "faq",
    label: "Success FAQ",
    icon: MessageCircleQuestion,
    href: "/wall-of-fame/settings/faq",
  },
];

const BREADCRUMB = [
  { label: "Recognition & Awards", href: "/wall-of-fame" },
  { label: "Elite Registry" },
];

function WallOfFameSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformSettingsLayout
      title="Wall of Fame"
      description="Manage the induction criteria, eligibility terms, and recognition logic for your top performers."
      headerIcon={Trophy}
      tabs={TABS}
      breadcrumb={BREADCRUMB}
      badge="Elite Tier"
    >
      {children}
    </PlatformSettingsLayout>
  );
}

export default WallOfFameSettingsLayout;
