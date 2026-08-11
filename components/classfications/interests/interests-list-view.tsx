"use client";

import React, { useMemo } from "react";
import {
  Interest,
  useGetUserInterestsGraph,
} from "@/graphql/quries/interests/interest-queries";
import { Heart } from "lucide-react";
import { ClassificationCard } from "../shared/classification-card";
import { ClassificationSkeletonGrid } from "../shared/classification-skeleton";

// ── Color palette for interests ──
const INTEREST_COLORS = [
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
];

function getInterestColor(index: number) {
  return INTEREST_COLORS[index % INTEREST_COLORS.length];
}

export function InterestsListView({
  interests,
  isLoading,
  onEdit,
  onDelete,
}: {
  interests: Interest[];
  isLoading: boolean;
  onEdit: (interest: Interest) => void;
  onDelete: (interest: Interest) => void;
}) {
  const { data: graphData, loading: graphLoading } = useGetUserInterestsGraph({
    variables: { limit: 100 },
  });

  const interestsWithUsers = useMemo(() => {
    const edges = graphData?.getUserInterestsGraph || [];

    // Create a map to quickly look up users for an interest by title
    const interestsMap = new Map<string, { users: any[]; count: number }>();

    edges.forEach((edge) => {
      const iTitle = edge.interest.title;
      if (!interestsMap.has(iTitle)) {
        interestsMap.set(iTitle, {
          users: [],
          count: 0,
        });
      }

      const entry = interestsMap.get(iTitle)!;
      if (!entry.users.find((u: any) => u.id === edge.user.id)) {
        entry.users.push(edge.user);
        entry.count++;
      }
    });

    // Map the global interests list to include the graph users
    return interests
      .map((interest) => {
        const graphInfo = interestsMap.get(interest.title) || {
          users: [],
          count: 0,
        };
        return {
          interest,
          users: graphInfo.users,
          count: graphInfo.count,
        };
      })
      .sort((a, b) => b.count - a.count); // Sort by popularity
  }, [interests, graphData]);

  if (isLoading || graphLoading) {
    return <ClassificationSkeletonGrid />;
  }

  if (interestsWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Heart className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No interest data found</p>
        <p className="text-sm">
          There are no interest relationships recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {interestsWithUsers.map(({ interest, users, count }, index) => {
        const color = getInterestColor(index);

        return (
          <ClassificationCard
            key={interest.id}
            id={interest.id}
            title={interest.title}
            count={count}
            users={users.map((u: any) => ({
              id: u.id,
              globalUserId: u.globalUserId,
              firstName: u.firstName,
              lastName: u.lastName,
              avatar: u.avatar,
              headline: u.headline,
            }))}
            color={color}
            icon={<Heart className="h-4 w-4" />}
            onEdit={() => onEdit(interest)}
            onDelete={() => onDelete(interest)}
          />
        );
      })}
    </div>
  );
}
