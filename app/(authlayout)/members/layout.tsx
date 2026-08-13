"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Users, Plus, Building2, Network, Award, AlertTriangle, FileText, Wrench, LayoutDashboard } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";
import { useUserStore } from "@/store/store";
import { useMembersLayoutStore } from "@/store/members-layout-store";
import { useTabOrder } from "@/hooks/use-tab-order";

function MembersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const canRead = useModulePermission("NETWORK", "canRead");
  const canCreate = useModulePermission("NETWORK", "canCreate");

  const user = useUserStore((state) => state.user);
  
  const hasSettingsPerm = React.useMemo(() => {
    if (!user) return false;
    if (user.isSuperAdmin || user.role?.isSystem) return true;
    return !!user.permissions?.settings;
  }, [user]);

  const hasReportsPerm = React.useMemo(() => {
    if (!user) return false;
    if (user.isSuperAdmin || user.role?.isSystem) return true;
    return !!user.permissions?.reports;
  }, [user]);

  const defaultItems = React.useMemo(() => {
    return [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        key: "all",
        label: "Manage Members",
        icon: <Users className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "create",
        label: "Create New Members",
        icon: <Plus className="h-4 w-4" />,
        locked: !canCreate,
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
      {
        key: "graph",
        label: "Network Graph",
        icon: <Network className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "classification",
        label: "Classifications",
        icon: <Building2 className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "reports",
        label: "Reported Items",
        icon: <AlertTriangle className="h-4 w-4" />,
        section: "Admin",
        locked: !hasReportsPerm,
      },
      {
        key: "audit-log",
        label: "Audit Log",
        icon: <FileText className="h-4 w-4" />,
        section: "Admin",
        locked: !canRead,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Wrench className="h-4 w-4" />,
        section: "Admin",
        locked: !hasSettingsPerm,
      },
    ];
  }, [canRead, canCreate, hasReportsPerm, hasSettingsPerm]);

  const { getOrderedTabs, onReorder } = useTabOrder("MEMBERS", useMembersLayoutStore, defaultItems);

  const sortedItems = getOrderedTabs(defaultItems);

  return (
    <MenuItemsLayout 
      active="members" 
      items={sortedItems} 
      hideDefaultTabs={true}
      showAdminTabs={false}
      enableReorder={true}
      onReorder={onReorder}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(MembersLayout, "NETWORK");
