"use client";

import * as React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Mail, PaintBucket, Send, BarChart3, GitBranch } from "lucide-react";
import { usePathname } from "next/navigation";
import { EmailDomainGate } from "@/components/email/domain-gate";

function EmailLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const items = [
    {
      key: "",
      label: "Overview",
      icon: <Mail className="h-4 w-4" />,
      section: "General",
      href: "/",
    },
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
    // {
    //   key: "automation",
    //   label: "Campaigns",
    //   icon: <GitBranch className="h-4 w-4" />,
    //   section: "General",
    //   href: "/email/automation",
    // },
  ];

  const isTakeoverPage =
    pathname.includes("/email/send") ||
    pathname.includes("/email/templates/create") ||
    pathname.includes("/email/automation");

  return (
    <MenuItemsLayout
      fixed={isTakeoverPage}
      fullHeight={isTakeoverPage}
      hideDefaultTabs={true}
      active={"email"}
      items={items}
    >
      <EmailDomainGate>{children}</EmailDomainGate>
    </MenuItemsLayout>
  );
}

export default EmailLayout;
