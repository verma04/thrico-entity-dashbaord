"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Users, Plus, Building2 } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";

function MembersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const canRead = useModulePermission("NETWORK", "canRead");
  const canCreate = useModulePermission("NETWORK", "canCreate");

  // Determine active classification tab key dynamically based on current route
  let classificationKey = "classifications";
  if (pathname.includes("/members/industries")) {
    classificationKey = "industries";
  } else if (pathname.includes("/members/functions")) {
    classificationKey = "functions";
  } else if (pathname.includes("/members/skills")) {
    classificationKey = "skills";
  }

  const items = React.useMemo(() => {
    return [
      {
        key: "all",
        label: "Members",
        icon: <Users className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "create",
        label: "Create Member",
        icon: <Plus className="h-4 w-4" />,
        locked: !canCreate,
      },
      {
        key: classificationKey,
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
    ];
  }, [classificationKey, canRead, canCreate]);

  return (
    <MenuItemsLayout active="members" items={items}>
      <CardContent className="">{children}</CardContent>
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(MembersLayout, "NETWORK");
