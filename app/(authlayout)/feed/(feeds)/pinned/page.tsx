"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import Feed from "@/components/feed/feed";
import { usePinnedFeed } from "@/graphql/actions/feed";
import { Pin, Sparkles } from "lucide-react";

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

export default function PinnedFeed() {
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore, refetch } = usePinnedFeed({
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
            offset: data?.getPinnedFeed?.length || 0,
            limit: 10,
          },
        },
        updateQuery(prev, { fetchMoreResult }) {
          if (!fetchMoreResult || fetchMoreResult?.getPinnedFeed?.length === 0) {
            setHasMore(false);
            return prev;
          } else {
            return Object.assign({}, prev, {
              getPinnedFeed: [...prev.getPinnedFeed, ...fetchMoreResult.getPinnedFeed],
            });
          }
        },
      });
    } finally {
      setIsFetchingMore(false);
    }
  };

  const feeds = data?.getPinnedFeed || [];

  return (
    <div className="w-full max-w-2xl mx-auto pb-16">
      {loading && feeds.length === 0 ? (
        <div className="space-y-4">
          <FeedSkeleton />
          <FeedSkeleton />
        </div>
      ) : feeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border/80 bg-card/50">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-xs">
            <Pin className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
            No Pinned Posts
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
            Important announcements and highlighted posts pinned by admins will appear here.
          </p>
          <button
            onClick={() => refetch()}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Refresh Pinned Feed
          </button>
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
                That's all the pinned posts for now
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

