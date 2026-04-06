"use client";

import React, { useState } from "react";
import { useGetGamificationActivityLog } from "@/graphql/actions";
import { ActivityLogTable } from "./activity-log-table";
import { Button } from "@/components/ui/button";
import { History, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export function ActivityLogManager() {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, loading, error, refetch } = useGetGamificationActivityLog({
    variables: {
      input: { limit, offset },
    },
    fetchPolicy: "network-only",
  });

  const logs = data?.getGamificationActivityLog || [];
  const currentPage = Math.floor(offset / limit) + 1;

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
      <EcosystemWrapper>
        <EcosystemHeader
          title="Activity Log"
          badgeText="Gamification"
          description="Track all point emissions, badge awards, and rank changes."
          icon={History}
        />
        <EcosystemContainer className="p-12">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
              <History className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Failed to load activity log
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error.message}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Activity Log"
        badgeText="Gamification"
        description="A complete audit trail of all point awards, badge grants, and rank changes."
        icon={History}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              Live stream
            </span>
          </div>
          <EcosystemActionBar.Separator />
          <span className="text-xs text-muted-foreground">
            Page {currentPage}
          </span>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          {/* Pagination */}
          <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden bg-card">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-r border-border"
              onClick={handlePrev}
              disabled={offset === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-xs font-semibold text-foreground min-w-[28px] text-center">
              {currentPage}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border-l border-border"
              onClick={handleNext}
              disabled={logs.length < limit || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", loading && "animate-spin")}
            />
            Refresh
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">
          Recent Activity
        </h2>

        <ActivityLogTable logs={logs} isLoading={loading} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
