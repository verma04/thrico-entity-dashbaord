"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import {
  Users,
  Plus,
  Building2,
  Network,
  Award,
  AlertTriangle,
  FileText,
  Wrench,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";
import { useUserStore } from "@/store/store";
import { useMembersLayoutStore } from "@/store/members-layout-store";
import { useTabOrder } from "@/hooks/use-tab-order";

function MembersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const canReadMembers = useModulePermission("MEMBERS_ALL", "canRead");
  const canCreateMembers = useModulePermission("MEMBERS_ALL", "canCreate");
  const canReadReferrals = useModulePermission("MEMBERS_REFERRALS", "canRead");
  const canReadGraph = useModulePermission("MEMBERS_GRAPH", "canRead");
  const canReadClassifications = useModulePermission(
    "MEMBERS_CLASSIFICATIONS",
    "canRead",
  );
  const canReadReports = useModulePermission("MEMBERS_REPORTS", "canRead");
  const canReadSettings = useModulePermission("MEMBERS_SETTINGS", "canRead");
  const canReadAudit = useModulePermission("MEMBERS_AUDIT", "canRead");
  const canReadAutomation = useModulePermission("AUTOMATION", "canRead");

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
        locked: !canReadMembers,
      },
      {
        key: "create",
        label: "Create New Members",
        icon: <Plus className="h-4 w-4" />,
        locked: !canCreateMembers,
      },
      {
        key: "referrals",
        label: "Referrals",
        icon: <Users className="h-4 w-4" />,
        locked: !canReadReferrals,
      },
      {
        key: "tiers",
        label: "Membership Tiers",
        icon: <Award className="h-4 w-4" />,
        locked: !canReadMembers,
      },
      {
        key: "automation",
        label: "Automations",
        icon: <Zap className="h-4 w-4" />,
        locked: !canReadAutomation,
      },
      {
        key: "graph",
        label: "Network Graph",
        icon: <Network className="h-4 w-4" />,
        locked: !canReadGraph,
      },
      {
        key: "classification",
        label: "Classifications",
        icon: <Building2 className="h-4 w-4" />,
        locked: !canReadClassifications,
      },
      {
        key: "reports",
        label: "Reported Items",
        icon: <AlertTriangle className="h-4 w-4" />,
        section: "Admin",
        locked: !canReadReports,
      },
      {
        key: "audit-log",
        label: "Audit Log",
        icon: <FileText className="h-4 w-4" />,
        section: "Admin",
        locked: !canReadAudit,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Wrench className="h-4 w-4" />,
        section: "Admin",
        locked: !canReadSettings,
      },
    ];
  }, [
    canReadMembers,
    canCreateMembers,
    canReadReferrals,
    canReadAutomation,
    canReadGraph,
    canReadClassifications,
    canReadReports,
    canReadAudit,
    canReadSettings,
  ]);

  const { getOrderedTabs, onReorder } = useTabOrder(
    "MEMBERS",
    useMembersLayoutStore,
    defaultItems,
  );

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
