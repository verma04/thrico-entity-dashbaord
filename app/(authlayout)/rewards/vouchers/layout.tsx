"use client";

import * as React from "react";
import { Ticket, Package, History } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function VouchersLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "", // maps to /rewards/vouchers
      label: "All Vouchers",
      icon: <Ticket className="h-4 w-4" />,
      section: "Vouchers",
    },
    {
      key: "coupons",
      label: "Coupons",
      icon: <Ticket className="h-4 w-4" />,
      section: "Vouchers",
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: <Package className="h-4 w-4" />,
      section: "Vouchers",
    },
    {
      key: "redemptions",
      label: "Redemptions",
      icon: <History className="h-4 w-4" />,
      section: "Vouchers",
    },
  ];

  return (
    <MenuItemsLayout
      className="p-0"
      active="rewards/vouchers"
      items={items}
      hideDefaultTabs={true}
      fullWidth={true}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default VouchersLayout;
