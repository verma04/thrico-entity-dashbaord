"use client";

import React, { useMemo } from "react";
import { useGetUserHeadlineGraph } from "@/graphql/quries/headline/headline-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Type, Users } from "lucide-react";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border rounded-xl p-5 shadow-sm space-y-4 bg-card"
          >
            <div className="flex items-center gap-3 border-b pb-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-1/2" />
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, j) => (
                  <Skeleton
                    key={j}
                    className="h-8 w-8 rounded-full border-2 border-background"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (headlinesWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Type className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No headline data found</p>
        <p className="text-sm">There are no headline relationships recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {headlinesWithUsers.map(({ headline, users, count }) => (
        <div
          key={headline.id}
          className="border border-border/50 bg-card rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex items-start gap-3 border-b border-border/50 pb-4 mb-4">
            <div className="bg-cyan-100 text-cyan-600 p-2.5 rounded-lg">
              <Type className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate" title={headline.title}>
                {headline.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <Users className="h-3 w-3" />
                <span>
                  {count} {count === 1 ? "User" : "Users"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Users
              </p>
              <div className="flex flex-wrap gap-2">
                {users.slice(0, 8).map((user) => {
                  const name =
                    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    "User";
                  const avatarUrl = user.avatar
                    ? `${process.env.NEXT_PUBLIC_CDN_URL}/${user.avatar}`
                    : "";

                  return (
                    <UserProfileHoverCard
                      key={user.id}
                      user={{ id: user.globalUserId, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, headline: user.headline }}
                    >
                      <Avatar
                        className="h-8 w-8 border-2 border-background shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                        title={`${name} ${user.headline ? `- ${user.headline}` : ""}`}
                      >
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                          {user.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </UserProfileHoverCard>
                  );
                })}
                {users.length > 8 && (
                  <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-background flex items-center justify-center text-[10px] font-medium text-slate-600 shadow-sm">
                    +{users.length - 8}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
