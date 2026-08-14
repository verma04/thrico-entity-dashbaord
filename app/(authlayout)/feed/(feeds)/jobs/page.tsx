"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import Feed from "@/components/feed/feed";
import { useJobFeed } from "@/graphql/actions/feed";
import { Briefcase, Sparkles } from "lucide-react";

function FeedSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-card border border-border/80 p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>
      <Skeleton className="h-52 w-full rounded-xl" />
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

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
      await fetchMore({
        variables: {
          input: {
            offset: data?.getJobFeed?.length || 0,
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

  const feeds = data?.getJobFeed || [];

  return (
    <div className="w-full max-w-2xl mx-auto pb-16">
      {loading && feeds.length === 0 ? (
        <div className="space-y-4">
          <FeedSkeleton />
          <FeedSkeleton />
        </div>
      ) : feeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border/80 bg-card/50">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-xs">
            <Briefcase className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
            No Career Openings Yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Career opportunities, internships, and job postings will appear here.
          </p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={feeds.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            isFetchingMore ? (
              <div className="space-y-4 mt-4">
                <FeedSkeleton />
              </div>
            ) : null
          }
          endMessage={
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-10 w-10 rounded-xl bg-muted/80 flex items-center justify-center mb-3">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                You've reached the end of the career feed
              </p>
            </div>
          }
        >
          <div className="space-y-4">
            {feeds.map((item: any) => (
              <Feed key={item.id} feed={item} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

