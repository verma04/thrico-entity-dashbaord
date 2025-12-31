"use client";

import React from "react";
import { HelpCircle, FolderTree, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function FaqLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "categories",
      label: "Categories",
      icon: <FolderTree className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="faq" items={items}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">FAQ Management</h1>
            </div>
            <p className="text-muted-foreground">
              Manage frequently asked questions and categories
            </p>
          </div>
        </div>

        {children}
      </div>
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(FaqLayout, "faq");
