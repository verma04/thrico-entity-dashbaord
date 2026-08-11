"use client";

import React, { useMemo } from "react";
import { useGetUserLocationGraph } from "@/graphql/quries/location/location-queries";
import { MapPin } from "lucide-react";
import { ClassificationCard } from "../shared/classification-card";
import { ClassificationSkeletonGrid } from "../shared/classification-skeleton";

export function LocationListView({ search }: { search?: string }) {
  const { data, loading } = useGetUserLocationGraph({
    variables: { limit: 100, search: search || undefined },
  });

  const locationsWithUsers = useMemo(() => {
    const edges = data?.getUserLocationGraph || [];
    const locationsMap = new Map<
      string,
      { location: any; users: any[]; count: number }
    >();

    edges.forEach((edge) => {
      const lid = edge.location.id;
      if (!locationsMap.has(lid)) {
        locationsMap.set(lid, {
          location: edge.location,
          users: [],
          count: 0,
        });
      }

      const entry = locationsMap.get(lid)!;
      if (!entry.users.find((u) => u.id === edge.user.id)) {
        entry.users.push(edge.user);
        entry.count++;
      }
    });

    return Array.from(locationsMap.values()).sort((a, b) => b.count - a.count);
  }, [data]);

  if (loading) {
    return <ClassificationSkeletonGrid />;
  }

  if (locationsWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <MapPin className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No location data found</p>
        <p className="text-sm">
          There are no location relationships recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {locationsWithUsers.map(({ location, users, count }) => (
        <ClassificationCard
          key={location.id}
          id={location.id}
          title={location.title}
          count={count}
          users={users.map((u: any) => ({
            id: u.id,
            globalUserId: u.globalUserId,
            firstName: u.firstName,
            lastName: u.lastName,
            avatar: u.avatar,
            headline: u.headline,
          }))}
          color="#e11d48"
          icon={<MapPin className="h-4 w-4" />}
          countLabelSingular="Member"
          countLabelPlural="Members"
        />
      ))}
    </div>
  );
}
