import React from "react";
import { getDiscussionForum } from "../../../graphql/actions/discussion-form";
import { discussionForumStatus } from "../ts-types";

import List from "./forum-list";
import TableLoading from "@/components/layout/table-loading";

const Forum = ({ status }: { status: discussionForumStatus }) => {
  const { data, loading } = getDiscussionForum({
    variables: {
      input: {
        status: status,
      },
    },
  });
  return (
    <List data={data?.getDiscussionForum || []} loading={loading} />
  );
};

export default Forum;
