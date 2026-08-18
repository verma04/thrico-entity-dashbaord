"use client";

import React from "react";
import { useGetAllUser, UserDetail } from "@/graphql/actions";
import { MemberGrid } from "../manage/member-grid";
import { Skeleton } from "@/components/ui/skeleton";

interface MembersListCardsProps {
  manualData?: any[];
  loading?: boolean;
}

export const MembersListCards = ({
  manualData,
  loading: manualLoading,
}: MembersListCardsProps) => {
  const { data, loading: queryLoading } = useGetAllUser();

  const loading = manualLoading ?? queryLoading;
  const members = (manualData || data?.getAllUser?.data || data?.getAllUser || []) as UserDetail[];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs space-y-3"
          >
            <Skeleton className="h-24 sm:h-28 w-full rounded-none" />
            <div className="p-3 pt-0 space-y-2.5">
              <Skeleton className="h-3.5 w-4/5 rounded" />
              <div className="space-y-1.5 pt-1 border-t border-border/30">
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-3/5" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/30">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <MemberGrid users={members} />;
};

export default MembersListCards;

