"use client";
import * as React from "react";
import { Users, UserPlus, ShieldCheck, Plus, Mail } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { useModulePermission } from "@/hooks/use-module-permission";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function UsersLayout({ children }: { children: React.ReactNode }) {
  const canCreate = useModulePermission("ADMIN_USERS", "canCreate");

  const items = [
    {
      key: "all",
      label: "All Members",
      icon: <Users size={18} />,
    },
    {
      key: "create",
      label: "Add Member",
      icon: <UserPlus size={18} />,
      locked: !canCreate,
    },
    {
      key: "roles",
      label: "All Roles",
      icon: <ShieldCheck size={18} />,
    },
    {
      key: "roles/create",
      label: "Create Role",
      icon: <Plus size={18} />,
      locked: !canCreate,
    },
  ];

  return (
    <>
      <MenuItemsLayout active="settings/users" items={items} hideDefaultTabs>
        {children}
      </MenuItemsLayout>
    </>
  );
}

export default withModulePermission(
  UsersLayout,
  "USERS_AND_PERMISSIONS",
  "canRead",
);
