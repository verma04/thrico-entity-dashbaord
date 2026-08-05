"use client";

import React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Smartphone, Apple } from "lucide-react";
import { usePathname } from "next/navigation";
import { MobileAppLanding } from "@/components/mobile-app/mobile-app-landing";

export default function MobileAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

  // If we are on the main landing page, do not show the child sidebar
  if (pathname === "/mobile-app") {
    return <>{children}</>;
  }

  // Otherwise, show the child sidebar for Android/iOS management pages
  return <MobileAppLanding />;
}
