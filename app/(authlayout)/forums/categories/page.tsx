"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { getDiscussionForumCategory } from "../../../../graphql/actions/discussion-form";

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
