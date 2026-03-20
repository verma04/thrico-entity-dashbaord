"use client";

import React, { useState } from "react";
import { useGetUserGamificationActivityLog } from "@/graphql/actions/gamification/gamification-quiries";
import { UserActivityLogTable } from "./user-activity-log-table";
import { Button } from "@/components/ui/button";
import { ScrollText, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Card, CardContent } from "@/components/ui/card";

export function UserActivityLogManager() {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, loading, error } = useGetUserGamificationActivityLog({
    variables: {
      input: {
        limit,
        offset,
      },
    },
    fetchPolicy: "network-only",
  });

  const logs = data?.getUserGamificationActivityLog || [];

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
            Error loading user activity logs
          </p>
          <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Gamification History"
        badgeText="Gamification"
        description="Detailed view of user actions, points earned, and badges achieved unlocks across the ecosystem."
        icon={ScrollText}
      />

      <EcosystemActionBar>
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-1 min-w-12 font-medium text-slate-500">
            <LayoutGrid className="h-4 w-4 text-slate-400" />
            Showing Page {Math.floor(offset / limit) + 1}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={handlePrev}
              disabled={offset === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </Button>
            <div className="h-9 min-w-12 flex items-center justify-center font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-none">
              {Math.floor(offset / limit) + 1}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={handleNext}
              disabled={logs.length < limit || loading}
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="rounded-2xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/20 overflow-hidden">
          <UserActivityLogTable logs={logs} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
