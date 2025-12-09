"use client";

import { useState } from "react";
import { ArrowBigDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downVoteDiscussionForum } from "../../../../graphql/actions/discussion-form";
import { voteType } from "../../ts-types";
import { useApolloClient } from "@apollo/client";
import { GET_BY_ID_DISCUSSION_FORUM } from "../../../../graphql/quries/discussion-form";
import { PostEngagement } from "../../ts-types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DownVote = ({ id, voteType }: { id: string; voteType: voteType }) => {
  const client = useApolloClient();
  const [downVote] = downVoteDiscussionForum({});

  const downVoteUpdate = async (downVoteFlag: boolean) => {
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

    const newValue = data?.getDiscussionForumDetailsByID;
    if (!newValue) return;

    let updatedUpVotes = newValue.upVotes || 0;
    let updatedDownVotes = newValue.downVotes || 0;
    let updatedVoteType = newValue.voteType;

    if (downVoteFlag) {
      if (updatedVoteType === "DOWNVOTE") {
        // Already downvoted, do nothing
        return;
      } else if (updatedVoteType === "UPVOTE") {
        // Change vote to DOWNVOTE
        updatedDownVotes += 1;
        updatedUpVotes = updatedUpVotes > 0 ? updatedUpVotes - 1 : 0;
        updatedVoteType = "DOWNVOTE";
      } else {
        // New downvote
        updatedDownVotes += 1;
        updatedVoteType = "DOWNVOTE";
      }
    } else {
      // Remove downvote
      if (updatedVoteType === "DOWNVOTE") {
        updatedDownVotes = updatedDownVotes > 0 ? updatedDownVotes - 1 : 0;
        updatedVoteType = null;
      } else {
        // No downvote to remove
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

    await downVote({
      variables: {
        input: {
          discussionForumId: id,
          downVote: voteType !== "DOWNVOTE" ? true : false,
        },
      },
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await downVoteUpdate(voteType !== "DOWNVOTE" ? true : false);
    } finally {
      setIsLoading(false);
    }
  };

  const isDownvoted = voteType === "DOWNVOTE";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-md transition-all hover:bg-blue-100 dark:hover:bg-blue-950 ${
              isDownvoted
                ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-950/50"
                : "text-muted-foreground hover:text-blue-600 dark:hover:text-blue-500"
            }`}
            onClick={handleClick}
            disabled={isLoading}
          >
            <ArrowBigDown
              className={`h-5 w-5 transition-all ${
                isDownvoted ? "fill-current" : ""
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isDownvoted ? "Remove downvote" : "Downvote"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownVote;
