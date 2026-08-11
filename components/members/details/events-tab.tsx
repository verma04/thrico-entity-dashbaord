"use client";

import React, { useState } from "react";
import AllEvents from "@/components/events/all-events";
import { getJoinedEvents, getCreatedEvents } from "@/graphql/actions/events";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CreatedEventsTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;

  const { data, loading, error, fetchMore } = getCreatedEvents({
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
        Error loading created events: {error.message}
      </div>
    );
  }

  const eventsData = data?.getCreatedEvents?.events || [];

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          input: {
            userId,
            offset: eventsData.length,
            limit,
          },
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          if (
            !fetchMoreResult ||
            fetchMoreResult?.getCreatedEvents?.events?.length === 0
          ) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getCreatedEvents.events.length < limit) {
            setHasMore(false);
          }
          return {
            getCreatedEvents: {
              ...prev.getCreatedEvents,
              events: [
                ...prev.getCreatedEvents.events,
                ...fetchMoreResult.getCreatedEvents.events,
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
      <AllEvents data={eventsData} loading={loading && !data} viewMode="list" />
      {hasMore && eventsData.length > 0 && (
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

function JoinedEventsTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;

  const { data, loading, error, fetchMore } = getJoinedEvents({
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
        Error loading joined events: {error.message}
      </div>
    );
  }

  const eventsData = data?.getJoinedEvents?.events || [];

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          input: {
            userId,
            offset: eventsData.length,
            limit,
          },
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          if (
            !fetchMoreResult ||
            fetchMoreResult?.getJoinedEvents?.events?.length === 0
          ) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getJoinedEvents.events.length < limit) {
            setHasMore(false);
          }
          return {
            getJoinedEvents: {
              ...prev.getJoinedEvents,
              events: [
                ...prev.getJoinedEvents.events,
                ...fetchMoreResult.getJoinedEvents.events,
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
      <AllEvents data={eventsData} loading={loading && !data} viewMode="list" />
      {hasMore && eventsData.length > 0 && (
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

export function EventsTab({ userId }: { userId: string }) {
  // Fetch initial counts
  const { data: createdData } = getCreatedEvents({
    variables: { input: { userId, offset: 0, limit: 1 } },
    fetchPolicy: "cache-and-network",
  });

  const { data: joinedData } = getJoinedEvents({
    variables: { input: { userId, offset: 0, limit: 1 } },
    fetchPolicy: "cache-and-network",
  });

  const createdCount = createdData?.getCreatedEvents?.totalCount || 0;
  const joinedCount = joinedData?.getJoinedEvents?.totalCount || 0;

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
          <CreatedEventsTab userId={userId} />
        </TabsContent>

        <TabsContent
          value="joined"
          className="mt-0 outline-none animate-in fade-in-50 duration-500"
        >
          <JoinedEventsTab userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
