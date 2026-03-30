"use client";
import * as React from "react";

import { List, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

function ListingLayout({ children }: { children: React.ReactNode }) {
  const items: TabItem[] = [
    {
      key: "all",
      label: "All Listing",
      icon: <List size={18} />,
    },
    {
      key: "create",
      label: "Create Listing",
      icon: <Plus size={18} />,
    },
  ];

  return (
    <>
      <MenuItemsLayout active={"listing"} items={items}>
        {children}
      </MenuItemsLayout>
    </>
  );
}

export default ListingLayout;
