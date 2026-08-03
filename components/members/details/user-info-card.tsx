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
  Phone,
  Twitter,
  Linkedin,
  Github,
  Link as LinkIcon,
  Network,
  Circle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
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

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  APPROVED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  BLOCKED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
  REJECTED: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground" },
  DISABLED: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", dot: "bg-orange-500" },
};

function getStatusStyle(status: string) {
  return STATUS_STYLE[status] ?? { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground" };
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
  iconClass,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  iconClass?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-muted/40 transition-colors group">
      <span className="text-muted-foreground text-xs flex items-center gap-2.5">
        <Icon className={cn("h-3.5 w-3.5", iconClass)} /> {label}
      </span>
      <span className="text-xs font-medium text-foreground text-right max-w-[55%] truncate">
        {value}
      </span>
    </div>
  );
}

/* ── Tag Section ─────────────────────────────────────────────────────────── */

function TagSection({
  title,
  items,
  colorClass,
}: {
  title: string;
  items: { id?: string; title?: string; name?: string; skillId?: string }[];
  colorClass?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <Badge
            key={item.id || item.skillId || idx}
            variant="outline"
            className={cn(
              "text-[10px] font-medium px-2.5 py-0.5 rounded-md",
              colorClass || "bg-muted/50 text-foreground/80 border-border/60",
            )}
          >
            {item.title || item.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export function UserInfoCard({ member }: { member: any }) {
  const user = member?.user;
  const [showKyc, setShowKyc] = React.useState(false);
  if (!user) return null;

  const statusStyle = getStatusStyle(member.status);
  const phone = user.profile?.phone;
  const phoneString = phone
    ? `+${phone.countryCode || ""} ${phone.phoneNumber || ""}`.trim()
    : null;

  return (
    <div className="space-y-3">
      {/* ── Profile Card ─────────────────────────────────────────────────── */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        {/* Cover */}
        <div className="h-32 relative">
          {user.cover ? (
            <img
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${user.cover}`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
          )}
          {/* Gradient overlay at bottom for smooth avatar blend */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>

        <CardContent className="relative px-5 pb-5">
          {/* Avatar + Online ring */}
          <div className="flex flex-col items-center -mt-14 space-y-3">
            <div className="relative">
              <Avatar
                className="h-24 w-24 border-4 border-background shadow-lg rounded-full"
              >
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${user.avatar}`}
                  alt={user.firstName}
                />
                <AvatarFallback className="text-xl font-bold bg-muted text-muted-foreground">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name + Title */}
            <div className="text-center space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">
                  {user.firstName} {user.lastName}
                </h2>
                {member.verification?.isVerified && (
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <p className="text-muted-foreground text-sm leading-snug max-w-[260px]">
                {user.profile?.headline ||
                  user.about?.headline ||
                  "Community Member"}
              </p>

              {/* Status badge */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {member.membershipTier && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold gap-1.5 px-2.5"
                    style={{
                      backgroundColor: `${member.membershipTier.badgeColor}15`,
                      color: member.membershipTier.badgeColor,
                      borderColor: `${member.membershipTier.badgeColor}40`,
                    }}
                  >
                    {member.membershipTier.name}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold gap-1.5 px-2.5",
                    statusStyle.bg,
                    statusStyle.text,
                    statusStyle.border,
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      statusStyle.dot,
                    )}
                  />
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* ── Contact info ────────────────────────────────────────────── */}
          <div className="mt-5 space-y-1 border-t border-border/50 pt-4">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground py-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span className="truncate text-xs">{user.email}</span>
            </div>
            {user.location && (
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground py-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                <span className="text-xs">{user.location.name}</span>
              </div>
            )}
            {phoneString && (
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground py-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                <span className="text-xs">{phoneString}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {user.about?.social && user.about.social.length > 0 && (
            <div className="flex gap-1 mt-3 pt-3 border-t border-border/50">
              {user.about.social.map((social: any, idx: number) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title={social.platform}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Account Details ──────────────────────────────────────────────── */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-1 pt-4 px-4">
          <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 pb-2">
          <div className="space-y-0.5">
            <InfoRow
              icon={Calendar}
              iconClass="text-blue-500/70"
              label="Joined"
              value={safeLocaleDateString(user.createdAt)}
            />
            <InfoRow
              icon={UserIcon}
              iconClass="text-violet-500/70"
              label="Member Since"
              value={safeFormatDistanceToNow(user.createdAt, {
                addSuffix: true,
              })}
            />
            <InfoRow
              icon={Network}
              iconClass="text-emerald-500/70"
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
                iconClass="text-amber-500/70"
                label="DOB"
                value={safeLocaleDateString(user.profile.DOB)}
              />
            )}
            <InfoRow
              icon={UserIcon}
              iconClass="text-pink-500/70"
              label="Gender"
              value={user.profile?.gender || "Not specified"}
            />
            <InfoRow
              icon={Globe}
              iconClass="text-sky-500/70"
              label="Language"
              value={user.profile?.language || "English"}
            />
            {user.lastLoginAt && (
              <InfoRow
                icon={Clock}
                iconClass="text-orange-500/70"
                label="Last Login"
                value={safeFormatDistanceToNow(user.lastLoginAt, {
                  addSuffix: true,
                })}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Tags: Industries, Job Functions, Interests, Skills ────────── */}
      {(member.industries?.length > 0 ||
        member.jobFunctions?.length > 0 ||
        member.interests?.length > 0 ||
        member.skills?.length > 0) && (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <TagSection
              title="Industries"
              items={member.industries}
              colorClass="bg-blue-50 text-blue-700 border-blue-200"
            />
            <TagSection
              title="Job Functions"
              items={member.jobFunctions}
              colorClass="bg-violet-50 text-violet-700 border-violet-200"
            />
            <TagSection
              title="Interests"
              items={member.interests}
              colorClass="bg-emerald-50 text-emerald-700 border-emerald-200"
            />
            <TagSection
              title="Skills"
              items={member.skills}
              colorClass="bg-amber-50 text-amber-700 border-amber-200"
            />
          </CardContent>
        </Card>
      )}

      {/* ── Legacy Skills ────────────────────────────────────────────────── */}
      {user.profile?.skills && user.profile.skills.length > 0 && (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <TagSection
              title="Profile Skills"
              items={user.profile.skills.map((skill: any, idx: number) => ({
                id: String(idx),
                name:
                  typeof skill === "object"
                    ? skill.name || "Unnamed"
                    : String(skill),
              }))}
              colorClass="bg-muted/50 text-muted-foreground border-border"
            />
          </CardContent>
        </Card>
      )}

      {/* ── KYC / Application Details (Collapsible) ──────────────────── */}
      {member.userKyc && (
        <Card className="border-border/60 shadow-sm">
          <button
            onClick={() => setShowKyc(!showKyc)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors rounded-t-xl"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Application Details
            </span>
            {showKyc ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          {showKyc && (
            <CardContent className="px-4 pb-4 pt-0 space-y-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">
                  Affliction
                </p>
                <p className="text-xs font-medium">
                  {member.userKyc.affliction?.join(", ") || "None"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">
                  Referral Source
                </p>
                <p className="text-xs font-medium">
                  {member.userKyc.referralSource?.join(", ") || "Direct"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">
                  Internal Note
                </p>
                <p className="text-xs text-muted-foreground italic">
                  {member.userKyc.comment || "No notes."}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
