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

  const checkValueLikes = async (
    feed: { id: number; totalReactions: number; isLiked: boolean }[],
    item: { id: number; totalReactions: number; isLiked: boolean }
  ) => {
    const newData = await feed.map((set: any) =>
      set.id === item.id
        ? {
            ...set,
            totalReactions: item?.isLiked
              ? item?.totalReactions - 1
              : item?.totalReactions + 1,
            isLiked: !item?.isLiked,
          }
        : set
    );

    return newData;
  };

  const likeUpdate = async () => {
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

    const newFeedData = await checkValueLikes(queryData.getAllFeed, item);
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
  };

  return (
    <Button
      disabled={disabled}
      variant="ghost"
      size="sm"
      className={cn(
        "rounded-full h-9 px-4 font-bold text-[13px] transition-all flex items-center gap-2",
        item?.isLiked 
          ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" 
          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      )}
      onClick={async () => {
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
          item?.isLiked && "scale-110"
        )}
        fill={item?.isLiked ? "currentColor" : "none"}
        strokeWidth={item?.isLiked ? 0 : 2.5}
      />
      {item?.isLiked ? "Liked" : "Like"}
    </Button>
  );
};

export default Like;
