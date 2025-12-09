"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";

import Feed from "./feed";
import { useAllFeed } from "@/graphql/actions/feed";

export default function AdminFeed() {
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore } = useAllFeed({
    variables: {
      input: {
        offset: 0,
        limit: 10,
      },
    },
  });
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadMoreData = async () => {
    if (isFetchingMore || loading) return;
    setIsFetchingMore(true);
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          input: {
            offset: data?.getAllFeed?.length,
            limit: 10,
          },
        },
        updateQuery(prev, { fetchMoreResult, variables }) {
          if (!fetchMoreResult || fetchMoreResult?.getAllFeed?.length === 0) {
            setHasMore(false);
            return prev;
          } else {
            return Object.assign({}, prev, {
              getAllFeed: [...prev.getAllFeed, ...fetchMoreResult.getAllFeed],
            });
          }
        },
      });
    } finally {
      setIsFetchingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div id="scrollableDiv" className="h-[800px] ">
        <InfiniteScroll
          dataLength={data?.getAllFeed?.length || 0}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            isFetchingMore ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
              </div>
            ) : null
          }
          endMessage={
            <div className="text-center py-8 text-muted-foreground">
              It is all, nothing more 🤐
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          <div className="space-y-4">
            {data?.getAllFeed?.map((item) => (
              <Feed key={item.id} feed={item} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
