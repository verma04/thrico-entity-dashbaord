"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  MapPin,
  Smartphone,
  Calendar,
  Briefcase,
  CheckCircle2,
  Trophy,
  Award,
  Heart,
  Wallet,
  Sparkles,
  Users,
} from "lucide-react";
import type { UserDetail } from "@/graphql/actions";
import UserActions from "./user-actions";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeFormat, safeFormatDistanceToNow } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface MemberCardCompactProps {
  member: UserDetail;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  ACTIVE: {
    label: "Active",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  DISABLED: {
    label: "Disabled",
    bg: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  BLOCKED: {
    label: "Blocked",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export function MemberCardCompact({ member }: MemberCardCompactProps) {
  const router = useRouter();
  const [coverError, setCoverError] = useState(false);

  const statusKey = member.status?.toUpperCase() || (member.isApproved ? "APPROVED" : "PENDING");
  const statusInfo = STATUS_CONFIG[statusKey] || {
    label: member.status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  const tier = member.membershipTier;
  const user = member.user || ({} as any);
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Member";
  const initials = `${firstName.charAt(0) || ""}${lastName.charAt(0) || ""}` || "M";

  const cover = (user as any).cover;
  const coverUrl =
    !coverError && cover
      ? cover.startsWith("http")
        ? cover
        : `https://cdn.thrico.network/${cover}`
      : null;

  const avatarUrl = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `https://cdn.thrico.network/${user.avatar}`
    : undefined;

  const phoneStr = user.profile?.phone?.phoneNumber
    ? `+${user.profile.phone.countryCode || ""}-${user.profile.phone.phoneNumber}`
    : null;

  const locationName =
    typeof user.location === "string"
      ? user.location
      : user.location?.name || "";

  const headline =
    user.about?.currentPosition ||
    user.about?.headline ||
    "Community Member";

  const totalPoints = member.gamificationSummary?.totalPointsEarned;
  const walletBalance = member.entityCurrencyWallet?.balance;
  const rankPosition = member.gamificationSummary?.rankPosition;
  const totalBadges = member.gamificationSummary?.totalBadgesEarned;
  const impactScore = member.impactScore;

  const hasMetrics =
    totalPoints !== undefined ||
    walletBalance !== undefined ||
    rankPosition !== undefined ||
    totalBadges !== undefined ||
    impactScore !== undefined;

  return (
    <div
      onClick={() => router.push(`/members/${member.id}`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Top tier/status accent color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{
          backgroundColor:
            tier?.badgeColor ||
            (statusKey === "APPROVED" || statusKey === "ACTIVE"
              ? "#10b981"
              : statusKey === "PENDING"
                ? "#f59e0b"
                : statusKey === "BLOCKED" || statusKey === "REJECTED"
                  ? "#f43f5e"
                  : "#6366f1"),
        }}
      />

      {/* ── Top Cover & Header Area ───────────────────────────────────── */}
      <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-muted">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`${fullName} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-purple-600/15 group-hover:from-blue-600/25 group-hover:to-purple-600/25 transition-colors flex items-center justify-end pr-4">
            <span className="text-3xl font-black text-primary/10 tracking-tight select-none">
              {initials}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Floating Tier or Source Badge (Top-Left) */}
        <div className="absolute top-2 left-2.5 z-10 flex items-center gap-1.5">
          {tier ? (
            <div
              className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-xs flex items-center gap-1"
              style={{
                backgroundColor: `${tier.badgeColor}25`,
                color: tier.badgeColor,
                borderColor: `${tier.badgeColor}40`,
              }}
            >
              {tier.badgeIcon && <span className="text-[10px]">{tier.badgeIcon}</span>}
              <span>{tier.name}</span>
            </div>
          ) : user.loginType ? (
            <div className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider backdrop-blur-md bg-card/90 border border-border/50 text-muted-foreground shadow-xs">
              {user.loginType}
            </div>
          ) : null}
        </div>

        {/* Action dropdown (Top-Right) */}
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-background/80 hover:bg-background backdrop-blur-md rounded-md shadow-xs transition-colors">
            <UserActions user={member} />
          </div>
        </div>

        {/* Avatar positioned in bottom-left */}
        <div className="absolute bottom-2 left-3 z-10 flex items-end gap-2.5">
          <UserProfileHoverCard user={user}>
            <div
              className="relative group/avatar"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/members/${member.id}`);
              }}
            >
              <Avatar className="h-11 w-11 rounded-xl border-2 border-background shadow-md group-hover/avatar:scale-105 transition-transform bg-background">
                <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {(member.lastSession?.isActive || (user as any).isOnline) && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse"
                  title="Active now"
                />
              )}
            </div>
          </UserProfileHoverCard>
        </div>

        {/* Floating Status & Verification pills (Bottom-Right) */}
        <div className="absolute bottom-2 right-2.5 flex items-center gap-1.5 pointer-events-none z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-md bg-black/60 text-white border border-white/15 shadow-2xs",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)} />
            {statusInfo.label}
          </span>

          {member.verification?.isVerified && (
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold backdrop-blur-md bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-2xs"
              title="Verified Member"
            >
              <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-blue-400" />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 pt-2.5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Name & Headline */}
          <div>
            <UserProfileHoverCard user={user}>
              <h3
                className="text-xs sm:text-sm font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors cursor-pointer"
                title={fullName}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/members/${member.id}`);
                }}
              >
                {fullName}
              </h3>
            </UserProfileHoverCard>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 truncate">
              <Briefcase className="h-3 w-3 shrink-0 text-muted-foreground/70" />
              <span className="truncate">{headline}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-1 pt-1 border-t border-border/40 text-[11px]">
            {user.email && (
              <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                <Mail className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                <span className="truncate select-all" title={user.email}>
                  {user.email}
                </span>
              </div>
            )}

            {phoneStr && (
              <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                <Smartphone className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                <span className="truncate select-all">{phoneStr}</span>
              </div>
            )}

            {locationName && (
              <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                <span className="truncate">{locationName}</span>
              </div>
            )}
          </div>

          {/* Industries Tags */}
          {(member as any).industries && (member as any).industries.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {(member as any).industries.slice(0, 2).map((ind: any) => (
                <span
                  key={ind.id || ind.title}
                  className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 truncate max-w-[120px]"
                >
                  {ind.title}
                </span>
              ))}
              {(member as any).industries.length > 2 && (
                <span className="px-1 py-0.5 rounded text-[9px] font-bold text-muted-foreground bg-muted/60">
                  +{(member as any).industries.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Referrer & Last Session Info */}
          <div className="space-y-1 pt-1 text-[10px] text-muted-foreground border-t border-border/30">
            {/* Referrer */}
            <div className="flex items-center justify-between gap-1">
              <span className="text-muted-foreground/70">Referred by:</span>
              {(member as any).referrer?.user ? (
                <UserProfileHoverCard user={(member as any).referrer.user}>
                  <div
                    className="flex items-center gap-1 text-foreground/90 font-medium hover:text-primary transition-colors cursor-pointer truncate max-w-[130px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar className="h-3.5 w-3.5 rounded-full shrink-0">
                      <AvatarImage
                        src={
                          (member as any).referrer.user.avatar
                            ? (member as any).referrer.user.avatar.startsWith("http")
                              ? (member as any).referrer.user.avatar
                              : `https://cdn.thrico.network/${(member as any).referrer.user.avatar}`
                            : undefined
                        }
                      />
                      <AvatarFallback className="text-[7px]">
                        {(member as any).referrer.user.firstName?.charAt(0) || "R"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">
                      {(member as any).referrer.user.firstName}{" "}
                      {(member as any).referrer.user.lastName}
                    </span>
                  </div>
                </UserProfileHoverCard>
              ) : (
                <span className="font-medium text-muted-foreground/80 bg-muted/50 px-1 rounded">
                  Direct Join
                </span>
              )}
            </div>

            {/* Last Active Session */}
            {member.lastSession && (
              <div className="flex items-center justify-between gap-1 text-muted-foreground/80">
                <span className="text-muted-foreground/70 flex items-center gap-1">
                  <Smartphone className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate max-w-[80px]">
                    {member.lastSession.deviceName || "Device"}
                  </span>
                </span>
                <span className="text-[9px] truncate">
                  {safeFormatDistanceToNow(member.lastSession.lastUsed, {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Gamification & Value Metrics Strip */}
          {hasMetrics && (
            <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-border/30">
              <div
                className="bg-muted/40 hover:bg-muted/60 p-1 rounded-md text-center border border-border/40 transition-colors"
                title="Points Earned"
              >
                <div className="flex items-center justify-center gap-0.5 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span className="text-[8px] uppercase font-bold tracking-tight">
                    Pts
                  </span>
                </div>
                <div className="text-[11px] font-bold text-foreground">
                  {totalPoints !== undefined ? totalPoints.toLocaleString() : "0"}
                </div>
              </div>

              <div
                className="bg-muted/40 hover:bg-muted/60 p-1 rounded-md text-center border border-border/40 transition-colors"
                title="Wallet Balance"
              >
                <div className="flex items-center justify-center gap-0.5 text-amber-600 dark:text-amber-400">
                  <Wallet className="h-2.5 w-2.5" />
                  <span className="text-[8px] uppercase font-bold tracking-tight">
                    Coins
                  </span>
                </div>
                <div className="text-[11px] font-bold text-foreground">
                  {walletBalance !== undefined
                    ? parseFloat(String(walletBalance)).toLocaleString()
                    : "0"}
                </div>
              </div>

              <div
                className="bg-muted/40 hover:bg-muted/60 p-1 rounded-md text-center border border-border/40 transition-colors"
                title="Rank / Badges"
              >
                <div className="flex items-center justify-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                  <Trophy className="h-2.5 w-2.5" />
                  <span className="text-[8px] uppercase font-bold tracking-tight">
                    Rank
                  </span>
                </div>
                <div className="text-[11px] font-bold text-foreground">
                  {rankPosition ? `#${rankPosition}` : "—"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1 text-muted-foreground/80">
            <Calendar className="h-3 w-3 text-muted-foreground/60 shrink-0" />
            <span>
              Joined {safeFormat(user.createdAt, "MMM d, yyyy", "Recently")}
            </span>
          </div>

          {impactScore !== undefined && impactScore > 0 && (
            <div
              className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-semibold"
              title="Impact Score"
            >
              <Heart className="h-2.5 w-2.5 fill-rose-500/20" />
              <span>{impactScore.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberCardCompact;
