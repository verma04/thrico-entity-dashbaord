"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import Feed from "@/components/feed/feed";
import { useJobFeed } from "@/graphql/actions/feed";

export default function JobFeed() {
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore } = useJobFeed({
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
            offset: data?.getJobFeed?.length,
            limit: 10,
          },
        },
        updateQuery(prev, { fetchMoreResult }) {
          if (!fetchMoreResult || fetchMoreResult?.getJobFeed?.length === 0) {
            setHasMore(false);
            return prev;
          } else {
            return Object.assign({}, prev, {
              getJobFeed: [...prev.getJobFeed, ...fetchMoreResult.getJobFeed],
            });
          }
        },
      });
    } finally {
      setIsFetchingMore(false);
    }
  };

  return (
    <div className="bg-transparent">
      <div className="px-4 py-6">
        <InfiniteScroll
          dataLength={data?.getJobFeed?.length || 0}
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
                You've reached the end of the career feed
              </p>
              <div className="mt-2 h-1 w-12 rounded-full bg-zinc-100" />
            </div>
          }
        >
          <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {data?.getJobFeed?.map((item: any) => (
              <Feed key={item.id} feed={item} />
            ))}
            {(!data?.getJobFeed || data.getJobFeed.length === 0) && !loading && (
              <div className="text-center py-20 bg-zinc-50 border border-zinc-100 rounded-[32px]">
                 <p className="text-zinc-400 font-bold uppercase tracking-widest text-[11px]">No Job Feed Found</p>
              </div>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
