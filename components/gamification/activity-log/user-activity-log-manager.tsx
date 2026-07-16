"use client";

import React, { useState } from "react";
import { useGetUserGamificationActivityLog } from "@/graphql/actions/gamification/gamification-quiries";
import { UserActivityLogTable } from "./user-activity-log-table";
import { Button } from "@/components/ui/button";
import { ScrollText, ChevronLeft, ChevronRight } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export function UserActivityLogManager() {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, loading, error } = useGetUserGamificationActivityLog({
    variables: { input: { limit, offset } },
    fetchPolicy: "network-only",
  });

  const logs = data?.getUserGamificationActivityLog || [];
  const currentPage = Math.floor(offset / limit) + 1;

  const handleNext = () => {
    if (logs.length === limit) setOffset((prev) => prev + limit);
  };

  const handlePrev = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  if (error) {
    return (
      <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <p className="text-sm font-medium text-destructive">Error loading activity logs</p>
        <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Member Activity History"
        badgeText="Gamification"
        description="Detailed log of member actions, points earned, and badges achieved."
        icon={ScrollText}
      />

      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          <span className="text-xs text-muted-foreground">Page {currentPage}</span>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
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
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 overflow-hidden">
        <UserActivityLogTable logs={logs} isLoading={loading} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
