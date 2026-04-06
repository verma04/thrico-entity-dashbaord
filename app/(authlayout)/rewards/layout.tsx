"use client";

import * as React from "react";
import {
  Ticket,
  Package,
  History,
  LayoutDashboard,
  ShieldAlert,
  Plus,
  Coins,
  Network,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function RewardsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "vouchers",
      label: "Inventory",
      icon: <Package className="h-4 w-4" />,
      section: "Modules",
    },
    {
      key: "coupons",
      label: "Catalog",
      icon: <Ticket className="h-4 w-4" />,
      section: "Modules",
    },
    {
      key: "inventory",
      label: "Restock",
      icon: <Coins className="h-4 w-4" />,
      section: "Modules",
    },
    {
      key: "redemptions",
      label: "Audit Trail",
      icon: <History className="h-4 w-4" />,
      section: "Registry",
    },
    {
      key: "fraud",
      label: "Governance",
      icon: <ShieldAlert className="h-4 w-4" />,
      section: "Registry",
    },
    {
      key: "settings",
      label: "Partner Network",
      icon: <Network className="h-4 w-4" />,
      section: "Collaboration",
    },
    {
      key: "coupons/create",
      label: "Add Reward",
      icon: <Plus className="h-4 w-4" />,
      section: "Actions",
    },
  ];

  return (
    <MenuItemsLayout
      className="p-0"
      active="rewards"
      items={items}
      hideDefaultTabs={true}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default RewardsLayout;
