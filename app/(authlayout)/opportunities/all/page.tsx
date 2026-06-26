"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import {
  OpportunityStatus,
  useAdminOpportunities,
} from "@/graphql/actions/opportunities";
import TableLoading from "@/components/layout/table-loading";
import OpportunitiesTable from "@/components/opportunities/opportunities-table";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const Page = () => {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const searchQuery = searchParams.get("q") || "";

  // Map string param to OpportunityStatus enum
  const status =
    (statusParam?.toUpperCase() as OpportunityStatus) || OpportunityStatus.ALL;

  const { data, loading } = useAdminOpportunities({
    variables: {
      input: {
        status: status,
        search: searchQuery,
      },
    },
    fetchPolicy: "network-only",
  });

  return (
    <>
      {loading ? (
        <TableLoading />
      ) : (
        <OpportunitiesTable data={data?.adminGetOpportunities?.data} />
      )}
    </>
  );
};

export default withModulePermission(Page, "OPPORTUNITIES", "canRead");
