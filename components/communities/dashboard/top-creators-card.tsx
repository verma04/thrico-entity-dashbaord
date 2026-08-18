"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { getCommunities } from "@/graphql/actions/group";
import type { TopCreator } from "@/graphql/actions/communities";

interface TopCreatorsCardProps {
  loading: boolean;
  moduleName: string;
  topCreators: TopCreator[];
}

export function TopCreatorsCard({
  loading,
  moduleName,
  topCreators,
}: TopCreatorsCardProps) {
  const { data: allCommunitiesData } = getCommunities({
    variables: {
      input: {
        status: "ALL",
      },
    },
  });

  const creatorMap = useMemo(() => {
    const map = new Map<
      string,
      { id: string; firstName?: string; lastName?: string; avatar?: string }
    >();
    const list =
      allCommunitiesData?.getCommunities?.data ||
      (Array.isArray(allCommunitiesData?.getCommunities)
        ? allCommunitiesData.getCommunities
        : []);
    list.forEach((c: any) => {
      if (c.creator?.id) {
        const fullName =
          `${c.creator.firstName || ""} ${c.creator.lastName || ""}`
            .trim()
            .toLowerCase();
        if (fullName) {
          map.set(fullName, {
            id: c.creator.id,
            firstName: c.creator.firstName,
            lastName: c.creator.lastName,
            avatar: c.creator.avatar,
          });
        }
      }
    });
    return map;
  }, [allCommunitiesData]);

  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title="Top Community Creators"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-muted/50 border border-border animate-pulse"
              />
            ))}
          </div>
        ) : topCreators.length === 0 ? (
          <p className="text-xs font-medium text-muted-foreground text-center py-6">
            No creators to display for this period.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topCreators.slice(0, 6).map((creator: TopCreator, idx: number) => {
              const matchedCreator = creatorMap.get(
                creator.name.trim().toLowerCase(),
              );
              const creatorId = creator.id || matchedCreator?.id;
              const profileHref = creatorId
                ? `/members/${creatorId}`
                : `/members/all?search=${encodeURIComponent(creator.name)}`;

              const userHoverData = {
                id: creatorId,
                firstName:
                  matchedCreator?.firstName ||
                  creator.name.split(" ")[0] ||
                  creator.name,
                lastName:
                  matchedCreator?.lastName ||
                  creator.name.split(" ").slice(1).join(" ") ||
                  "",
                avatar: creator.avatar || matchedCreator?.avatar,
              };

              const creatorContent = (
                <Link
                  href={profileHref}
                  className="flex items-center gap-3 min-w-0 flex-1 group/item"
                >
                  <div className="h-9 w-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden group-hover/item:border-indigo-400/60 transition-colors shrink-0">
                    {creator.avatar ? (
                      <img
                        src={getPreferredMediaUrl(creator.avatar)}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      creator.name.charAt(0)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate group-hover/item:text-indigo-600 transition-colors block">
                      {creator.name}
                    </span>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                      {creator.communitiesCreated} {moduleName}
                    </p>
                  </div>
                </Link>
              );

              return (
                <div
                  key={creator.id || `${creator.name}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-border hover:shadow-sm transition-all group"
                >
                  {creatorId ? (
                    <UserProfileHoverCard user={userHoverData}>
                      {creatorContent}
                    </UserProfileHoverCard>
                  ) : (
                    creatorContent
                  )}
                  <div className="text-xs font-bold text-muted-foreground group-hover:text-muted-foreground transition-colors ml-3 shrink-0">
                    #{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
