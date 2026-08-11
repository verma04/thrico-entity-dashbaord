"use client";

import React, { useMemo } from "react";
import {
  Industry,
  useGetUserIndustriesGraph,
} from "@/graphql/quries/industries/industry-queries";
import { Building2, Briefcase } from "lucide-react";
import { ClassificationCard } from "../shared/classification-card";
import { ClassificationSkeletonGrid } from "../shared/classification-skeleton";

// ── Color palette for industries ──
const INDUSTRY_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#14b8a6",
];

function getIndustryColor(index: number) {
  return INDUSTRY_COLORS[index % INDUSTRY_COLORS.length];
}

export function IndustriesListView({
  industries,
  isLoading,
  onEdit,
  onDelete,
}: {
  industries: Industry[];
  isLoading: boolean;
  onEdit: (industry: Industry) => void;
  onDelete: (industry: Industry) => void;
}) {
  const { data: graphData, loading: graphLoading } = useGetUserIndustriesGraph({
    variables: { limit: 100 },
  });

  const industriesWithUsers = useMemo(() => {
    const edges = graphData?.getUserIndustriesGraph || [];

    // Create a map to quickly look up users for an industry by title
    const industriesMap = new Map<string, { users: any[]; count: number }>();

    edges.forEach((edge) => {
      const iTitle = edge.industry.title;
      if (!industriesMap.has(iTitle)) {
        industriesMap.set(iTitle, {
          users: [],
          count: 0,
        });
      }

      const entry = industriesMap.get(iTitle)!;
      if (!entry.users.find((u: any) => u.id === edge.user.id)) {
        entry.users.push(edge.user);
        entry.count++;
      }
    });

    // Map the global industries list to include the graph users
    return industries
      .map((industry) => {
        const graphInfo = industriesMap.get(industry.title) || {
          users: [],
          count: 0,
        };
        return {
          industry,
          users: graphInfo.users,
          count: graphInfo.count,
        };
      })
      .sort((a, b) => b.count - a.count); // Sort by popularity
  }, [industries, graphData]);

  if (isLoading || graphLoading) {
    return <ClassificationSkeletonGrid />;
  }

  if (industriesWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Briefcase className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No industry data found</p>
        <p className="text-sm">
          There are no industry relationships recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {industriesWithUsers.map(({ industry, users, count }, index) => {
        const color = getIndustryColor(index);

        return (
          <ClassificationCard
            key={industry.id}
            id={industry.id}
            title={industry.title}
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
            icon={<Building2 className="h-4 w-4" />}
            onEdit={() => onEdit(industry)}
            onDelete={() => onDelete(industry)}
          />
        );
      })}
    </div>
  );
}
