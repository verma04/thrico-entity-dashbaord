"use client";

import React, { useMemo } from "react";
import {
  Users,
  Ghost,
  Fingerprint,
  Sparkles,
  Link2,
  AlertTriangle,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function VisitorIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = useMemo(
    () => [
      {
        key: "all",
        label: "All Visitors",
        icon: <Users className="h-4 w-4" />,
      },
      {
        key: "anonymous",
        label: "Anonymous (Ghost)",
        icon: <Ghost className="h-4 w-4" />,
      },
      {
        key: "known",
        label: "Known Visitors",
        icon: <Fingerprint className="h-4 w-4" />,
      },
      {
        key: "converted",
        label: "Converted Members",
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        key: "attributed",
        label: "Campaign Attributed",
        icon: <Link2 className="h-4 w-4" />,
      },
      {
        key: "at-risk",
        label: "At Risk / Churned",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
    ],
    []
  );

  return (
    <MenuItemsLayout
      active="marketing/visitors"
      items={items}
      hideDefaultTabs={true}
      showAdminTabs={false}
      className="mt-0 bg-transparent dark:bg-transparent border-t-0"
    >
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(VisitorIntelligenceLayout, "NETWORK");
