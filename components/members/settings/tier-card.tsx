"use client";

import React from "react";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Users, Pencil, Trash2, Sparkles } from "lucide-react";
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
  const color = tier.badgeColor || "#303030";

  // Parse privileges / benefits
  const benefitsList: string[] = React.useMemo(() => {
    if (!tier.benefits || tier.benefits.length === 0) return [];
    if (tier.benefits.length === 1 && tier.benefits[0]?.includes("<")) {
      const stripped = tier.benefits[0].replace(/<[^>]*>?/gm, "").trim();
      return stripped ? [stripped] : ["Custom Perks"];
    }
    return tier.benefits;
  }, [tier.benefits]);

  return (
    <div className="border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[8px] p-3 shadow-2xs hover:shadow-xs transition-shadow flex flex-col group relative overflow-hidden">
      {/* Color bar */}
      <div
        className="absolute top-0 left-0 h-[3px] w-full opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#e1e3e5] dark:border-zinc-800 pb-2.5 mb-2.5 mt-0.5">
        <div className="flex gap-2 min-w-0">
          {tier.badgeIcon ? (
            <img
              src={
                tier.badgeIcon.startsWith("http")
                  ? tier.badgeIcon
                  : `https://cdn.thrico.network/${tier.badgeIcon}`
              }
              alt={tier.name}
              className="w-7 h-7 rounded-[4px] object-cover border border-[#d2d5d9] dark:border-zinc-700 shrink-0"
            />
          ) : (
            <div
              className="w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 border border-[#d2d5d9] dark:border-zinc-700"
              style={{ backgroundColor: `${color}15`, color: color }}
            >
              <Award className="h-3.5 w-3.5" style={{ color }} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3
                className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 truncate"
                title={tier.name}
              >
                {tier.name}
              </h3>
              {tier.isDefault && (
                <Badge
                  variant="outline"
                  className="text-[9px] py-0 px-1 h-3.5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 rounded-[3px]"
                >
                  Default
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
              <Users className="h-3 w-3" />
              <span>
                {loading ? (
                  <Skeleton className="h-2.5 w-10 inline-block" />
                ) : (
                  `${totalCount} ${totalCount === 1 ? "Member" : "Members"}`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[#616161] hover:text-[#303030] hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 rounded-[4px] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                title="Edit Tier"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[#616161] hover:text-[#d72c0d] hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-[4px] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Delete Tier"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-between space-y-2.5">
        {/* Description / Perks if available */}
        {(tier.description || benefitsList.length > 0) && (
          <div className="space-y-1.5">
            {tier.description && (
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 line-clamp-2 leading-[15px]">
                {tier.description}
              </p>
            )}

            {benefitsList.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {benefitsList.slice(0, 2).map((benefit, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-[9.5px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 text-[#303030] dark:text-zinc-300 font-medium px-1.5 py-0.5 truncate max-w-[160px] rounded-[3px]"
                  >
                    <Sparkles className="h-2.5 w-2.5 mr-1 text-amber-500 shrink-0" />
                    {benefit}
                  </Badge>
                ))}
                {benefitsList.length > 2 && (
                  <Badge
                    variant="secondary"
                    className="text-[9.5px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-400 font-medium px-1.5 py-0.5 rounded-[3px]"
                  >
                    +{benefitsList.length - 2} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Members section */}
        <div className="space-y-1 pt-1.5 border-t border-[#e1e3e5] dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-[#616161] uppercase tracking-wider">
              Members
            </p>
            {totalCount > 0 && onViewMembers && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMembers();
                }}
                className="text-[10.5px] font-semibold text-[#005bd3] hover:underline cursor-pointer"
              >
                View all ({totalCount})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {loading ? (
              <div className="flex gap-1">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ) : memberRows.length === 0 ? (
              <p className="text-[11px] text-[#8c9196] italic">
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
                        className="h-6 w-6 border border-white dark:border-zinc-800 shadow-2xs hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                        title={`${name} ${u.headline ? `- ${u.headline}` : ""}`}
                      >
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback
                          className="text-[9px] font-medium"
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
                    className="h-6 w-6 rounded-full bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center text-[9.5px] font-medium text-[#616161] shadow-2xs hover:bg-[#e1e3e5] dark:hover:bg-zinc-700 transition-colors cursor-pointer"
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
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[8px] p-3 shadow-2xs space-y-2.5"
        >
          <div className="flex items-center gap-2 border-b border-[#e1e3e5] dark:border-zinc-800 pb-2">
            <Skeleton className="h-7 w-7 rounded-[4px]" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/4" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-2 w-1/2" />
            <div className="flex gap-1">
              {[...Array(4)].map((_, j) => (
                <Skeleton
                  key={j}
                  className="h-6 w-6 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
