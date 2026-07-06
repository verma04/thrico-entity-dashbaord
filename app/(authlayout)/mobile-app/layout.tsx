"use client";

import React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Smartphone, Apple } from "lucide-react";

export default function MobileAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Smartphone className="w-16 h-16 text-muted-foreground opacity-50" />
        <h1 className="text-3xl font-bold">Coming Soon</h1>
        <p className="text-muted-foreground text-center max-w-md">
          We are currently working on bringing the custom mobile app experience
          to you. Stay tuned!
        </p>
      </div>
    );
  } else {
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
      },
    ];

    return (
      <MenuItemsLayout active="mobile-app" items={items} showAdminTabs={false}>
        {children}
      </MenuItemsLayout>
    );
  }
}
