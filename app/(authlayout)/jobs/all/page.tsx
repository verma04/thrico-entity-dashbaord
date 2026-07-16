"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import { JobStatus, useJobs } from "@/graphql/actions/jobs";
import TableLoading from "@/components/layout/table-loading";
import Jobs from "@/components/jobs/jobs";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const Page = () => {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const searchQuery = searchParams.get("q") || "";
  
  // Map string param to JobStatus enum
  const status = (statusParam?.toUpperCase() as JobStatus) || JobStatus.ALL;

  const { data, loading } = useJobs({
    variables: {
      input: {
        status: status,
      },
    },
    fetchPolicy: "network-only",
  });

  // Client-side filtering for search query (if API doesn't support it yet)
  const filteredData = data?.getJob?.data?.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof job.location === 'string' ? job.location : job.location?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <TableLoading />
      ) : (
        <Jobs data={filteredData} />
      )}
    </>
  );
};

export default withModulePermission(
  Page,
  "JOBS",
  "canRead"
);
