"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Users, Eye, Search } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { getCommunities } from "@/graphql/actions/group";
import type { TopCommunity } from "@/graphql/actions/communities";
import { Card } from "@/components/ui/card";

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border">
    <div className="flex flex-col items-center gap-4 text-center px-6">
      <div className="h-6 w-6 border-2 border-border border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-medium text-muted-foreground">Getting info...</p>
    </div>
  </div>
);

const EmptyChart = ({ message }: { message: string }) => (
  <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border">
    <div className="flex flex-col items-center gap-2">
      <Search size={20} className="text-zinc-200" />
      <p className="text-xs font-medium text-muted-foreground text-center px-6">
        {message}
      </p>
    </div>
  </div>
);

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
    list.forEach((c: any) => {
      if (c.title && c.id) {
        map.set(c.title.trim().toLowerCase(), c.id);
      }
    });
    return map;
  }, [allCommunitiesData]);

  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title={`Top 10 ${moduleName || "Communities"}`}
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="w-full overflow-x-auto">
        <Card className="rounded-[20px] border border-border bg-card p-5 min-w-[500px] shadow-sm">
          {loading ? (
            <div className="h-72">
              <ChartSkeleton />
            </div>
          ) : topCommunities.length === 0 ? (
            <div className="h-72">
              <EmptyChart message="No info to show for this time." />
            </div>
          ) : (
            <div className="space-y-1">
              {topCommunities
                .slice(0, 10)
                .map((community: TopCommunity, idx: number) => {
                  const maxMembers = topCommunities[0]?.members || 1;
                  const barWidth = Math.round(
                    (community.members / maxMembers) * 100,
                  );

                  const communityId =
                    community.id ||
                    communityMap.get(community.name.trim().toLowerCase());
                  const communityHref = communityId
                    ? `/communities/${communityId}/about`
                    : `/communities/all?search=${encodeURIComponent(community.name)}`;

                  return (
                    <div
                      key={community.name}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <Link
                        href={communityHref}
                        className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors shrink-0"
                      >
                        {idx + 1}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <Link
                            href={communityHref}
                            className="text-sm font-semibold text-foreground truncate hover:text-indigo-600 hover:underline transition-colors"
                          >
                            {community.name}
                          </Link>
                          <div className="flex items-center gap-4 text-muted-foreground shrink-0 ml-2">
                            <span className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
                              <Users
                                size={12}
                                className="text-muted-foreground"
                              />
                              {community.members.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-medium tabular-nums px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              <Eye size={10} />
                              {community.views.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
