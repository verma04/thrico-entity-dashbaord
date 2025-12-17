"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { List } from "lucide-react";

import MenuItemsLayout from "@/components/layout/menu-items-layout";

function RootLayout({ children }: { children: React.ReactNode }) {
  const items = [
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
        <Card>
          <CardContent className="p-6">{children}</CardContent>
        </Card>
      </MenuItemsLayout>
    </>
  );
}

export default RootLayout;
