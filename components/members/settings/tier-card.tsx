"use client";

import React from "react";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Users, Pencil, Trash2, ShieldCheck, Sparkles, UserPlus, ChevronRight } from "lucide-react";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export interface TierCardProps {
  tier: {
    id: string;
    name: string;
    description?: string | null;
    badgeIcon?: string | null;
    badgeColor?: string | null;
    benefits?: string[] | null;
    isDefault?: boolean | null;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onViewMembers?: () => void;
}

export function TierCard({
  tier,
  onEdit,
  onDelete,
  onViewMembers,
}: TierCardProps) {
  const { data, loading } = useGetAllUser({
    status: "ALL",
    limit: 8,
    offset: 0,
    membershipTierId: tier.id,
  });

  const memberRows = data?.getAllUser?.data || [];
  const totalCount = data?.getAllUser?.totalCount || 0;
  const color = tier.badgeColor || "#6366f1";

  // Parse privileges / benefits
  const benefitsList: string[] = React.useMemo(() => {
    if (!tier.benefits || tier.benefits.length === 0) return [];
    if (tier.benefits.length === 1 && tier.benefits[0]?.includes("<")) {
      // Strip HTML tags for clean badge preview if needed
      const stripped = tier.benefits[0].replace(/<[^>]*>?/gm, "").trim();
      return stripped ? [stripped] : ["Custom Perks"];
    }
    return tier.benefits;
  }, [tier.benefits]);

  return (
    <div className="border border-border/60 bg-card rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
      {/* Top accent color bar */}
      <div
        className="absolute top-0 left-0 h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />

      {/* Card Header */}
      <div className="flex items-start justify-between border-b border-border/50 pb-3.5 mb-3.5 mt-1">
        <div className="flex gap-3 min-w-0">
          {tier.badgeIcon ? (
            <img
              src={
                tier.badgeIcon.startsWith("http")
                  ? tier.badgeIcon
                  : `https://cdn.thrico.network/${tier.badgeIcon}`
              }
              alt={tier.name}
              className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0 shadow-2xs"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${color}18`,
                borderColor: `${color}30`,
                color: color,
              }}
            >
              <Award className="h-5 w-5" style={{ color }} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3
                className="text-sm font-bold text-foreground truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors"
                title={tier.name}
              >
                {tier.name}
              </h3>
              {tier.isDefault && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 h-4 font-semibold text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                >
                  Default
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5 font-medium">
              <Users className="h-3 w-3 text-muted-foreground/80" />
              <span>
                {loading ? (
                  <Skeleton className="h-3 w-14 inline-block" />
                ) : (
                  `${totalCount} ${totalCount === 1 ? "Member" : "Members"}`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons (always visible / hover highlighted) */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit Tier"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete Tier"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-between space-y-3.5">
        {/* Description */}
        {tier.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tier.description}
          </p>
        )}

        {/* Benefits / Privileges preview */}
        {benefitsList.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Privileges & Perks
            </p>
            <div className="flex flex-wrap gap-1">
              {benefitsList.slice(0, 3).map((benefit, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-[10px] bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-medium px-2 py-0.5 border border-zinc-200/50 dark:border-zinc-700/50 truncate max-w-[200px]"
                >
                  <Sparkles className="h-2.5 w-2.5 mr-1 text-amber-500 shrink-0" />
                  {benefit}
                </Badge>
              ))}
              {benefitsList.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium px-1.5 py-0.5"
                >
                  +{benefitsList.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Members Avatar Stack */}
        <div className="pt-2 border-t border-border/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Assigned Members
            </span>
            {totalCount > 0 && (
              <button
                type="button"
                onClick={onViewMembers}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                View all ({totalCount})
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 min-h-[32px]">
            {loading ? (
              <div className="flex gap-1.5">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>
            ) : memberRows.length === 0 ? (
              <p className="text-xs text-muted-foreground/70 italic py-1">
                No members assigned to this tier yet.
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                {memberRows.slice(0, 7).map((row: any) => {
                  const u = row.user || {};
                  const name =
                    [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                    "Member";
                  const avatarUrl = u.avatar
                    ? `https://cdn.thrico.network/${u.avatar}`
                    : "";

                  return (
                    <UserProfileHoverCard
                      key={row.id}
                      user={{
                        id: u.globalUserId || row.id,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        avatar: u.avatar,
                        headline: u.headline,
                      }}
                    >
                      <Avatar
                        className="h-7 w-7 border-2 border-background shadow-xs hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                        title={`${name} ${u.headline ? `- ${u.headline}` : ""}`}
                      >
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback
                          className="text-[10px] font-bold"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                          }}
                        >
                          {u.firstName?.charAt(0) || "M"}
                        </AvatarFallback>
                      </Avatar>
                    </UserProfileHoverCard>
                  );
                })}
                {totalCount > 7 && (
                  <button
                    type="button"
                    onClick={onViewMembers}
                    className="h-7 px-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-background flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400 shadow-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    +{totalCount - 7}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer Button */}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onViewMembers}
            className="w-full h-8 text-xs font-semibold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 justify-between group/btn"
          >
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              Manage Tier Members
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TierSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border border-border/60 bg-card rounded-2xl p-5 shadow-xs flex flex-col space-y-4"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-8 w-full" />
          <div className="flex gap-1.5">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-1 pt-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
