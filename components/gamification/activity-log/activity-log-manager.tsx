"use client";

import React, { useState } from "react";
import { useGetGamificationActivityLog } from "@/graphql/actions";
import { ActivityLogTable } from "./activity-log-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ChevronLeft, ChevronRight } from "lucide-react";

export function ActivityLogManager() {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, loading, error } = useGetGamificationActivityLog({
    variables: {
      input: {
        limit,
        offset,
      },
    },
    fetchPolicy: "network-only",
  });

  const logs = data?.getGamificationActivityLog || [];

  const handleNext = () => {
    if (logs.length === limit) {
      setOffset((prev) => prev + limit);
    }
  };

  const handlePrev = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="py-10 text-center">
          <p className="text-destructive font-medium">
            Error loading activity logs
          </p>
          <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <History className="h-4 w-4 text-blue-500" />
            Recent Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrev}
              disabled={offset === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-xs font-medium min-w-[60px] text-center">
              Page {Math.floor(offset / limit) + 1}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNext}
              disabled={logs.length < limit || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ActivityLogTable logs={logs} isLoading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
