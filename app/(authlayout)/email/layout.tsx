"use client";

import * as React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { PaintBucket, Send, BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { EmailDomainGate } from "@/components/email/domain-gate";

function EmailLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const items = [
    {
      key: "templates",
      label: "Templates",
      icon: <PaintBucket className="h-4 w-4" />,
      section: "General",
      href: "/email/templates",
    },
    {
      key: "send",
      label: "Send Email",
      icon: <Send className="h-4 w-4" />,
      section: "General",
      href: "/email/send",
    },
    {
      key: "usage",
      label: "Usage & Billing",
      icon: <BarChart3 className="h-4 w-4" />,
      section: "General",
      href: "/email/usage",
    },
  ];

  const isTakeoverPage =
    pathname.includes("/email/send") ||
    pathname.includes("/email/templates/create");

  return (
    <MenuItemsLayout
      fixed={isTakeoverPage}
      fullWidth={isTakeoverPage}
      fullHeight={isTakeoverPage}
      showAdminTabs={false}
      active={"email"}
      items={items}
    >
      <EmailDomainGate>{children}</EmailDomainGate>
    </MenuItemsLayout>
  );
}

export default EmailLayout;
