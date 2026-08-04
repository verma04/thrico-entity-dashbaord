"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Users, Plus, Building2, Network, Award } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";

function MembersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const canRead = useModulePermission("NETWORK", "canRead");
  const canCreate = useModulePermission("NETWORK", "canCreate");

  const items = React.useMemo(() => {
    return [
      {
        key: "all",
        label: "Members",
        icon: <Users className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "graph",
        label: `Network Graph`,
        icon: <Network className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "create",
        label: "Create Member",
        icon: <Plus className="h-4 w-4" />,
        locked: !canCreate,
      },
      {
        key: "classification",
        label: "Classifications",
        icon: <Building2 className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "referrals",
        label: "Referrals",
        icon: <Users className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "tiers",
        label: "Membership Tiers",
        icon: <Award className="h-4 w-4" />,
        locked: !canRead,
      },
    ];
  }, [canRead, canCreate]);

  return (
    <MenuItemsLayout active="members" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(MembersLayout, "NETWORK");
