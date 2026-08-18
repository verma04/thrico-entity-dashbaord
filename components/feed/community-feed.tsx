"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Sparkles } from "lucide-react";

import Feed from "./feed";
import { useCommunityFeeds } from "@/graphql/actions/feed";

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

export default function CommunityFeed({
  communityId,
  status,
}: {
  communityId: string;
  status?: string;
}) {
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore } = useCommunityFeeds({
    variables: {
      input: {
        offset: 0,
        limit: 10,
      },
      communityId,
      status,
    },
    skip: !communityId,
  });

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const feeds = data?.getCommunityFeeds || [];

  const loadMoreData = async () => {
    if (isFetchingMore || loading) return;
    setIsFetchingMore(true);
    try {
      await fetchMore({
        variables: {
          input: {
            offset: feeds.length,
            limit: 10,
          },
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          const prevFeeds = prev.getCommunityFeeds || [];
          const newFeeds = fetchMoreResult?.getCommunityFeeds || [];

          if (newFeeds.length === 0) {
            setHasMore(false);
            return prev;
          }

          return Object.assign({}, prev, {
            getCommunityFeeds: [...prevFeeds, ...newFeeds],
          });
        },
      });
    } finally {
      setIsFetchingMore(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-16">
      {loading && feeds.length === 0 ? (
        <div className="space-y-4">
          <FeedSkeleton />
          <FeedSkeleton />
        </div>
      ) : feeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border/80 bg-card/50">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-xs">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
            No Discussions in this Community
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Community members haven't posted any updates yet.
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
                You've reached the end of community discussions
              </p>
            </div>
          }
        >
          <div className="space-y-4">
            {feeds.map((item: any) => (
              <Feed key={item.id} feed={{ ...item, isCommunityFeed: true }} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

