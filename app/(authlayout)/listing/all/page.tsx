"use client";
import React from "react";
import { useListings } from "../../../../graphql/actions/listing";

import TableLoading from "@/components/layout/table-loading";
import { ListingsTable } from "@/components/listings/listings-table";

const page = () => {
  const { data, error, loading } = useListings({
    variables: {
      input: {
        status: "ALL",
      },
    },
  });
  return (
    <>
      {loading && <TableLoading />}
      {/* <ListingsTable listings={data?.getListing} /> */}
    </>
  );
};

export default page;
