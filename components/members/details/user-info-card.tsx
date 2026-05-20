"use client";

import React from "react";
import {
  Mail,
  MapPin,
  Calendar,
  Clock,
  User as UserIcon,
  Globe,
  Briefcase,
  Twitter,
  Linkedin,
  Github,
  Link as LinkIcon,
  Network,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  safeFormatDistanceToNow,
  safeLocaleDateString,
} from "@/lib/date-utils";
import { cn } from "@/lib/utils";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const STATUS_STYLE: Record<string, string> = {
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  BLOCKED: "bg-red-50 text-red-600 border-red-200",
  REJECTED: "bg-slate-50 text-slate-500 border-slate-200",
  DISABLED: "bg-orange-50 text-orange-600 border-orange-200",
};

function getStatusStyle(status: string) {
  return STATUS_STYLE[status] ?? "bg-slate-50 text-slate-600 border-slate-200";
}

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
};

function SocialIcon({ platform }: { platform: string }) {
  const Icon = SOCIAL_ICONS[platform.toLowerCase()] ?? LinkIcon;
  return <Icon className="h-4 w-4" />;
}

/* ── Info Row ─────────────────────────────────────────────────────────────── */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center py-2.5 px-3">
      <span className="text-muted-foreground text-sm flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export function UserInfoCard({ member }: { member: any }) {
  const user = member?.user;
  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <Card className="overflow-hidden border-border">
        {/* Cover */}
        <div className="h-28 relative">
          {user.cover ? (
            <img
              src={`https://cdn.thrico.network/${user.cover}`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/15 via-primary/5 to-muted" />
          )}
        </div>

        <CardContent className="relative px-5 pb-5">
          {/* Avatar */}
          <div className="flex flex-col items-center -mt-12 space-y-3">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md rounded-full">
              <AvatarImage
                src={`https://cdn.thrico.network/${user.avatar}`}
                alt={user.firstName}
              />
              <AvatarFallback className="text-lg font-semibold bg-muted text-muted-foreground">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">
                {user.profile?.headline ||
                  user.about?.headline ||
                  "Community Member"}
              </p>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-medium mt-1",
                  getStatusStyle(member.status),
                )}
              >
                {member.status}
              </Badge>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground py-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.location && (
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground py-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{user.location.name}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {user.about?.social && user.about.social.length > 0 && (
            <div className="flex gap-1.5 mt-3 pt-3 border-t border-border">
              {user.about.social.map((social: any, idx: number) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={social.platform}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 pb-2">
          <div className="divide-y divide-border/50">
            <InfoRow
              icon={Calendar}
              label="Joined"
              value={safeLocaleDateString(user.createdAt)}
            />
            <InfoRow
              icon={UserIcon}
              label="Member Since"
              value={safeFormatDistanceToNow(user.createdAt, {
                addSuffix: true,
              })}
            />
            <InfoRow
              icon={Network}
              label="Referred By"
              value={
                member.referrer?.user
                  ? `${member.referrer.user.firstName} ${member.referrer.user.lastName}`
                  : "Direct Join"
              }
            />
            {user.profile?.DOB && (
              <InfoRow
                icon={Clock}
                label="DOB"
                value={safeLocaleDateString(user.profile.DOB)}
              />
            )}
            <InfoRow
              icon={UserIcon}
              label="Gender"
              value={user.profile?.gender || "Not specified"}
            />
            <InfoRow
              icon={Globe}
              label="Language"
              value={user.profile?.language || "English"}
            />
            {user.lastLoginAt && (
              <InfoRow
                icon={Clock}
                label="Last Login"
                value={safeFormatDistanceToNow(user.lastLoginAt, {
                  addSuffix: true,
                })}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Industries */}
      {member.industries && member.industries.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Industries
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5 px-4 pb-4">
            {member.industries.map((industry: any) => (
              <Badge
                key={industry.id}
                variant="secondary"
                className="text-[11px] font-medium"
              >
                {industry.title}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Job Functions */}
      {member.jobFunctions && member.jobFunctions.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Job Functions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5 px-4 pb-4">
            {member.jobFunctions.map((jf: any) => (
              <Badge
                key={jf.id}
                variant="secondary"
                className="text-[11px] font-medium"
              >
                {jf.title}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {member.skills && member.skills.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5 px-4 pb-4">
            {member.skills.map((skill: any) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="text-[11px] font-medium"
              >
                {skill.title}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills (Legacy) */}
      {user.profile?.skills && user.profile.skills.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Profile Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5 px-4 pb-4">
            {user.profile.skills.map((skill: any, idx: number) => {
              const name =
                typeof skill === "object"
                  ? skill.name || "Unnamed"
                  : String(skill);
              return (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-[11px] font-medium"
                >
                  {String(name)}
                </Badge>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
