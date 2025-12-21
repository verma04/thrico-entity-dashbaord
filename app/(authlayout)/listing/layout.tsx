"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { List } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";



interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

function RootLayout({ children }: { children: React.ReactNode }) {
  const items: TabItem[] = [
    {
      key: "all",
      label: "All Listing",
      icon: <List size={18} />,
    },
    // {
    //   key: "categories",
    //   label: "Categories",
    //   icon: <BiCategory size={18} />,
    // },
  ];

  return (
    <>
      <MenuItemsLayout active={"listing"} items={items}>
        <Card>{children}</Card>
      </MenuItemsLayout>
    </>
  );
}

export default RootLayout;
