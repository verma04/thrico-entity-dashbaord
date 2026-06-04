"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { getDiscussionForumCategory } from "../../../../graphql/actions/discussion-form";
import TableLoading from "@/components/layout/table-loading";
import List from "@/components/forums/categories/forum-category-list";

const page = () => {
  const { data, loading } = getDiscussionForumCategory({
    variables: {
      input: {
        status: "ALL",
      },
    },
  });
  return (
    <List data={data?.getDiscussionForumCategory || []} loading={loading} />
  );
};

export default withSubscriptionCheck(
  withModulePermission(page, "FORUMS", "canRead"),
  "forums",
);
