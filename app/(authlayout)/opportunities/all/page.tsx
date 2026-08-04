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
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Target } from "lucide-react";

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
    <EcosystemWrapper>
      <EcosystemHeader
        title="Opportunities"
        description="Manage all opportunities available to your community."
        badgeText="Opportunities"
        icon={Target}
        breadcrumbs={[
          { label: "Opportunities", href: "/opportunities/all" },
          { label: "All Opportunities" }
        ]}
      />
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-4">
          {loading ? (
            <TableLoading />
          ) : (
            <OpportunitiesTable data={data?.adminGetOpportunities?.data} />
          )}
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(Page, "OPPORTUNITIES", "canRead");
