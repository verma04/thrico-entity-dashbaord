"use client";

import React, { useMemo } from "react";
import { useGetUserEducationGraph } from "@/graphql/quries/education/education-queries";
import { GraduationCap } from "lucide-react";
import { ClassificationCard } from "../shared/classification-card";
import { ClassificationSkeletonGrid } from "../shared/classification-skeleton";

export function EducationListView({ search }: { search?: string }) {
  const { data, loading } = useGetUserEducationGraph({
    variables: { limit: 100, search: search || undefined },
  });

  const schoolsWithUsers = useMemo(() => {
    const edges = data?.getUserEducationGraph || [];
    const schoolsMap = new Map<
      string,
      { school: any; users: any[]; count: number }
    >();

    edges.forEach((edge) => {
      const cid = edge.school.id;
      if (!schoolsMap.has(cid)) {
        schoolsMap.set(cid, {
          school: edge.school,
          users: [],
          count: 0,
        });
      }

      const entry = schoolsMap.get(cid)!;
      if (!entry.users.find((u) => u.id === edge.user.id)) {
        entry.users.push(edge.user);
        entry.count++;
      }
    });

    return Array.from(schoolsMap.values()).sort((a, b) => b.count - a.count);
  }, [data]);

  if (loading) {
    return <ClassificationSkeletonGrid />;
  }

  if (schoolsWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <GraduationCap className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No education data found</p>
        <p className="text-sm">
          There are no school relationships recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {schoolsWithUsers.map(({ school, users, count }) => (
        <ClassificationCard
          key={school.id}
          id={school.id}
          title={school.title}
          count={count}
          users={users.map((u: any) => ({
            id: u.id,
            globalUserId: u.globalUserId,
            firstName: u.firstName,
            lastName: u.lastName,
            avatar: u.avatar,
            headline: u.headline,
          }))}
          color="#10b981"
          icon={<GraduationCap className="h-4 w-4" />}
          countLabelSingular="Alumnus"
          countLabelPlural="Alumni"
        />
      ))}
    </div>
  );
}
