"use client";
import * as React from "react";

import { Ban, Link2 } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { useModulePermission } from "@/hooks/use-module-permission";
import { PermissionDenied } from "@/components/shared/permission-denied";

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

function ModerationLayout({ children }: { children: React.ReactNode }) {
  const hasModeration = useModulePermission("MODERATION");
  const hasAiModeration = useModulePermission("AI_MODERATION");

  if (!hasModeration && !hasAiModeration) {
    return <PermissionDenied moduleKey="moderation" />;
  }

  // Filter tabs based on permissions
  const items: TabItem[] = [];

  if (hasModeration) {
    items.push(
      {
        key: "banned-words",
        label: "Banned Words",
        icon: <Ban size={18} />,
      },
      {
        key: "blocked-links",
        label: "Blocked Links",
        icon: <Link2 size={18} />,
      }
    );
  }

  return (
    <>
      <MenuItemsLayout active={"moderation"} items={items}>
        {children}
      </MenuItemsLayout>
    </>
  );
}

export default ModerationLayout;
