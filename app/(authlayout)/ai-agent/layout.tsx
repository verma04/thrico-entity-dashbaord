"use client";

import MenuItemsLayout from "@/components/layout/menu-items-layout";
import * as React from "react";

function AIAgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden ">
      <MenuItemsLayout hideTabs={true}>{children}</MenuItemsLayout>
    </div>
  );
}

export default AIAgentLayout;
