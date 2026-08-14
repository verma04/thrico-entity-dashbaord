"use client";

import * as React from "react";
import { LayoutGrid, ListOrdered, Rss } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";

export default function FeedSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = [
    {
      id: "visibility",
      label: "Content Visibility",
      icon: LayoutGrid,
      href: "/feed/settings/visibility",
    },
    {
      id: "ordering",
      label: "Feed Prioritization",
      icon: ListOrdered,
      href: "/feed/settings/ordering",
    },
  ];

  return (
    <PlatformSettingsLayout
      title="Feed Configuration"
      description="Configure content visibility, priority ranking, and publishing parameters for your activity feed."
      headerIcon={Rss}
      tabs={tabs}
      breadcrumb={[
        { label: "Activity Feed", href: "/feed" },
        { label: "Feed Settings" },
      ]}
      badge="Active"
    >
      {children}
    </PlatformSettingsLayout>
  );
}
