"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Settings,
  AlertTriangle,
  Activity,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { getPollByIdForUser } from "@/graphql/actions/polls";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

const tabItems: ManageTabItem[] = [
  { key: "manage", label: "Overview", icon: MessageSquare, path: "manage" },
  { key: "results", label: "Results", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "audit-log", label: "Audit Log", icon: Activity },
  {
    key: "danger-zone",
    label: "Danger Zone",
    icon: AlertTriangle,
    danger: true,
  },
  { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
];

function PollManagementLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const singularName = useModuleStore((state) => state.pollSingularName);
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/polls/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "manage";

  const { data, loading } = getPollByIdForUser({
    variables: {
      input: {
        pollId: id,
      },
    },
    skip: !id,
  });

  const poll = data?.getPollByIdForUser;

  const statusColor =
    poll?.status === "APPROVED"
      ? "bg-emerald-500"
      : poll?.status === "DISABLED"
        ? "bg-red-500"
        : "bg-amber-500";

  return (
    <ManageItemLayout
      title={poll?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      defaultIcon={MessageSquare}
      iconContainerClassName="bg-indigo-50 border-indigo-100 text-indigo-500"
      status={poll?.status}
      statusVariant={poll?.status === "APPROVED" ? "default" : "secondary"}
      statusColor={statusColor}
      subtitle={
        !loading && poll ? (
          <span>
            {poll.totalVotes || 0} Votes · Visibility:{" "}
            {poll.resultVisibility || "Unknown"}
          </span>
        ) : null
      }
      closeHref="/polls"
      basePath={basePath}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/polls" },
        { label: poll?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(PollManagementLayout, "POLLS", "canRead");
