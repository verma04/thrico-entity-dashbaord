"use client";

import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Users,
  Settings,
  AlertTriangle,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useGetJobById } from "@/graphql/actions/jobs";
import { Badge } from "@/components/ui/badge";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

const tabItems: ManageTabItem[] = [
  { key: "manage", label: "Overview", icon: Briefcase, path: "manage" },
  { key: "applicants", label: "Applicants", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
  { key: "audit-log", label: "Audit Log", icon: Activity },
  { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
];

function JobManagementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/jobs/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "manage";

  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  const { data, loading } = useGetJobById({
    variables: {
      id: id,
    },
    skip: !id,
  });

  const job = data?.getJobById;

  const statusColor =
    job?.status === "APPROVED"
      ? "bg-emerald-500"
      : job?.status === "DISABLED"
        ? "bg-red-500"
        : "bg-amber-500";

  return (
    <ManageItemLayout
      title={job?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      coverImage={job?.company?.logo}
      defaultIcon={Briefcase}
      status={job?.status}
      statusVariant={job?.status === "APPROVED" ? "default" : "secondary"}
      statusColor={statusColor}
      badges={
        !loading && job?.jobType ? (
          <Badge
            variant="secondary"
            className="px-2 py-0 text-[10px] font-semibold uppercase tracking-wider rounded-md"
          >
            {job.jobType.replace("-", " ")}
          </Badge>
        ) : null
      }
      subtitle={
        !loading && job?.company?.name ? (
          <span>
            {job.company.name}
            {job.location?.name ? ` · ${job.location.name}` : ""}
          </span>
        ) : null
      }
      closeHref="/jobs/all"
      basePath={basePath}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/jobs/all" },
        { label: job?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(JobManagementLayout, "JOBS", "canRead");

