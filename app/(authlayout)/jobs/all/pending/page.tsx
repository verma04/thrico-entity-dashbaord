"use client";
import React from "react";

import { JobStatus, useJobs } from "@/graphql/actions/jobs";
import TableLoading from "@/components/layout/table-loading";
import Jobs from "@/components/jobs/jobs";

const Page = () => {
  const { data, error, loading } = useJobs({
    variables: {
      input: {
        status: JobStatus.PENDING,
      },
    },
  });
  return (
    <>
      {loading && <TableLoading />}
      <Jobs data={data?.getJob} />
    </>
  );
};

export default Page;
