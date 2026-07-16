"use client";

import React, { useState } from "react";
import { OffersTable } from "@/components/offers/offers-table";
import { useGetOffers } from "@/graphql/actions/offers";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OffersTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;

  const { data, loading, error, refetch, fetchMore } = useGetOffers(
    {
      userId,
      pagination: {
        offset: 0,
        limit,
      },
    },
    { fetchPolicy: "network-only" },
  );

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
        Error loading offers: {error.message}
      </div>
    );
  }

  const offersData = data?.getOffers || [];

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          input: {
            userId,
            pagination: {
              offset: offersData.length,
              limit,
            },
          },
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          if (!fetchMoreResult || fetchMoreResult?.getOffers?.length === 0) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getOffers.length < limit) {
            setHasMore(false);
          }
          return {
            getOffers: [...prev.getOffers, ...fetchMoreResult.getOffers],
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
      <OffersTable
        offers={offersData}
        isLoading={loading && !data}
        onEdit={() => {}}
        refetch={refetch}
      />
      {hasMore && offersData.length > 0 && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            className="w-full sm:w-auto"
          >
            {isFetchingMore && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
