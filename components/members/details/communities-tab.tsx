"use client";

import React, { useState } from "react";
import List from "@/components/communities/communities-list";
import { getCommunities } from "@/graphql/actions/group";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunitiesTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;

  const { data, loading, error, fetchMore } = getCommunities({
    variables: {
      input: {
        userId,
        offset: 0,
        limit,
      },
    },
    fetchPolicy: "network-only",
  });

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-sm">
        Error loading communities: {error.message}
      </div>
    );
  }

  const communitiesData = data?.getCommunities || [];

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          input: {
            userId,
            offset: communitiesData.length,
            limit,
          },
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          if (!fetchMoreResult || fetchMoreResult?.getCommunities?.length === 0) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getCommunities.length < limit) {
            setHasMore(false);
          }
          return {
            getCommunities: [...prev.getCommunities, ...fetchMoreResult.getCommunities],
          };
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  return (
    <div className="space-y-4">
      <List data={communitiesData} isLoading={loading && !data} />
      {hasMore && communitiesData.length > 0 && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            className="w-full sm:w-auto"
          >
            {isFetchingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
