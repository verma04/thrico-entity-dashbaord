"use client";
import * as React from "react";

import { List, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}
function JobsLayout({ children }: { children: React.ReactNode }) {
  const items: TabItem[] = [
    {
      key: "all",
      label: "All Jobs",
      icon: <List size={18} />,
    },
    {
      key: "create",
      label: "Create Job",
      icon: <Plus size={18} />,
    },
    {
      key: "audit-log",
      label: "Audit Log",
      icon: <List size={18} />,
    },
  ];

  return (
    <>
      <MenuItemsLayout active={"jobs"} items={items}>
        {children}
      </MenuItemsLayout>
    </>
  );
}

export default withSubscriptionCheck(JobsLayout, "jobs");
