"use client";

import { useApolloClient } from "@apollo/client";
import UpVote from "./forum-up-vote";
import { getDiscussionForumDetailsByID } from "../../../../graphql/actions/discussion-form";
import DownVote from "./forum-down-vote";
import { GET_BY_ID_DISCUSSION_FORUM } from "../../../../graphql/quries/discussion-form";

const Vote = ({ id }: { id: string }) => {
  const { data: details } = getDiscussionForumDetailsByID({
    variables: {
      input: {
        discussionForumId: id,
      },
    },
  });

  const voteCount =
    (details?.getDiscussionForumDetailsByID?.upVotes || 0) -
    (details?.getDiscussionForumDetailsByID?.downVotes || 0);

  const formatVoteCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <>
      {details?.getDiscussionForumDetailsByID && (
        <div className="flex flex-col items-center gap-1 min-w-[48px]">
          <UpVote
            voteType={details?.getDiscussionForumDetailsByID.voteType}
            id={id}
          />

          <div
            className={`text-sm font-bold tabular-nums ${
              voteCount > 0
                ? "text-orange-600 dark:text-orange-500"
                : voteCount < 0
                ? "text-blue-600 dark:text-blue-500"
                : "text-muted-foreground"
            }`}
          >
            {formatVoteCount(voteCount)}
          </div>

          <DownVote
            voteType={details?.getDiscussionForumDetailsByID.voteType}
            id={id}
          />
        </div>
      )}
    </>
  );
};

export default Vote;
