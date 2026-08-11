"use client";

import React, { useMemo } from "react";
import { useGetUserExperienceGraph } from "@/graphql/quries/experience/experience-queries";
import { Building } from "lucide-react";
import { ClassificationCard } from "../shared/classification-card";
import { ClassificationSkeletonGrid } from "../shared/classification-skeleton";

export function ExperienceListView({ search }: { search?: string }) {
  const { data, loading } = useGetUserExperienceGraph({
    variables: { limit: 100, search: search || undefined },
  });

  const companiesWithUsers = useMemo(() => {
    const edges = data?.getUserExperienceGraph || [];
    const companiesMap = new Map<
      string,
      { company: any; users: any[]; count: number }
    >();

    edges.forEach((edge) => {
      const cid = edge.company.id;
      if (!companiesMap.has(cid)) {
        companiesMap.set(cid, {
          company: edge.company,
          users: [],
          count: 0,
        });
      }

      const entry = companiesMap.get(cid)!;
      if (!entry.users.find((u) => u.id === edge.user.id)) {
        entry.users.push(edge.user);
        entry.count++;
      }
    });

    return Array.from(companiesMap.values()).sort((a, b) => b.count - a.count);
  }, [data]);

  if (loading) {
    return <ClassificationSkeletonGrid />;
  }

  if (companiesWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Building className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No experience data found</p>
        <p className="text-sm">
          There are no company relationships recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {companiesWithUsers.map(({ company, users, count }) => (
        <ClassificationCard
          key={company.id}
          id={company.id}
          title={company.title}
          count={count}
          users={users.map((u: any) => ({
            id: u.id,
            globalUserId: u.globalUserId,
            firstName: u.firstName,
            lastName: u.lastName,
            avatar: u.avatar,
            headline: u.headline,
          }))}
          color="#ea580c"
          icon={<Building className="h-4 w-4" />}
          countLabelSingular="Employee"
          countLabelPlural="Employees"
        />
      ))}
    </div>
  );
}
