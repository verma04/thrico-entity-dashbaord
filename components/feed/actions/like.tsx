"use client";

import { useApolloClient } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart } from "lucide-react";
import { GET_ALL_FEED } from "../../../graphql/quries/feed";

import type { FeedProps } from "../types";
import { useLikeFeed } from "@/graphql/actions/feed";

const Like = ({ item }: FeedProps) => {
  const [disabled, setDisabled] = useState(false);
  const client = useApolloClient();
  const [like] = useLikeFeed({});

  const checkValueLikes = async (
    feed: { id: string; totalReactions: number; isLiked: boolean }[],
    item: { id: string; totalReactions: number; isLiked: boolean }
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

    console.log(newData);
    return newData;
  };

  const likeUpdate = async () => {
    const { getAllFeed } = client.readQuery({
      query: GET_ALL_FEED,
      variables: {
        input: {
          offset: 0,
          limit: 10,
        },
      },
    });
    const newFeedData = await checkValueLikes(getAllFeed, item);
    client.writeQuery({
      query: GET_ALL_FEED,
      data: {
        getAllFeed: newFeedData,
      },
      variables: {
        input: {
          offset: 0,
          limit: 4,
        },
      },
    });
  };

  return (
    <Button
      disabled={disabled}
      variant="ghost"
      size="sm"
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
        className={`h-4 w-4 ${
          item?.isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
        }`}
        fill={item?.isLiked ? "currentColor" : "none"}
      />
      Like
    </Button>
  );
};

export default Like;
