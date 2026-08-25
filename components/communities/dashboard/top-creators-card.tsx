"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles, Users } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { getCommunities } from "@/graphql/actions/group";
import type { TopCreator } from "@/graphql/actions/communities";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    list.forEach(
      (c: {
        creator?: {
          id?: string;
          firstName?: string;
          lastName?: string;
          avatar?: string;
        };
      }) => {
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
      }
    );
    return map;
  }, [allCommunitiesData]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading
        title="Top Community Creators"
        icon={<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />}
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-muted/50 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : topCreators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Users className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-xs font-medium">No creator stats available for this period.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {topCreators.slice(0, 6).map((creator: TopCreator, idx: number) => {
                const matchedCreator = creatorMap.get(
                  creator.name.trim().toLowerCase()
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
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <Avatar className="h-8 w-8 border border-border shrink-0">
                      <AvatarImage
                        src={getPreferredMediaUrl(creator.avatar)}
                        alt={creator.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium uppercase">
                        {creator.name?.substring(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors block">
                        {creator.name}
                      </span>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {creator.communitiesCreated} {moduleName || "communities"} created
                      </p>
                    </div>
                  </Link>
                );

                return (
                  <div
                    key={creator.id || `${creator.name}-${idx}`}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xs transition-all"
                  >
                    {creatorId ? (
                      <UserProfileHoverCard user={userHoverData}>
                        {creatorContent}
                      </UserProfileHoverCard>
                    ) : (
                      creatorContent
                    )}
                    <span className="text-[10px] font-bold text-muted-foreground px-1.5 py-0.5 rounded-md bg-muted ml-2 shrink-0">
                      #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
