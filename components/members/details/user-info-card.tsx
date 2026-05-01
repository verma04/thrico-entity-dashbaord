"use client";

import React from "react";
import {
  Mail,
  MapPin,
  Calendar,
  Clock,
  User as UserIcon,
  Globe,
  MapIcon,
  Twitter,
  Linkedin,
  Github,
  Link as LinkIcon,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { safeFormatDistanceToNow, safeLocaleDateString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { useGetGamificationSummary } from "@/graphql/actions/gamification/gamification-quiries";
import { Trophy, Star, Hash, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "BLOCKED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "REJECTED":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "DISABLED":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
};

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "twitter":
      return <Twitter className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "github":
      return <Github className="h-4 w-4" />;
    default:
      return <LinkIcon className="h-4 w-4" />;
  }
};

export function UserInfoCard({ member }: { member: any }) {
  const user = member?.user;
  const { data: gamificationData, loading: gamificationLoading } =
    useGetGamificationSummary(user?.id, {
      skip: !user?.id,
    });
  const summary = gamificationData?.getUserGamificationSummary;

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/50 shadow-xl shadow-primary/5">
        <div className="h-40 relative overflow-hidden group/cover">
          {user.cover ? (
            <img
              src={`https://cdn.thrico.network/${user.cover}`}
              alt="Cover"
              className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/20 via-primary/10 to-transparent relative">
              <div className="absolute inset-0 bg-grid-white/10" />
            </div>
          )}
          {/* Online Indicator */}
          <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-background/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <div
              className={cn(
                "h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.4)]",
                member.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400",
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              {member.isOnline
                ? "Online Now"
                : member.lastActive
                  ? `Seen ${safeFormatDistanceToNow(member.lastActive, { addSuffix: true })}`
                  : "Offline"}
            </span>
          </div>
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center -mt-16 space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Avatar className="h-32 w-32 border-4 border-background shadow-2xl rounded-3xl">
                <AvatarImage
                  src={`https://cdn.thrico.network/${user.avatar}`}
                  alt={user.firstName}
                />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground font-bold text-sm uppercase tracking-wide">
                {user.profile?.headline ||
                  user.about?.headline ||
                  "Community Member"}
              </p>
              <Badge
                variant="outline"
                className={cn("font-black px-4", getStatusColor(member.status))}
              >
                {member.status}
              </Badge>
            </div>

            <div className="w-full pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm group/item">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-bold truncate">{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="font-bold">{user.location.name}</span>
                </div>
              )}

              {/* Social Links */}
              {user.about?.social && user.about.social.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {user.about.social.map((social: any, idx: number) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all hover:scale-110"
                      title={social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Summary Card */}
      <Card className="border-primary/20 bg-linear-to-br from-primary/5 via-background to-background relative overflow-hidden group shadow-lg shadow-primary/5">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
          <Trophy className="h-20 w-20 text-primary" />
        </div>
        <CardContent className="p-5 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/70">
              Community Impact
            </h4>
            {gamificationLoading ? (
              <Skeleton className="h-4 w-12" />
            ) : (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 font-black text-[9px] uppercase"
              >
                Rank #{summary?.rankPosition || "N/A"}
              </Badge>
            )}
          </div>

          <div className="flex items-end gap-3">
            <div className="text-3xl font-black text-primary leading-none">
              {gamificationLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                summary?.totalPointsEarned || 0
              )}
              <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-normal">
                XP
              </span>
            </div>

            {!gamificationLoading && summary?.currentStreak > 0 && (
              <div className="flex items-center gap-1 text-orange-500 font-black text-[10px] bg-orange-500/10 px-2 py-0.5 rounded-full mb-0.5">
                <Flame className="h-3 w-3 fill-current" />
                {summary.currentStreak}D STREAK
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center"
                >
                  <Star className="h-3 w-3 text-primary fill-current opacity-40" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {summary?.totalBadgesEarned || 0} Badges Earned
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 bg-muted/20">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Account Core
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-sm">
          <div className="divide-y divide-border/40">
            <div className="flex justify-between items-center p-4">
              <span className="text-muted-foreground font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Joined
              </span>
              <span className="font-black">
                {safeLocaleDateString(user.createdAt)}
              </span>
            </div>
            {user.profile?.DOB && (
              <div className="flex justify-between items-center p-4">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> DOB
                </span>
                <span className="font-semibold">
                  {safeLocaleDateString(user.profile.DOB)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center p-4">
              <span className="text-muted-foreground flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Gender
              </span>
              <span className="font-semibold">
                {user.profile?.gender || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between items-center p-4">
              <span className="text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" /> Language
              </span>
              <span className="font-semibold">
                {user.profile?.language || "English"}
              </span>
            </div>
            {member.industries && member.industries.length > 0 && (
              <div className="flex flex-col p-4 gap-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Industries
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {member.industries.map((industry: any) => (
                    <Badge
                      key={industry.id}
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 font-bold text-[10px] uppercase"
                    >
                      {industry.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {user.lastLoginAt && (
              <div className="flex justify-between items-center p-4">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapIcon className="h-4 w-4" /> Last Login
                </span>
                <span className="font-semibold">
                  {safeFormatDistanceToNow(user.lastLoginAt, {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      {user.profile?.skills && user.profile.skills.length > 0 && (
        <Card className="border-border/40 border-dashed bg-muted/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Expertise & Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user.profile.skills.map((skill: any, idx: number) => {
              const skillName =
                typeof skill === "object"
                  ? skill.name || "Unnamed Skill"
                  : String(skill);
              return (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="px-3 py-1 rounded-md text-[10px] font-black bg-muted/60 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                >
                  {String(skillName)}
                </Badge>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
