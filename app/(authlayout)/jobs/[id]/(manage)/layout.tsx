"use client";

import React, { useState } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  Settings,
  AlertTriangle,
  Activity,
  ShieldAlert,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useGetJobById } from "@/graphql/actions/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";
import { toast } from "sonner";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import moment from "moment";
import { cn } from "@/lib/utils";

function JobManagementLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/jobs/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "manage";

  const moduleName = useModuleStore((state) => state.jobModuleName) || "Jobs";
  const singularName = useModuleStore((state) => state.jobSingularName) || "Job";

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, refetch } = useGetJobById({
    variables: {
      id: id,
    },
    skip: !id,
  });

  const job = data?.getJobById;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) {
        await refetch();
      }
      toast.success(`${singularName} details refreshed`);
    } catch {
      toast.error("Failed to refresh details");
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const handleExportSummary = () => {
    if (!job) {
      toast.error("No job data available to export");
      return;
    }

    const summaryRow = [
      {
        id: job.id || id,
        title: job.title || "",
        company: job.company?.name || "",
        location: job.location?.name || "Remote / Unspecified",
        jobType: job.jobType || "",
        workplaceType: job.workplaceType || "",
        salary: job.salary || "",
        experienceLevel: job.experienceLevel || "",
        status: job.status || "APPROVED",
        applicants: job.numberOfApplicant ?? 0,
        views: job.numberOfViews ?? 0,
        deadline: job.applicationDeadline
          ? moment(job.applicationDeadline).format("YYYY-MM-DD")
          : "None",
      },
    ];

    const csv = buildCsv(summaryRow, [
      { header: "Listing ID", getValue: (r) => r.id },
      { header: "Job Title", getValue: (r) => r.title },
      { header: "Company", getValue: (r) => r.company },
      { header: "Location", getValue: (r) => r.location },
      { header: "Employment Type", getValue: (r) => r.jobType },
      { header: "Workplace", getValue: (r) => r.workplaceType },
      { header: "Salary", getValue: (r) => r.salary },
      { header: "Experience", getValue: (r) => r.experienceLevel },
      { header: "Status", getValue: (r) => r.status },
      { header: "Applicants", getValue: (r) => r.applicants },
      { header: "Views", getValue: (r) => r.views },
      { header: "Application Deadline", getValue: (r) => r.deadline },
    ]);

    downloadCsv(csv, `${singularName.toLowerCase()}-${job.title?.toLowerCase().replace(/\s+/g, "-") || id}`);
    toast.success(`Exported ${singularName.toLowerCase()} summary`);
  };

  const tabItems: ManageTabItem[] = [
    { key: "manage", label: "Overview", icon: Briefcase, path: "manage" },
    {
      key: "applicants",
      label: "Applicants",
      icon: Users,
      path: "applicants",
      count: job?.numberOfApplicant,
    },
    { key: "settings", label: "Settings", icon: Settings, path: "settings" },
    { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, path: "danger-zone", danger: true },
    { key: "audit-log", label: "Audit Log", icon: Activity, path: "audit-log" },
    { key: "reported-items", label: "Reported Items", icon: ShieldAlert, path: "reported-items" },
  ];

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
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSummary}
            className="h-8 gap-1.5 rounded-lg border-border/60 text-xs font-semibold shadow-2xs hover:bg-muted"
          >
            <Upload className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground shadow-2xs"
            title="Refresh details"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`${basePath}/settings`)}
            className="h-8 gap-1.5 rounded-lg border-border/60 text-xs font-semibold shadow-2xs hover:bg-muted"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Button>
        </div>
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
