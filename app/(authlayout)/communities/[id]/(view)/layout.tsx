"use client";

import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname } from "next/navigation";
import {
  Info,
  MessageCircle,
  Users,
  Star,
  Settings,
  AlertTriangle,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { getCommunityById } from "@/graphql/actions/group";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

const tabItems: ManageTabItem[] = [
  { key: "about", label: "About", icon: Info },
  { key: "discussion", label: "Discussion", icon: MessageCircle, path: "discussion" },
  { key: "members", label: "Members", icon: Users },
  { key: "rating", label: "Rating", icon: Star },
  { key: "rules", label: "Rules", icon: ShieldAlert },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
  { key: "audit-log", label: "Audit Log", icon: Activity },
  { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
];

function CommunitiesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/communities/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "discussion"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "discussion";

  const { data, loading } = getCommunityById({
    variables: {
      input: {
        communityId: id,
      },
    },
  });

  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const community = data?.getCommunityById;

  const privacyColor =
    community?.privacy === "PUBLIC" ? "bg-emerald-500" : "bg-amber-500";

  return (
    <ManageItemLayout
      title={community?.title || `${singularName} Details`}
      loading={loading}
      loadingText="Loading..."
      coverImage={community?.cover}
      defaultIcon={Users}
      status={community?.privacy}
      statusVariant="secondary"
      statusColor={privacyColor}
      subtitle={
        !loading && community?.description ? (
          <span className="truncate max-w-[400px]">
            {community.description}
          </span>
        ) : null
      }
      closeHref="/communities/all"
      basePath={basePath}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/communities/all" },
        { label: community?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(
  CommunitiesLayout,
  "COMMUNITIES",
  "canRead",
);

