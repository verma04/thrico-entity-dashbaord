"use client";

import React, { useState } from "react";
import Jobs from "@/components/jobs/jobs";
import { useJobs, useAppliedJobs } from "@/graphql/actions/jobs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CreatedJobsTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;

  const { data, loading, error, fetchMore } = useJobs({
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
        Error loading jobs: {error.message}
      </div>
    );
  }

  const jobsData = data?.getJob?.data || [];

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const { data: fetchMoreResult } = await fetchMore({
        variables: {
          input: {
            userId,
            offset: jobsData.length,
            limit,
          },
        },
        updateQuery(prev: any, { fetchMoreResult }: any) {
          if (!fetchMoreResult || fetchMoreResult?.getJob?.data?.length === 0) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getJob.data.length < limit) {
            setHasMore(false);
          }
          return {
            getJob: {
              ...prev.getJob,
              data: [...prev.getJob.data, ...fetchMoreResult.getJob.data],
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
      <Jobs data={jobsData as any} />
      {hasMore && jobsData.length > 0 && (
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

function AppliedJobsTab({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 10;
  const [page, setPage] = useState(1);

  const { data, loading, error, fetchMore } = useAppliedJobs({
    variables: {
      userId,
      page: 1,
      limit,
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
        Error loading jobs: {error.message}
      </div>
    );
  }

  const jobsData = data?.getAppliedJobs?.data || [];

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
          if (!fetchMoreResult || fetchMoreResult?.getAppliedJobs?.data?.length === 0) {
            setHasMore(false);
            return prev;
          }
          if (fetchMoreResult.getAppliedJobs.data.length < limit) {
            setHasMore(false);
          }
          return {
            getAppliedJobs: {
              ...prev.getAppliedJobs,
              data: [...prev.getAppliedJobs.data, ...fetchMoreResult.getAppliedJobs.data],
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
      <Jobs data={jobsData as any} />
      {hasMore && jobsData.length > 0 && (
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

export function JobsTab({ userId }: { userId: string }) {
  // We need to fetch the initial data for both to get the counts
  const { data: createdData } = useJobs({
    variables: { input: { userId, offset: 0, limit: 1 } },
    fetchPolicy: "cache-and-network",
  });

  const { data: appliedData } = useAppliedJobs({
    variables: { userId, page: 1, limit: 1 },
    fetchPolicy: "cache-and-network",
  });

  const createdCount = createdData?.getJob?.total || 0;
  const appliedCount = appliedData?.getAppliedJobs?.total || 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="created" className="w-full">
        <div className="border-b border-border mb-6">
          <TabsList className="h-auto p-0 bg-transparent flex justify-start gap-2">
            <TabsTrigger 
              value="created"
              className="gap-2 px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Created Jobs ({createdCount})
            </TabsTrigger>
            <TabsTrigger 
              value="applied"
              className="gap-2 px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Jobs Applied To ({appliedCount})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="created" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <CreatedJobsTab userId={userId} />
        </TabsContent>
        <TabsContent value="applied" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <AppliedJobsTab userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
