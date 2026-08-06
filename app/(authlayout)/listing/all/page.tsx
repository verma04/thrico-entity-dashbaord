"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useListings } from "../../../../graphql/actions/listing";
import TableLoading from "@/components/layout/table-loading";
import { ListingsTable } from "@/components/listings/listings-table";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Store, Plus } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import Link from "next/link";

const STATUS_OPTIONS = [
  { key: "all", label: "All", status: "ALL", dot: "" },
  {
    key: "approved",
    label: "Approved",
    status: "APPROVED",
    dot: "bg-emerald-500",
  },
  { key: "pending", label: "Pending", status: "PENDING", dot: "bg-amber-500" },
  {
    key: "disabled",
    label: "Disabled",
    status: "DISABLED",
    dot: "bg-orange-500",
  },
  { key: "rejected", label: "Rejected", status: "REJECTED", dot: "bg-red-500" },
];

const ListingsAllPage = () => {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get("status") || "ALL";
  const [activeStatus, setActiveStatus] = useState<string>(
    initialStatusParam.toUpperCase(),
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);

  const { data, loading } = useListings({
    variables: {
      input: {
        status: activeStatus === "ALL" ? undefined : activeStatus,
      },
    },
    fetchPolicy: "network-only",
  });

  const listings = data?.getListing?.data || [];

  const filteredListings = listings.filter(
    (item: any) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );



  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Marketplace"
        description={`Manage and view all ${moduleName.toLowerCase()}.`}
        icon={Store}
        breadcrumbs={[
          { label: moduleName, href: "/listing" },
          { label: "All" },
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
              onValueChange={(val) => setActiveStatus(val)}
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
            <Link href="/listing/create">
              <CtaButton>
                <Plus className="h-3.5 w-3.5" />
                Create {singularName}
              </CtaButton>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredListings.length > 0}>
            {filteredListings.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none shadow-none ring-0 bg-transparent">
        {loading ? (
          <TableLoading />
        ) : (
          <ListingsTable listings={filteredListings} />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(ListingsAllPage, "LISTING", "canRead");
