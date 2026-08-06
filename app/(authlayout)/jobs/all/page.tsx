"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";

import { JobStatus, useJobs } from "@/graphql/actions/jobs";
import TableLoading from "@/components/layout/table-loading";
import Jobs from "@/components/jobs/jobs";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CtaButton } from "@/components/ui/cta-button";

const STATUS_OPTIONS = [
  { key: "all",      label: "All",      status: JobStatus.ALL,      dot: "" },
  { key: "approved", label: "Approved", status: JobStatus.APPROVED, dot: "bg-emerald-500" },
  { key: "pending",  label: "Pending",  status: JobStatus.PENDING,  dot: "bg-amber-500" },
  { key: "disabled", label: "Disabled", status: JobStatus.DISABLED, dot: "bg-orange-500" },
  { key: "rejected", label: "Rejected", status: JobStatus.REJECTED, dot: "bg-red-500" },
];

const Page = () => {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get("status");
  const [activeStatus, setActiveStatus] = useState<JobStatus>(
    (initialStatusParam?.toUpperCase() as JobStatus) || JobStatus.ALL
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  const { data, loading } = useJobs({
    variables: {
      input: {
        status: activeStatus === JobStatus.ALL ? undefined : activeStatus,
      },
    },
    fetchPolicy: "network-only",
  });

  const filteredData = data?.getJob?.data?.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof job.location === 'string' ? job.location : job.location?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Job Board"
        description={`Manage and view all ${moduleName.toLowerCase()}.`}
        icon={Briefcase}
        breadcrumbs={[
          { label: moduleName, href: "/jobs" },
          { label: "All" }
        ]}
      />

      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={activeStatus}
              onValueChange={(val) => setActiveStatus(val as JobStatus)}
              placeholder="Status"
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.status,
                label: opt.label,
                dot: opt.dot || undefined,
              }))}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Link href="/jobs/create">
              <CtaButton>
                <Plus className="h-3.5 w-3.5" />
                Create {singularName}
              </CtaButton>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredData.length > 0}>
            {filteredData.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none shadow-none ring-0 bg-transparent">
        {loading ? (
          <TableLoading />
        ) : (
          <Jobs data={filteredData} />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(
  Page,
  "JOBS",
  "canRead"
);
