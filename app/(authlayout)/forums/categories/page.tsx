"use client";

import React from "react";
import { getDiscussionForumCategory } from "../../../../graphql/actions/discussion-form";
import TableLoading from "@/components/layout/table-loading";
import List from "@/components/discussion-forum/categories/forum-category-list";

const page = () => {
  const { data, loading } = getDiscussionForumCategory({
    variables: {
      input: {
        status: "ALL",
      },
    },
  });
  return (
    <>
      {loading && <TableLoading />}
      {!loading && <List data={data?.getDiscussionForumCategory} />}
    </>
  );
};

export default page;
