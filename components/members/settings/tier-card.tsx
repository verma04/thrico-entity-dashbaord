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
    <div className="border border-border/50 bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">
      {/* Color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between border-b border-border/50 pb-3 mb-3 mt-1">
        <div className="flex gap-2.5 min-w-0">
          {tier.badgeIcon ? (
            <img
              src={
                tier.badgeIcon.startsWith("http")
                  ? tier.badgeIcon
                  : `https://cdn.thrico.network/${tier.badgeIcon}`
              }
              alt={tier.name}
              className="w-8 h-8 rounded-lg object-cover border border-border/60 shrink-0"
            />
          ) : (
            <div
              className="p-2 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}15`, color: color }}
            >
              <Award className="h-4 w-4" style={{ color }} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3
                className="text-sm font-semibold text-foreground truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors"
                title={tier.name}
              >
                {tier.name}
              </h3>
              {tier.isDefault && (
                <Badge
                  variant="outline"
                  className="text-[9px] py-0 px-1 h-3.5 font-semibold text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                >
                  Default
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
              <Users className="h-3 w-3" />
              <span>
                {loading ? (
                  <Skeleton className="h-3 w-12 inline-block" />
                ) : (
                  `${totalCount} ${totalCount === 1 ? "Member" : "Members"}`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
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
                className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
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
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        {/* Description / Perks if available */}
        {(tier.description || benefitsList.length > 0) && (
          <div className="space-y-2">
            {tier.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {tier.description}
              </p>
            )}

            {benefitsList.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {benefitsList.slice(0, 2).map((benefit, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium px-1.5 py-0.5 truncate max-w-[180px]"
                  >
                    <Sparkles className="h-2.5 w-2.5 mr-1 text-amber-500 shrink-0" />
                    {benefit}
                  </Badge>
                ))}
                {benefitsList.length > 2 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium px-1.5 py-0.5"
                  >
                    +{benefitsList.length - 2} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Members section matching ClassificationCard */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Members
            </p>
            {totalCount > 0 && onViewMembers && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMembers();
                }}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                View all ({totalCount})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {loading ? (
              <div className="flex gap-1.5">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>
            ) : memberRows.length === 0 ? (
              <p className="text-xs text-muted-foreground/70 italic">
                No members yet.
              </p>
            ) : (
              <>
                {memberRows.slice(0, 8).map((row: any) => {
                  const u = row.user || {};
                  const name =
                    [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                    "User";
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
                        className="h-7 w-7 border-2 border-background shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                        title={`${name} ${u.headline ? `- ${u.headline}` : ""}`}
                      >
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback
                          className="text-[10px] font-medium"
                          style={{
                            backgroundColor: `${color}15`,
                            color: color,
                          }}
                        >
                          {u.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </UserProfileHoverCard>
                  );
                })}
                {totalCount > 8 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewMembers?.();
                    }}
                    className="h-7 w-7 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-background flex items-center justify-center text-[10px] font-medium text-slate-600 dark:text-zinc-400 shadow-sm hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    +{totalCount - 8}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TierSkeletonGrid({
  count = 8,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="border border-border/50 bg-card rounded-xl p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-2.5 w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-1/2" />
            <div className="flex gap-1.5">
              {[...Array(4)].map((_, j) => (
                <Skeleton
                  key={j}
                  className="h-7 w-7 rounded-full border-2 border-background"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
