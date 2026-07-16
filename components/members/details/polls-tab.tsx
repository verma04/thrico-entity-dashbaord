"use client";

import React, { useState } from "react";
import PollList from "@/components/polls/poll-list";
import { getPolls } from "@/graphql/actions/polls";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PollsTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;

  const { data, loading, error, fetchMore } = getPolls({
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
        Error loading polls: {error.message}
      </div>
    );
  }

  const pollsData = data?.getPolls || [];

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          input: {
            userId,
            offset: pollsData.length,
            limit,
          },
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          if (!fetchMoreResult || fetchMoreResult?.getPolls?.length === 0) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getPolls.length < limit) {
            setHasMore(false);
          }
          return {
            getPolls: [...prev.getPolls, ...fetchMoreResult.getPolls],
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
      <PollList data={pollsData} isLoading={loading && !data} />
      {hasMore && pollsData.length > 0 && (
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
