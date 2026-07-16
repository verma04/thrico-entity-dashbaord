"use client";

import { useSearchParams } from "next/navigation";
import { useListings } from "../../../../graphql/actions/listing";
import TableLoading from "@/components/layout/table-loading";
import { ListingsTable } from "@/components/listings/listings-table";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const ListingsAllPage = () => {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") || "ALL";
  const searchQuery = searchParams.get("q") || "";

  const { data, loading } = useListings({
    variables: {
      input: {
        status: statusParam === "ALL" ? undefined : statusParam,
      },
    },
    fetchPolicy: "network-only",
  });

  const listings = data?.getListing?.data || [];

  // Client-side filtering for search query
  const filteredListings = listings.filter(
    (item: any) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {loading ? (
        <TableLoading />
      ) : (
        <ListingsTable listings={filteredListings} />
      )}
    </>
  );
};

export default withModulePermission(ListingsAllPage, "LISTING", "canRead");
