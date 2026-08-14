"use client";

import { useApolloClient } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { GET_ALL_FEED } from "../../../graphql/quries/feed";

import type { FeedProps } from "../types";
import { useLikeFeed } from "@/graphql/actions/feed";

const Like = ({ item }: { item: FeedProps }) => {
  const [disabled, setDisabled] = useState(false);
  const client = useApolloClient();
  const [like] = useLikeFeed({});

  const checkValueLikes = (
    feed: { id: number; totalReactions: number; isLiked: boolean }[],
    item: { id: number; totalReactions: number; isLiked: boolean }
  ) => {
    return feed.map((set: any) =>
      set.id === item.id
        ? {
            ...set,
            totalReactions: item?.isLiked
              ? Math.max(0, (item?.totalReactions || 1) - 1)
              : (item?.totalReactions || 0) + 1,
            isLiked: !item?.isLiked,
          }
        : set
    );
  };

  const likeUpdate = () => {
    try {
      const queryData = client.readQuery({
        query: GET_ALL_FEED,
        variables: {
          input: {
            offset: 0,
            limit: 10,
          },
        },
      });

      if (!queryData?.getAllFeed) return;

      const newFeedData = checkValueLikes(queryData.getAllFeed, item);
      client.writeQuery({
        query: GET_ALL_FEED,
        data: {
          getAllFeed: newFeedData,
        },
        variables: {
          input: {
            offset: 0,
            limit: 10,
          },
        },
      });
    } catch {
      // Query might not be in cache, that's fine
    }
  };

  const reactionCount = item?.totalReactions || 0;

  return (
    <Button
      disabled={disabled}
      variant="ghost"
      size="sm"
      className={cn(
        "rounded-lg h-8 px-2.5 font-medium text-xs transition-all duration-200 flex items-center gap-1.5",
        item?.isLiked
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      )}
      onClick={async (e) => {
        e.stopPropagation();
        like({
          variables: {
            input: {
              id: item.id,
            },
          },
        });
        likeUpdate();
      }}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform duration-300",
          item?.isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-current"
        )}
        strokeWidth={item?.isLiked ? 0 : 2}
      />
      <span>
        {reactionCount > 0 ? (
          <span>
            {item?.isLiked ? "Liked" : "Like"}{" "}
            <span className="font-semibold text-[11px] opacity-90">({reactionCount})</span>
          </span>
        ) : (
          "Like"
        )}
      </span>
    </Button>
  );
};

export default Like;

