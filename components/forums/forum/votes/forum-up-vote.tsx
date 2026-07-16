"use client";

import { useState } from "react";
import { ArrowBigUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { upVoteDiscussionForum } from "../../../../graphql/actions/discussion-form";
import { PostEngagement, voteType } from "../../ts-types";
import { useApolloClient } from "@apollo/client";
import { GET_BY_ID_DISCUSSION_FORUM } from "../../../../graphql/quries/discussion-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UpVote = ({ id, voteType }: { id: string; voteType: voteType }) => {
  const client = useApolloClient();
  const [upvote] = upVoteDiscussionForum({});

  const upVoteUpdate = async (upVote: boolean) => {
    const data = client.readQuery<{
      getDiscussionForumDetailsByID: PostEngagement;
    }>({
      query: GET_BY_ID_DISCUSSION_FORUM,
      variables: {
        input: {
          discussionForumId: id,
        },
      },
    });

    let newValue = data?.getDiscussionForumDetailsByID;
    if (!newValue) return;

    let updatedUpVotes = newValue.upVotes || 0;
    let updatedDownVotes = newValue.downVotes || 0;
    let updatedVoteType = newValue.voteType;

    if (upVote) {
      if (updatedVoteType === "UPVOTE") {
        // Already upvoted, do nothing
        return;
      } else if (updatedVoteType === "DOWNVOTE") {
        // Change vote to UPVOTE
        updatedUpVotes += 1;
        updatedDownVotes = updatedDownVotes > 0 ? updatedDownVotes - 1 : 0;
        updatedVoteType = "UPVOTE";
      } else {
        // New upvote
        updatedUpVotes += 1;
        updatedVoteType = "UPVOTE";
      }
    } else {
      // Remove upvote
      if (updatedVoteType === "UPVOTE") {
        updatedUpVotes = updatedUpVotes > 0 ? updatedUpVotes - 1 : 0;
        updatedVoteType = null;
      } else {
        // No upvote to remove
        return;
      }
    }

    await client.writeQuery({
      query: GET_BY_ID_DISCUSSION_FORUM,
      variables: {
        input: {
          discussionForumId: id,
        },
      },
      data: {
        getDiscussionForumDetailsByID: {
          ...newValue,
          upVotes: updatedUpVotes,
          downVotes: updatedDownVotes,
          voteType: updatedVoteType,
        },
      },
    });
    await upvote({
      variables: {
        input: {
          discussionForumId: id,
          upVote: voteType !== "UPVOTE" ? true : false,
        },
      },
    });

    // client.writeQuery({
    //   query: GET_BY_ID_DISCUSSION_FORUM,
    //   variables: {
    //     input: {
    //       discussionForumId: id,
    //     },
    //   },
    //   data: {
    //     getAllFeed: newFeedData,
    //   },
    // });
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await upVoteUpdate(voteType !== "UPVOTE" ? true : false);
    } finally {
      setIsLoading(false);
    }
  };

  const isUpvoted = voteType === "UPVOTE";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-md transition-all hover:bg-orange-100 dark:hover:bg-orange-950 ${
              isUpvoted
                ? "text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-950/50"
                : "text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500"
            }`}
            onClick={handleClick}
            disabled={isLoading}
          >
            <ArrowBigUp
              className={`h-5 w-5 transition-all ${
                isUpvoted ? "fill-current" : ""
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isUpvoted ? "Remove upvote" : "Upvote"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UpVote;
