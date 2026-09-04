"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  PaintBucket,
  Send,
  BarChart3,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";
import { useTabOrder } from "@/hooks/use-tab-order";
import { createLayoutStore } from "@/store/create-layout-store";
import { EmailDomainGate } from "@/components/email/domain-gate";

const useEmailLayoutStore = createLayoutStore();

function EmailLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const canReadEmail = useModulePermission("EMAIL", "canRead");
  const canCreateEmail = useModulePermission("EMAIL", "canCreate");
  const canReadAutomation = useModulePermission("AUTOMATION", "canRead");

  const defaultItems = React.useMemo(() => {
    return [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        key: "send",
        label: "Send Campaign",
        icon: <Send className="h-4 w-4" />,
        locked: !canReadEmail,
      },
      {
        key: "templates",
        label: "Templates",
        icon: <PaintBucket className="h-4 w-4" />,
        locked: !canReadEmail,
      },
      {
        key: "automation",
        label: "Automations",
        icon: <Zap className="h-4 w-4" />,
        locked: !canReadAutomation && !canReadEmail,
      },
      {
        key: "usage",
        label: "Usage & Billing",
        icon: <BarChart3 className="h-4 w-4" />,
        locked: !canReadEmail,
      },
    ];
  }, [canReadEmail, canCreateEmail, canReadAutomation]);

  const isTakeoverPage =
    pathname.includes("/email/templates/create") ||
    pathname.includes("/email/automation/add") ||
    pathname.includes("/email/automation/edit");

  const { getOrderedTabs, onReorder } = useTabOrder(
    "EMAIL",
    useEmailLayoutStore,
    defaultItems,
  );

  const sortedItems = getOrderedTabs(defaultItems);

  return (
    <MenuItemsLayout
      fixed={isTakeoverPage}
      fullHeight={isTakeoverPage}
      active="email"
      items={sortedItems}
      hideDefaultTabs={true}
      showAdminTabs={false}
      enableReorder={true}
      onReorder={onReorder}
    >
      <EmailDomainGate>{children}</EmailDomainGate>
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(EmailLayout, "NETWORK");
