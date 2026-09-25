"use client";

import * as React from "react";
import {
  BarChart3,
  LayoutDashboard,
  Megaphone,
  PaintBucket,
  Send,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { useTabOrder } from "@/hooks/use-tab-order";
import { createLayoutStore } from "@/store/create-layout-store";

const useWhatsAppLayoutStore = createLayoutStore();

export default function WhatsAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultItems = React.useMemo(() => {
    return [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        key: "campaigns",
        label: "Campaigns & Logs",
        icon: <Megaphone className="h-4 w-4" />,
      },
      {
        key: "send",
        label: "Send Message",
        icon: <Send className="h-4 w-4" />,
      },
      {
        key: "templates",
        label: "Templates",
        icon: <PaintBucket className="h-4 w-4" />,
      },
      {
        key: "usage",
        label: "Usage & Health",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ];
  }, []);

  const { getOrderedTabs, onReorder } = useTabOrder(
    "WHATSAPP",
    useWhatsAppLayoutStore,
    defaultItems,
  );

  const sortedItems = getOrderedTabs(defaultItems);

  return (
    <MenuItemsLayout
      active="marketing/whatsapp"
      items={sortedItems}
      hideDefaultTabs={true}
      showAdminTabs={false}
      enableReorder={true}
      onReorder={onReorder}
      className="mt-0 bg-transparent dark:bg-transparent border-t-0"
    >
      {children}
    </MenuItemsLayout>
  );
}
