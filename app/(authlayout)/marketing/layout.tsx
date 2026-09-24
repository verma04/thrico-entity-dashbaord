"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Link2, Mail, Users, BarChart3 } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const items = useMemo(
    () => [
      {
        key: "utm",
        label: "UTM Campaigns",
        icon: <Link2 className="h-4 w-4" />,
      },
      {
        key: "visitors",
        label: "Visitor Intelligence",
        icon: <Users className="h-4 w-4" />,
      },
      {
        key: "attribution",
        label: "Attribution Reports",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        key: "email",
        label: "Email Campaigns",
        icon: <Mail className="h-4 w-4" />,
      },
    ],
    [],
  );

  const isTakeoverPage =
    pathname.includes("/marketing/email/templates/create") ||
    pathname.includes("/marketing/email/automation/add/canvas") ||
    pathname.includes("/marketing/email/automation/edit");

  return (
    <MenuItemsLayout
      fixed={isTakeoverPage}
      fullHeight={isTakeoverPage}
      active="marketing"
      items={items}
      hideDefaultTabs={true}
      showAdminTabs={false}
      hideTabs={isTakeoverPage}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(MarketingLayout, "NETWORK");
