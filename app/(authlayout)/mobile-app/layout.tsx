"use client";

import React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Smartphone, Apple } from "lucide-react";

export default function MobileAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = [
    {
      key: "android",
      label: "Android",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      key: "ios",
      label: "iOS",
      icon: <Apple className="h-4 w-4" />,
    }
  ];

  return (
    <MenuItemsLayout active="mobile-app" items={items} showAdminTabs={false}>
      {children}
    </MenuItemsLayout>
  );
}
