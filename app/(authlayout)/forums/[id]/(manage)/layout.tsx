"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Settings,
  AlertTriangle,
  Activity,
  MessageSquare,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";
import { getDiscussionForumDetailsByID } from "@/graphql/actions/discussion-form";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

const tabItems: ManageTabItem[] = [
  { key: "manage", label: "Overview", icon: MessageSquare, path: "manage" },
  { key: "comments", label: "Comments", icon: MessageCircle },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "audit-log", label: "Audit Log", icon: Activity },
  { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
  { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
];

function ForumManagementLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/forums/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "manage";

  const { data, loading } = getDiscussionForumDetailsByID({
    variables: {
      input: {
        discussionForumId: id,
      },
    },
    skip: !id,
  });

  const forum = data?.getDiscussionForumDetailsByID;

  const statusColor =
    forum?.status === "APPROVED"
      ? "bg-emerald-500"
      : forum?.status === "DISABLED" || forum?.status === "REJECTED"
        ? "bg-red-500"
        : "bg-amber-500";

  return (
    <ManageItemLayout
      title={forum?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      defaultIcon={MessageSquare}
      iconContainerClassName="bg-indigo-50 border-indigo-100 text-indigo-500"
      status={forum?.status}
      statusVariant={forum?.status === "APPROVED" ? "default" : "secondary"}
      statusColor={statusColor}
      subtitle={
        !loading && forum ? (
          <span>
            {forum.author?.firstName} {forum.author?.lastName} ·{" "}
            {forum.category?.name || "General"}
          </span>
        ) : null
      }
      closeHref="/forums/all"
      basePath={basePath}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/forums/all" },
        { label: forum?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(ForumManagementLayout, "FORUMS", "canRead");

