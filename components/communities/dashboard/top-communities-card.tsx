"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Users, Eye, Search, Layers } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { getCommunities } from "@/graphql/actions/group";
import type { TopCommunity } from "@/graphql/actions/communities";
import { Card, CardContent } from "@/components/ui/card";

interface TopCommunitiesCardProps {
  loading: boolean;
  moduleName: string;
  topCommunities: TopCommunity[];
}

export function TopCommunitiesCard({
  loading,
  moduleName,
  topCommunities,
}: TopCommunitiesCardProps) {
  const { data: allCommunitiesData } = getCommunities({
    variables: {
      input: {
        status: "ALL",
      },
    },
  });

  const communityMap = useMemo(() => {
    const map = new Map<string, string>();
    const list =
      allCommunitiesData?.getCommunities?.data ||
      (Array.isArray(allCommunitiesData?.getCommunities)
        ? allCommunitiesData.getCommunities
        : []);
    list.forEach((c: { title?: string; id?: string }) => {
      if (c.title && c.id) {
        map.set(c.title.trim().toLowerCase(), c.id);
      }
    });
    return map;
  }, [allCommunitiesData]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading
        title={`Top ${moduleName || "Communities"}`}
        icon={<Layers className="h-3.5 w-3.5 text-muted-foreground" />}
        rightElement={
          <Link href="/communities/all">
            <span className="text-xs text-primary font-medium hover:underline cursor-pointer">
              View all
            </span>
          </Link>
        }
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg bg-muted/50 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : topCommunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-xs font-medium">No community data to show for this period.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {topCommunities
                .slice(0, 7)
                .map((community: TopCommunity, idx: number) => {
                  const maxMembers = topCommunities[0]?.members || 1;
                  const barWidth = Math.round(
                    (community.members / maxMembers) * 100
                  );

                  const communityId =
                    community.id ||
                    communityMap.get(community.name.trim().toLowerCase());
                  const communityHref = communityId
                    ? `/communities/${communityId}/about`
                    : `/communities/all?search=${encodeURIComponent(community.name)}`;

                  return (
                    <div
                      key={community.id || `${community.name}-${idx}`}
                      className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/40 transition-colors"
                    >
                      <Link
                        href={communityHref}
                        className="w-7 h-7 rounded-lg bg-muted/60 border border-border flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors shrink-0 mr-3"
                      >
                        {idx + 1}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <Link
                            href={communityHref}
                            className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors"
                          >
                            {community.name}
                          </Link>
                          <div className="flex items-center gap-3 text-muted-foreground shrink-0 ml-2">
                            <span className="flex items-center gap-1 text-[11px] font-medium tabular-nums text-foreground/80">
                              <Users size={11} className="text-indigo-500" />
                              {community.members.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                              <Eye size={10} />
                              {community.views.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
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
