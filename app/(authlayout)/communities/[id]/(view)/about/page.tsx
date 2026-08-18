"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY_BY_ID } from "@/graphql/quries/group/approval";
import {
  Info,
  ShieldAlert,
  CalendarDays,
  Hash,
  UserCircle,
  Lock,
  Unlock,
  Type,
  MapPin,
  CheckCircle2,
  Users,
  Settings,
  Shield,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import moment from "moment";
import { useModuleStore } from "@/store/useModuleStore";

export default function CommunityAbout() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { input: { communityId: id } },
    skip: !id,
  });

  const community = data?.getCommunityById;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="bg-card border border-border/80 rounded-xl p-12 text-center max-w-lg mx-auto">
        <Info className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
        <h3 className="text-base font-semibold">{singularName} Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Failed to load community details. Please try again or return to the overview.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => router.push("/communities/all")}
        >
          Back to All Communities
        </Button>
      </div>
    );
  }

  const rules = community.rules || [];

  return (
    <div className="space-y-6">
      {/* Top Meta Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overview & Mission
            </span>
            <Badge
              variant={community.privacy === "PUBLIC" ? "default" : "secondary"}
              className="px-2 py-0 text-[10px] font-semibold uppercase tracking-wider rounded-md"
            >
              {community.privacy || "Public"}
            </Badge>
            <Badge variant="outline" className="px-2 py-0 text-[10px] font-medium text-muted-foreground">
              {community.communityType || "Virtual"}
            </Badge>
          </div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            {community.title || `${singularName} Details`}
          </h2>
          {community.tagline && (
            <p className="text-xs text-muted-foreground">{community.tagline}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/communities/${id}/settings`)}
            className="h-8 text-xs font-medium gap-1.5"
          >
            <Settings className="h-3.5 w-3.5" />
            Edit Info
          </Button>
        </div>
      </div>

      {/* 2-Column Shopify Layout (2/3 Main Content + 1/3 Sidebar Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ─── Left Column (2/3) ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission & Description Card */}
          <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Type className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Core Mission & Purpose</h3>
            </div>

            {community.description ? (
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line pl-3 border-l-2 border-primary/30">
                {community.description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No description provided for this community yet.
              </p>
            )}
          </div>

          {/* Community Guidelines & Rules Card */}
          <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-foreground">Community Guidelines</h3>
              </div>
              <Badge variant="secondary" className="text-[10px] font-semibold">
                {rules.length} Rules Active
              </Badge>
            </div>

            {rules.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rules.map((rule: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-3 rounded-lg border border-border/70 hover:border-border bg-background/50 transition-all"
                  >
                    <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-full shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {rule.title || `Rule #${index + 1}`}
                      </h4>
                      {rule.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                          {rule.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No explicit guidelines published yet. Standard community conduct applies.
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column (1/3 Specs & Author) ────────────────────────── */}
        <div className="space-y-6">
          {/* Quick Specifications Card */}
          <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h4 className="text-sm font-semibold text-foreground">Community Specs</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {community.privacy === "PUBLIC" ? (
                    <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  Privacy
                </span>
                <span className="font-semibold text-foreground">
                  {community.privacy === "PUBLIC" ? "Public" : "Private"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <UserCircle className="h-3.5 w-3.5 text-blue-500" />
                  Joining Terms
                </span>
                <span className="font-semibold text-foreground">
                  {community.joiningTerms === "OPEN" || community.joiningTerms === "ANYONE_CAN_JOIN"
                    ? "Open to All"
                    : "Invite / Request Only"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-purple-500" />
                  Categories
                </span>
                <span className="font-semibold text-foreground max-w-[150px] truncate text-right">
                  {community.categories && community.categories.length > 0
                    ? community.categories.join(", ")
                    : "General"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-sky-500" />
                  Location
                </span>
                <span className="font-semibold text-foreground truncate">
                  {community.location || "Global / Virtual"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                  Founded
                </span>
                <span className="font-semibold text-foreground">
                  {moment(Number(community.createdAt) || community.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-between h-8 text-muted-foreground hover:text-foreground"
                onClick={() => router.push(`/communities/${id}/members`)}
              >
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  View Members Roster
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-between h-8 text-muted-foreground hover:text-foreground"
                onClick={() => router.push(`/communities/${id}/rules`)}
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Manage Rules
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Creator / Host Card with UserProfileHoverCard */}
          {community.creator && (
            <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Community Host
              </h4>
              <UserProfileHoverCard user={community.creator}>
                <div className="flex items-center gap-3 p-2 rounded-lg border border-border/60 hover:bg-muted/30 transition-all cursor-pointer">
                  <Avatar className="h-9 w-9 rounded-lg border border-border/60">
                    <AvatarImage src={community.creator.avatar} />
                    <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                      {community.creator.firstName?.charAt(0) || "H"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {community.creator.firstName} {community.creator.lastName}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      Host & Admin
                    </span>
                  </div>
                </div>
              </UserProfileHoverCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
