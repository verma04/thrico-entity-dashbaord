"use client";
import React from "react";
import { useListings } from "../../../../graphql/actions/listing";
import TableLoading from "@/components/layout/table-loading";

const Page = () => {
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
      {/* <Listing data={data?.getListing} /> */}
    </>
  );
};

export default Page;
