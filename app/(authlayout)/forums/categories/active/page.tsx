"use client";

import React from "react";
import { getDiscussionForumCategory } from "../../../../../graphql/actions/discussion-form";
import TableLoading from "@/components/layout/table-loading";
import List from "@/components/discussion-forum/forum/forum-list";
const page = () => {
  const { data, loading } = getDiscussionForumCategory({
    variables: {
      input: {
        status: "ACTIVE",
      },
    },
  });
  return (
    <List data={data?.getDiscussionForumCategory || []} loading={loading} />
  );
};

export default page;
