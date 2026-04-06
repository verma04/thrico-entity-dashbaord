"use client";

import { Gamepad2, Settings2, MessageCircleQuestion } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

export default function GamificationSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = [
    {
      id: "general",
      label: "General Configuration",
      icon: Settings2,
      href: "/gamification/settings/general",
    },
    {
      id: "faq",
      label: "Knowledge Base",
      icon: MessageCircleQuestion,
      href: "/gamification/settings/faq",
    },
  ];

  return (
    <PlatformSettingsLayout
      title="Gamification Protocol"
      description="Define the rules, rewards, and parameters for your ecosystem's engagement layer."
      headerIcon={Gamepad2}
      tabs={tabs}
      breadcrumb={[
        {
          label: "Gamification",
          href: "/gamification",
        },
      ]}
    >
      {children}
    </PlatformSettingsLayout>
  );
}
