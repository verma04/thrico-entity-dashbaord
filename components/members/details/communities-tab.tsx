"use client";

import React, { useState } from "react";
import List from "@/components/communities/communities-list";
import {
  getJoinedCommunities,
  getCreatedCommunities,
} from "@/graphql/actions/group";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CreatedCommunitiesTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;

  const { data, loading, error, fetchMore } = getCreatedCommunities({
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
        Error loading created communities: {error.message}
      </div>
    );
  }

  const communitiesData = data?.getCreatedCommunities?.data || [];

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
          if (
            !fetchMoreResult ||
            fetchMoreResult?.getCreatedCommunities?.data?.length === 0
          ) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getCreatedCommunities.data.length < limit) {
            setHasMore(false);
          }
          return {
            getCreatedCommunities: {
              ...prev.getCreatedCommunities,
              data: [
                ...prev.getCreatedCommunities.data,
                ...fetchMoreResult.getCreatedCommunities.data,
              ],
            },
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

function JoinedCommunitiesTabList({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;

  const { data, loading, error, fetchMore } = getJoinedCommunities({
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
        Error loading joined communities: {error.message}
      </div>
    );
  }

  const communitiesData = data?.getJoinedCommunities?.data || [];

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
          if (
            !fetchMoreResult ||
            fetchMoreResult?.getJoinedCommunities?.data?.length === 0
          ) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getJoinedCommunities.data.length < limit) {
            setHasMore(false);
          }
          return {
            getJoinedCommunities: {
              ...prev.getJoinedCommunities,
              data: [
                ...prev.getJoinedCommunities.data,
                ...fetchMoreResult.getJoinedCommunities.data,
              ],
            },
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

export function CommunitiesTab({ userId }: { userId: string }) {
  // Fetch initial counts
  const { data: createdData } = getCreatedCommunities({
    variables: { input: { userId, offset: 0, limit: 1 } },
    fetchPolicy: "cache-and-network",
  });

  const { data: joinedData } = getJoinedCommunities({
    variables: { input: { userId, offset: 0, limit: 1 } },
    fetchPolicy: "cache-and-network",
  });

  const createdCount = createdData?.getCreatedCommunities?.total || 0;
  const joinedCount = joinedData?.getJoinedCommunities?.total || 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="created" className="w-full">
        <div className="border-b border-border mb-6">
          <TabsList className="h-auto p-0 bg-transparent flex justify-start gap-2">
            <TabsTrigger
              value="created"
              className="gap-2 px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Created ({createdCount})
            </TabsTrigger>
            <TabsTrigger
              value="joined"
              className="gap-2 px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Joined ({joinedCount})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="created"
          className="mt-0 outline-none animate-in fade-in-50 duration-500"
        >
          <CreatedCommunitiesTab userId={userId} />
        </TabsContent>

        <TabsContent
          value="joined"
          className="mt-0 outline-none animate-in fade-in-50 duration-500"
        >
          <JoinedCommunitiesTabList userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
