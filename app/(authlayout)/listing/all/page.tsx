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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { key: "all",      label: "All",      status: "ALL",      dot: "" },
  { key: "approved", label: "Approved", status: "APPROVED", dot: "bg-emerald-500" },
  { key: "pending",  label: "Pending",  status: "PENDING",  dot: "bg-amber-500" },
  { key: "disabled", label: "Disabled", status: "DISABLED", dot: "bg-orange-500" },
  { key: "rejected", label: "Rejected", status: "REJECTED", dot: "bg-red-500" },
];

const ListingsAllPage = () => {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get("status") || "ALL";
  const [activeStatus, setActiveStatus] = useState<string>(initialStatusParam.toUpperCase());
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

  const currentStatus = STATUS_OPTIONS.find((s) => s.status === activeStatus) || STATUS_OPTIONS[0];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Marketplace"
        description={`Manage and view all ${moduleName.toLowerCase()}.`}
        icon={Store}
        breadcrumbs={[
          { label: moduleName, href: "/listing" },
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
            <Select
              value={activeStatus}
              onValueChange={(val) => setActiveStatus(val)}
            >
              <SelectTrigger className="w-[150px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <div className="flex items-center gap-2">
                  {currentStatus.dot && (
                    <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", currentStatus.dot)} />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.key}
                    value={opt.status}
                    className="rounded-lg text-sm font-medium py-2"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", opt.dot)} />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Link href="/listing/create">
              <Button className="font-semibold text-xs px-4 h-9 rounded-lg shadow-sm gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4" />
                Create {singularName}
              </Button>
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
