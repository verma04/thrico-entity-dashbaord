"use client";
import React from "react";
import TableLoading from "../../../../../components/skeleton/TableLoading";
import Listing from "../../../../../components/listing/Listing";
import { useListings } from "../../../../../graphql/actions/listing";

const page = () => {
  const { data, error, loading } = useListings({
    variables: {
      input: {
        status: "PENDING",
      },
    },
  });
  return (
    <>
      {loading && <TableLoading />}
      <Listing data={data?.getListing} />
    </>
  );
};

export default page;
