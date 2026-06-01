"use client";

import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import Feed from "@/components/feed/feed";
import { useAllFeed } from "@/graphql/actions/feed";

export function FeedTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore } = useAllFeed({
    variables: {
      input: {
        offset: 0,
        limit: 10,
        userId,
      },
    },
    fetchPolicy: "network-only",
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
            userId,
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

  if (loading && (!data || !data.getAllFeed)) {
    return (
      <div className="space-y-6 mt-6 pb-20 max-w-2xl mx-auto">
        <Skeleton className="h-[200px] w-full rounded-[24px]" />
        <Skeleton className="h-[200px] w-full rounded-[24px]" />
      </div>
    );
  }

  const feeds = data?.getAllFeed || [];

  if (feeds.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
          <span className="text-xl">📭</span>
        </div>
        <p className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest">
          No feed available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="px-4 py-6">
        <InfiniteScroll
          dataLength={feeds.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            isFetchingMore ? (
              <div className="space-y-6 mt-6 pb-20">
                <Skeleton className="h-[200px] w-full rounded-[24px]" />
                <Skeleton className="h-[200px] w-full rounded-[24px]" />
              </div>
            ) : null
          }
          endMessage={
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
                <span className="text-xl">✨</span>
              </div>
              <p className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                You've reached the end of the feed
              </p>
              <div className="mt-2 h-1 w-12 rounded-full bg-zinc-100" />
            </div>
          }
        >
          <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {feeds.map((item: any) => (
              <Feed key={item.id} feed={item} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
