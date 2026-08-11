"use client";

import React, { useMemo } from "react";
import { useGetUserHeadlineGraph } from "@/graphql/quries/headline/headline-queries";
import { Type } from "lucide-react";
import { ClassificationCard } from "../shared/classification-card";
import { ClassificationSkeletonGrid } from "../shared/classification-skeleton";

export function HeadlineListView() {
  const { data, loading } = useGetUserHeadlineGraph({
    variables: { limit: 100 },
  });

  const headlinesWithUsers = useMemo(() => {
    const edges = data?.getUserHeadlineGraph || [];
    const headlinesMap = new Map<
      string,
      { headline: any; users: any[]; count: number }
    >();

    edges.forEach((edge) => {
      const hid = edge.headline.id;
      if (!headlinesMap.has(hid)) {
        headlinesMap.set(hid, {
          headline: edge.headline,
          users: [],
          count: 0,
        });
      }

      const entry = headlinesMap.get(hid)!;
      if (!entry.users.find((u) => u.id === edge.user.id)) {
        entry.users.push(edge.user);
        entry.count++;
      }
    });

    return Array.from(headlinesMap.values()).sort((a, b) => b.count - a.count);
  }, [data]);

  if (loading) {
    return <ClassificationSkeletonGrid />;
  }

  if (headlinesWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Type className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No headline data found</p>
        <p className="text-sm">
          There are no headline relationships recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {headlinesWithUsers.map(({ headline, users, count }) => (
        <ClassificationCard
          key={headline.id}
          id={headline.id}
          title={headline.title}
          count={count}
          users={users.map((u: any) => ({
            id: u.id,
            globalUserId: u.globalUserId,
            firstName: u.firstName,
            lastName: u.lastName,
            avatar: u.avatar,
            headline: u.headline,
          }))}
          color="#0891b2"
          icon={<Type className="h-4 w-4" />}
          countLabelSingular="User"
          countLabelPlural="Users"
        />
      ))}
    </div>
  );
}
