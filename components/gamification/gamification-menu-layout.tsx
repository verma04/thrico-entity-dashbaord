"use client";

import React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
};

const GamificationMenuLayout = ({
  children,
  items,
  basePath = "/gamification",
  enableReorder,
  onReorder,
}: {
  children: React.ReactNode;
  items: MenuItem[];
  basePath?: string;
  enableReorder?: boolean;
  onReorder?: (newOrder: string[]) => void;
}) => {
  // Convert basePath to active string expected by MenuItemsLayout
  // e.g. "/gamification/currency" -> "gamification/currency"
  const active = basePath.startsWith("/") ? basePath.slice(1) : basePath;

  return (
    <MenuItemsLayout 
      active={active} 
      items={items} 
      hideDefaultTabs={true}
      showAdminTabs={false}
      fullWidth={false}
      enableReorder={enableReorder}
      onReorder={onReorder}
    >
      {children}
    </MenuItemsLayout>
  );
};

export default GamificationMenuLayout;
