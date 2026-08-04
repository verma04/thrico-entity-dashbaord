"use client";

import { Gamepad2, Settings2, MessageCircleQuestion } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";
import { useModuleStore } from "@/store/useModuleStore";

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
      href: "/gamification/points-and-badges/settings/general",
    },
    {
      id: "faq",
      label: "Knowledge Base",
      icon: MessageCircleQuestion,
      href: "/gamification/points-and-badges/settings/faq",
    },
  ];

  const gamificationName = useModuleStore((state) => state.gamificationModuleName);

  return (
    <PlatformSettingsLayout
      title={`${gamificationName} Settings`}
      description="Define the rules, rewards, and parameters for your ecosystem's engagement layer."
      headerIcon={Gamepad2}
      tabs={tabs}
      breadcrumb={[
        {
          label: "Gamification",
          href: "/gamification",
        },
        {
          label: "Points & Badges",
          href: "/gamification/points-and-badges",
        },
      ]}
    >
      {children}
    </PlatformSettingsLayout>
  );
}
