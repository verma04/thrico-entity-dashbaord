"use client";

import React, { useState } from "react";
import { OffersTable } from "@/components/offers/offers-table";
import { useCreatedOffers, useClaimedOffers } from "@/graphql/actions/offers";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CreatedOffersTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;
  const [page, setPage] = useState(1);

  const { data, loading, error, fetchMore, refetch } = useCreatedOffers(userId, 1, limit, {
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
        Error loading offers: {error.message}
      </div>
    );
  }

  const offersData = data?.getCreatedOffersByUserId?.data || [];

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    const nextPage = page + 1;
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          userId,
          page: nextPage,
          limit,
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          if (!fetchMoreResult || fetchMoreResult?.getCreatedOffersByUserId?.data?.length === 0) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getCreatedOffersByUserId.data.length < limit) {
            setHasMore(false);
          }
          return {
            getCreatedOffersByUserId: {
              ...prev.getCreatedOffersByUserId,
              data: [...prev.getCreatedOffersByUserId.data, ...fetchMoreResult.getCreatedOffersByUserId.data],
            },
          };
        },
      });
      setPage(nextPage);
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

function ClaimedOffersTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;
  const [page, setPage] = useState(1);

  const { data, loading, error, fetchMore, refetch } = useClaimedOffers(userId, 1, limit, {
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
        Error loading offers: {error.message}
      </div>
    );
  }

  const offersData = data?.getClaimedOffers?.data || [];

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    const nextPage = page + 1;
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          userId,
          page: nextPage,
          limit,
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          if (!fetchMoreResult || fetchMoreResult?.getClaimedOffers?.data?.length === 0) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getClaimedOffers.data.length < limit) {
            setHasMore(false);
          }
          return {
            getClaimedOffers: {
              ...prev.getClaimedOffers,
              data: [...prev.getClaimedOffers.data, ...fetchMoreResult.getClaimedOffers.data],
            },
          };
        },
      });
      setPage(nextPage);
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

export function OffersTab({ userId }: { userId: string }) {
  // We need to fetch the initial data for both to get the counts
  const { data: createdData } = useCreatedOffers(userId, 1, 1, {
    fetchPolicy: "cache-and-network",
  });

  const { data: claimedData } = useClaimedOffers(userId, 1, 1, {
    fetchPolicy: "cache-and-network",
  });

  const createdCount = createdData?.getCreatedOffersByUserId?.total || 0;
  const claimedCount = claimedData?.getClaimedOffers?.total || 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="created" className="w-full">
        <div className="border-b border-border mb-6">
          <TabsList className="h-auto p-0 bg-transparent flex justify-start gap-2">
            <TabsTrigger 
              value="created"
              className="gap-2 px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Created Offers ({createdCount})
            </TabsTrigger>
            <TabsTrigger 
              value="claimed"
              className="gap-2 px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Claimed Offers ({claimedCount})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="created" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <CreatedOffersTab userId={userId} />
        </TabsContent>
        <TabsContent value="claimed" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <ClaimedOffersTab userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
