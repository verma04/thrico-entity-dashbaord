"use client";
import React from "react";
import { getPolls } from "../../graphql/actions/polls";

import List from "./poll-list";
import TableLoading from "../layout/table-loading";
import { PollProps } from "./ts-types";

const Poll: React.FC<PollProps> = ({ by }) => {
  const { data, loading } = getPolls({
    variables: {
      input: {
        by: by,
      },
    },
  });
  return <>{loading ? <TableLoading /> : <List data={data?.getPolls} />}</>;
};

export default Poll;
