"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";

import Feed from "./feed";
import { useCommunityFeeds } from "@/graphql/actions/feed";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function CommunityFeed({
  communityId,
  status,
}: {
  communityId: string;
  status?: string;
}) {
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore, refetch } = useCommunityFeeds({
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
      const { data: fetchMoreResult } = await fetchMore({
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
    <EcosystemWrapper>
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <InfiniteScroll
          dataLength={feeds.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            isFetchingMore ? (
              <div className="space-y-6 mt-6 pb-20 max-w-2xl mx-auto">
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
              <Feed key={item.id} feed={{ ...item, isCommunityFeed: true }} />
            ))}
            {loading && !isFetchingMore && (
              <div className="space-y-6 mt-6 pb-20 max-w-2xl mx-auto">
                <Skeleton className="h-[200px] w-full rounded-[24px]" />
                <Skeleton className="h-[200px] w-full rounded-[24px]" />
              </div>
            )}
          </div>
        </InfiniteScroll>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
