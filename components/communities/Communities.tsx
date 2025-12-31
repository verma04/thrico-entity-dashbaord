"use client";

import List from "./communities-list";
import { getCommunities } from "@/graphql/actions/group";
import TableLoading from "../layout/table-loading";

interface CommunitiesProps {
  status?: string;
}

export default function Communities({ status }: CommunitiesProps) {
  const { data, loading } = getCommunities({
    variables: {
      input: {
        status,
      },
    },
  });

  if (loading) {
    return <TableLoading />;
  }
  return <List data={data?.getCommunities} />;
}
