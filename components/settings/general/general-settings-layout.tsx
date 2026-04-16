"use client";

import React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Fingerprint, Layers, CreditCard } from "lucide-react";

export function GeneralSettingsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { key: "", label: "Identity", icon: <Fingerprint className="h-4 w-4" />, section: "Account" },
    { key: "branding", label: "Branding", icon: <Layers className="h-4 w-4" />, section: "Account" },
    { key: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" />, section: "Commerce" },
  ];

  return (
    <MenuItemsLayout active="settings" items={items} hideDefaultTabs={true}>
      {children}
    </MenuItemsLayout>
  );
}
