"use client";

import React from "react";
import { Building2, Network, ScanLine, ToggleRight } from "lucide-react";
import { PlatformSettingsLayout } from "@/components/ui/platform/layout";
import { PartnerNetworkProvider } from "@/components/rewards/settings/partner-network-context";

const TABS = [
  {
    id: "settings",
    label: "General",
    icon: ToggleRight,
    href: "/rewards/settings",
  },
  {
    id: "partners",
    label: "Active Partners",
    icon: Building2,
    href: "/rewards/settings/partners",
  },
  {
    id: "requests",
    label: "Pending Requests",
    icon: ScanLine,
    href: "/rewards/settings/requests",
  },
];

const BREADCRUMB = [
  { label: "Rewards", href: "/rewards" },
  { label: "Partner Network" },
];

function RewardsSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PartnerNetworkProvider>
      <PlatformSettingsLayout
        title="Partner Network"
        description="Manage external brand partnerships and published reward offers."
        headerIcon={Network}
        tabs={TABS}
        breadcrumb={BREADCRUMB}
        badge="Collaboration"
      >
        {children}
      </PlatformSettingsLayout>
    </PartnerNetworkProvider>
  );
}

export default RewardsSettingsLayout;
