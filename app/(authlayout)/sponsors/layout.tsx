"use client";
import * as React from "react";

import { List, Plus, Users } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function SponsorsLayout({ children }: { children: React.ReactNode }) {
  const items = React.useMemo(() => {
    return [
      {
        key: "all",
        label: `All Sponsors`,
        icon: <List size={18} />,
      },
      {
        key: "categories",
        label: `Categories`,
        icon: <List size={18} />,
      },
      {
        key: "create",
        label: `Create Sponsor`,
        icon: <Plus size={18} />,
      },
    ];
  }, []);

  return (
    <MenuItemsLayout active={"sponsors"} items={items} showAdminTabs={false}>
      {children}
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withModulePermission(
  SponsorsLayout,
  "SPONSORS",
  "canRead",
);
