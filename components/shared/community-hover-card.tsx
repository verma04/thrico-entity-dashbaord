"use client";

import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  MessageSquare,
  Globe,
  Lock,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import moment from "moment";
import { useLazyGetCommunityById } from "@/graphql/actions/group";
import { getMediaUrl } from "@/utils/utils";

interface CommunityHoverCardProps {
  communityId?: string;
  initialData?: {
    id?: string;
    title?: string;
    cover?: string;
    slug?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    isApproved?: boolean;
    status?: string;
    privacy?: string;
    numberOfUser?: number;
    numberOfPost?: number;
    creator?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    } | null;
  } | null;
  children: React.ReactNode;
}

export function CommunityHoverCard({
  communityId,
  initialData,
  children,
}: CommunityHoverCardProps) {
  const [fetchCommunity, { data, loading, error }] = useLazyGetCommunityById();

  const handleOpenChange = (open: boolean) => {
    if (open && !data && !loading && communityId) {
      fetchCommunity({
        variables: {
          input: {
            communityId,
          },
        },
      });
    }
  };

  const community = data?.getCommunityById || initialData;
  const isApproved = community?.isApproved || community?.status === "APPROVED";
  const isPublic =
    (community?.privacy || "PUBLIC").toUpperCase() === "PUBLIC";

  const coverUrl = community?.cover
    ? community.cover.startsWith("http")
      ? community.cover
      : getMediaUrl(community.cover) || `https://cdn.thrico.network/${community.cover}`
    : null;

  const creator = community?.creator;
  const creatorName = creator
    ? `${creator.firstName || ""} ${creator.lastName || ""}`.trim()
    : null;

  const creatorAvatar = creator?.avatar
    ? creator.avatar.startsWith("http")
      ? creator.avatar
      : getMediaUrl(creator.avatar) || `https://cdn.thrico.network/${creator.avatar}`
    : null;

  const fallbackInitial = community?.title
    ? community.title.charAt(0).toUpperCase()
    : "C";

  return (
    <HoverCard openDelay={200} closeDelay={150} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <span className="inline-flex cursor-pointer">{children}</span>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 overflow-hidden z-50 rounded-xl border border-border/70 shadow-lg bg-card text-card-foreground"
        align="start"
        sideOffset={6}
      >
        {loading && !community ? (
          <div className="flex flex-col">
            <Skeleton className="h-20 w-full rounded-none" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-12 w-12 rounded-xl -mt-8 relative z-10 border-2 border-background" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <div className="pt-2 flex gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ) : error && !community ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            Failed to load community details.
          </div>
        ) : community ? (
          <div className="flex flex-col">
            {/* Header Banner */}
            <div className="relative h-20 w-full bg-muted overflow-hidden">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={community.title || "Community"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                {isApproved && (
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-xs border-0 gap-1 shadow-xs"
                  >
                    <ShieldCheck className="h-3 w-3" /> Approved
                  </Badge>
                )}
              </div>
            </div>

            {/* Community Info Body */}
            <div className="p-4 pt-0">
              <div className="flex justify-between items-end -mt-6 relative z-10 mb-2">
                <div className="h-12 w-12 rounded-xl border-2 border-background bg-card shadow-sm flex items-center justify-center font-bold text-sm text-primary overflow-hidden shrink-0">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={community.title || "Logo"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    fallbackInitial
                  )}
                </div>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-[11px] font-medium gap-1 rounded-md"
                >
                  <Link
                    href={`/communities/${community.id || communityId}/discussion`}
                  >
                    View <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground leading-tight tracking-tight line-clamp-1">
                  {community.title}
                </h4>
                {community.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {community.description}
                  </p>
                )}
              </div>

              {/* Stats Bar */}
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1 font-medium">
                  <Users className="h-3.5 w-3.5 text-primary/70" />
                  <span>{community.numberOfUser ?? 0} members</span>
                </div>
                {community.numberOfPost !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/70" />
                    <span>{community.numberOfPost} posts</span>
                  </div>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  {isPublic ? (
                    <Globe className="h-3.5 w-3.5 text-muted-foreground/70" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/70" />
                  )}
                  <span className="capitalize">{isPublic ? "Public" : "Private"}</span>
                </div>
              </div>

              {/* Creator & Creation Date Footer */}
              {(creatorName || community.createdAt) && (
                <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                  {creatorName && (
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Avatar className="h-4 w-4 shrink-0 border border-border">
                        <AvatarImage src={creatorAvatar || ""} />
                        <AvatarFallback className="text-[8px]">
                          {creatorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">
                        by <span className="font-medium text-foreground">{creatorName}</span>
                      </span>
                    </div>
                  )}
                  {community.createdAt && (
                    <div className="flex items-center gap-1 shrink-0 ml-auto">
                      <Calendar className="h-3 w-3 text-muted-foreground/60" />
                      <span>{moment(community.createdAt).format("MMM YYYY")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}
